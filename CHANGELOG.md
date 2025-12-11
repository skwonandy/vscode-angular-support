# Changelog

All notable changes to the "vs-angular-support" extension will be documented in this file.

## [1.0.3] - 2025-12-11

### Changed
- Reduced VSIX package size from 13MB to 2.8MB (78% reduction) by excluding unnecessary TypeScript files

## [1.0.2] - 2025-12-10

### Added
- Published to [Open VSX Registry](https://open-vsx.org/extension/skwonandy/vs-angular-support) for Cursor and other VS Code-compatible editors

## [1.0.0] - 2025-12-10

### Changed
- Renamed extension from `vscode-angular-support` to `vs-angular-support`
- Updated version to 1.0.0
- Updated repository URL to https://github.com/skwonandy/vs-angular-support

## [0.2.0] - 2024-12-09

### Added
- **Angular 21 support**: Added support for new control flow syntax
  - `@if` conditionals
  - `@for` loops with track expression
  - `@switch` and `@case` statements
- **Signal support**: Go to definition for signal properties (e.g., `mySignal()`)

### Changed
- Updated TypeScript to v4.9.5 for better compatibility
- Updated dependencies to modern versions

### Fixed
- Fixed compilation errors with latest TypeScript

## [0.1.4] - 2017-04-14

### Added
- Elvis (?) operator support
- Basic support for go to component definition

## [0.1.3] - 2017-03-27

### Changed
- Go to beginning of definition, not end
- Parse constructors public parameters

## [0.1.2] - 2017-03-23

### Added
- Initial release

---

Based on original work by [VismaLietuva/vscode-angular-support](https://github.com/VismaLietuva/vscode-angular-support)
