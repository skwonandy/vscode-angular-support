# vscode-angular-support

Very lightweight language support for angular definitions. **Now supports Angular 21!**

> **Note**: This is a fork of [VismaLietuva/vscode-angular-support](https://github.com/VismaLietuva/vscode-angular-support) with updated dependencies and Angular 21 support. The original project has not been maintained since 2017, so this fork brings it up to date with modern Angular versions.

## Prerequisites

- Angular 2+ with **Typescript** (including Angular 21)
- [Official style guide](https://angular.io/docs/ts/latest/guide/style-guide.html#!#naming) file & selector naming

## Features

Go to / peek definition from:
- interpolation `{{ myVar }}`
- input `[(...)]="myVar"`
- output `(...)="myMethod()"`
- `templateUrl` or `styleUrls` in `@Component` decorator
- component `<my-component></my-component>`
- **NEW:** Angular 17+ control flow syntax:
  - `@if (condition) { }`
  - `@for (item of items; track item.id) { }`
  - `@switch (value) { }` and `@case (value) { }`
- **NEW:** Signal support `{{ mySignal() }}`

![working](images/example.gif)

## Changes from Original

This fork includes the following improvements:

- ✅ **Angular 21 support** with new control flow syntax (`@if`, `@for`, `@switch`)
- ✅ **Signal support** for reactive programming
- ✅ **Updated TypeScript** (2.0.3 → 4.9.5)
- ✅ **Modern dependencies** (Node types, VS Code API, etc.)
- ✅ **Fixed compilation errors** for compatibility with latest tools
- ✅ **PNG icon** (VSIX packaging requirement)

## Contributing

Contributions are extremely welcome.  
Read [official extension guide](https://code.visualstudio.com/docs/extensions/overview).

## License

MIT