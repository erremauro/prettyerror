# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/). However, note tha **major** API changes could be pushed on a minor semantic version until version 1.0.0 is reached.

## [0.3.2] - 2016-09-01

### Fixed
- A bug that prevented objects extended from SolidError from being rendered correctly was fixed.

## [0.3.1] - 2016-09-01

- Source code converted to typeflow.

### Changed
- Native error's message will now render without error code prefix when using
the default renderer.


## [0.3.0] - 2016-08-21

### Added
- Add `SolidText` object to manipulate and format text: a useful set of
  utilities for coloring text to terminal, format markdown syntax, wordwrap
  text and other stuff. `SolidText` can be used as a helper object for custom
  renderers.

### Changed
- SolidError **has been rewritten to ES6 syntax**. The distributed code is
  built with Babel to ensure compatibility with **node@^4.5.0**.
  This should also give a general boost in code optimization and performance
  (metrics did in fact score a little high than the source code).
- Is now possible to set a **custom renderer** to have complete control on
  how a SolidError renders in the terminal. **Note**: when a custom renderer
  is active, calls to `setStyles` will be ignored.
- `setFormat` has been **renamed** to `setStyles`.
- SolidError `toString` method now renders a default Error output when invoked.
  To render a SolidError in the terminal use `logError`.
- [Chalk][chalk] color object moved to `SolidText`.

## [0.2.1] - 2016-08-17

### Added
- SolidError module options can be customized using the `setOptions` method. Options include support for changing the global language and specify additional
directories to scan for Error definitions.
- SolidError formatting options can now be customized using the `setFormatting` module's method. Formatting options include support for column wrapping, markdown, section colors and labels.
- A [chalk][chalk] instance named `colors` is exposed by the module. Chalk's terminal color functions can be used to customize SolidError's formatting color.
- SolidError now accept "path" and "inner" (error) properties. If a "path"
  property is passed to SolidError it will be displayed in the error footer.
- Ability to create SolidError object from Error object instance.
- This CHANGELOG file to keep track of changes.


### Changed
- Error formatting methods moved to a separate module under `./lib`.

## [0.1.0] - 2016-08-10

### Added
- soliderror module

[chalk]: https://github.com/chalk/chalk "View Chalk project"
