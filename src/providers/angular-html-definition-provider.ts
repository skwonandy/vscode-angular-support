import {
  CancellationToken, Position, DefinitionProvider,
  TextDocument, Definition, Location, Uri, workspace
} from 'vscode';
import * as fs from 'fs';
import * as ts from 'typescript';
import * as utils from '../utils';
import { TypescriptSyntaxParser } from '../parsers/typescript-syntax-parser';

export class AngularHtmlDefinitionProvider implements DefinitionProvider {

  async provideDefinition(document: TextDocument, position: Position, token: CancellationToken) {
    const lineText = document.lineAt(position).text;

    const propertyRegexps = [
      // Interpolation. ex: {{ myProp }}
      /({{)([^}]+)}}/g,

      // Input attributes. ex: [(...)]="myProp"
      /(\[\(?[\w\.\-?]*\)?\]=")([^"]+)"/g,

      // Output attributes. ex: (...)="myMethod(...)"
      /(\([\w\.]*\)=")([^"]+)"/g,

      // Structural attributes. ex: *ngIf="myProp"
      /(\*\w+=")([^"]+)"/g,

      // New control flow - @if. ex: @if (myProp) { }
      /(@if\s*\()([^)]+)\)/g,

      // New control flow - @for. ex: @for (item of items; track item.id) { }
      /(@for\s*\([^;]+;\s*track\s+)([^)]+)\)/g,
      /(@for\s*\()([^\s;]+)/g,

      // New control flow - @switch. ex: @switch (myProp) { }
      /(@switch\s*\()([^)]+)\)/g,

      // New control flow - @case. ex: @case (myProp) { }
      /(@case\s*\()([^)]+)\)/g
    ];
    const propertyMatch = utils.parseByLocationRegexps(lineText, position.character, propertyRegexps);
    if (!!propertyMatch) {
      return await this.propertyDefinition(document, position);
    }

    // Element. ex: <my-element ...>...</my-element>
    const elementRegexp = /(<\/?)([a-zA-Z0-9-]+)/g;
    const elementMatch = utils.parseByLocationRegexp(lineText, position.character, elementRegexp);
    if (!!elementMatch) {
      return await this.elementDefinition(elementMatch);
    }

    return null;
  }

  private async elementDefinition(selector: string) {
    const expectedFileName = `**/${selector.replace(/(\w+-)/, (f) => '')}.component.ts`;
    const foundFiles = await workspace.findFiles(expectedFileName, '**∕node_modules∕**', 2);

    // To be sure of defition origin return only when there is one match.
    if (foundFiles.length === 1) {
      return new Location(Uri.file(foundFiles[0].path), new Position(0, 0));
    }

    return null;
  }

  private async propertyDefinition(document: TextDocument, position: Position) {
    // Support signals with () - ex: mySignal() or regular properties
    const range = document.getWordRangeAtPosition(position, /[$\w]+/);
    if (!range) return null;

    let propertyName = document.getText(range);
    
    // Check if this is a signal call by looking ahead for ()
    const lineText = document.lineAt(position).text;
    const afterRange = lineText.substring(range.end.character);
    const isSignalCall = /^\s*\(/.test(afterRange);
    
    const componentFilePath = document.fileName.substr(0, document.fileName.lastIndexOf('.')) + '.ts';

    const sourceFile = await TypescriptSyntaxParser.parseSourceFile(componentFilePath);
    if (!sourceFile) return null;

    const recursiveSyntaxKinds = [ts.SyntaxKind.ClassDeclaration, ts.SyntaxKind.Constructor];
    const foundNode = TypescriptSyntaxParser.findNode<ts.NamedDeclaration>(sourceFile, (node) => {
      let declaration = node as ts.NamedDeclaration;
      switch (node.kind) {
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
          // Match property/method name
          if (!!declaration.name && declaration.name.getText() === propertyName) {
            // For signal calls mySignal(), also accept properties that might be signals
            return true;
          }
          return false;
        case ts.SyntaxKind.Parameter:
          const publicAccessor = TypescriptSyntaxParser.findNode(node, (cn) => cn.kind === ts.SyntaxKind.PublicKeyword);
          return node.parent.kind == ts.SyntaxKind.Constructor
            && !!declaration.name && declaration.name.getText() === propertyName
            && !!publicAccessor;
      }

      return false;
    }, recursiveSyntaxKinds);

    if (!foundNode || !foundNode.name) return null;

    const declarationPos = TypescriptSyntaxParser.parsePosition(sourceFile, foundNode.name.getStart());
    if (!declarationPos) return null;

    return new Location(Uri.file(componentFilePath), declarationPos);
  }
}