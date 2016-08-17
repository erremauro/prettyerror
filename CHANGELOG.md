# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/). However, note tha **major** API changes could be pushed on a minor semantic version until version 1.0.0 is reached.

## [0.2.1] - 2016-08-17

### Added
- SolidError module options can be customized using the `setOptions` method. Options include support for changing the global language and specify additional
directories to scan for Error definitions.
- SolidError formatting options can now be customized using the `setFormatting` module's method. Formatting options include support for column wrapping, markdown, section colors and labels.
- A chalk instance named `colors` is exposed by the module. Chalk terminal color functions can be used to customize SolidError's formatting color.
- SolidError now accept "path" and "inner" (error) properties. If a "path"
  property is passed to SolidError it will be displayed in the error footer.
- Ability to create SolidError object from Error object instance.
- This CHANGELOG file to keep track of changes.


### Changed
- Error formatting methods moved to a separate module under `./lib`.

## [0.1.0] - 2016-08-10

### Added
- soliderror module
