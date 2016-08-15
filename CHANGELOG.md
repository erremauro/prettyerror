# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Added
- PrettyError formatting options can now be customized using the `setFormatting` module's method. Formatting options include support for column wrapping, markdown, section colors and labels.
- A chalk instance named `colors` is exposed by the module. Chalk terminal color functions can be used to customize PrettyError's formatting color.
- PrettyError now accept "path" and "inner" (error) properties. If a "path"
  property is passed to PrettyError it will be displayed in the error footer.
- Ability to create PrettyError object from Error object instance.
- This CHANGELOG file to keep track of changes.


### Changed
- Error formatting methods moved to a separate module under `./lib`.

## [0.1.0] - 2016-08-10

### Added
- prettyerror module