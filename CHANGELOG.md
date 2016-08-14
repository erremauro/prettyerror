# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Added
- This CHANGELOG file to keep track of changes.
- Explain and Example error section now support Markdown syntax.
- PrettyError now accept "path" and "inner" (error) properties. If a "path"
  property is passed to PrettyError it will be displayed in the error footer.


### Changed
- Error formatting methods moved to a separate module under `./lib`.

## [0.1.0] - 2016-08-10

### Added
- prettyerror module