/**
 * @module lib/syserrors
 * @author  Roberto Mauro <erremauor@icloud.com>
 * @version 0.1.0
 * @since  0.2.0
 */

var path = require( 'path' )

/**
 * Map SysError codes to PrettyErrors' props generating functions
 * @type {Object}
 * @const
 */
var SYSERRORS = {
  UNEXPECTED: unexpectedError,
  ENOENT: fileOrDirNotFoundError,
}

module.exports = {
  prettyProps: prettyProps,
}

/**
 * Create {@link module:lib/prettyError~PrettyErrorProps} from a standard
 * `Error` object. If an unknonw error is given, properties for an unexpected
 * error will be returned instead.
 *
 * @memberOf module:lib/syserrors
 *
 * @param  {Error} err  An error to be convrted.
 * @return {lib/prettyError~PrettyErrorProps}
 *
 * @since  0.1.0
 */
function prettyProps( err ) {
  var errProps = SYSERRORS[ err.code || '' ]
  if ( typeof errProps === 'function' ) {
    return errProps( err )
  }
  return unexpectedError()
}

/**
 * Get {@link module:lib/prettyError~PrettyErrorProps } properties
 * for an unexpected error.
 * @param  {Error} innerError  An Error object
 * @return {module:lib/prettyError~PrettyErrorProps}  PrettyErrors' props
 * @since  0.1.0
 */
function unexpectedError( innerError ) {
  var errProps = {
    code: 'EUNK',
    message: 'Unexpected error',
    describe: 'This operation cannot be completed because an unexpected error '
      + 'occurred.',
    explain: 'Unfortunately this error was not expected to occur and no '
      + 'specific explanation can be provided.\n',
    inner: innerError,
  }
  return errProps
}

/**
 * Get {@link module:lib/prettyError~PrettyErrorProps } properties
 * for ENOENT syserror.
 * @param  {Error} err An Error object
 * @return {module:lib/prettyError~PrettyErrorProps}  PrettyErrors' props
 * @since  0.1.0
 */
function fileOrDirNotFoundError( err ) {
  var basename = path.basename( err.path )
  var dirname = path.dirname( err.path )

  var errProps = {
    code: err.code,
    path: err.path,
    message: 'File or directory not found',
    describe: 'A file or a directory could not be found at path: "' + err.path + '"',
    explain: 'This application expected to find a file or a directory named "'
      + basename + '" at path "' + dirname + '" but none was found.\n\n'
      + 'This can happen when trying to execute a command from the wrong path '
      + 'or if a required file/directory was removed. '
      + 'Verify your execution path.',
    example: 'To verify your current path type:\n\n'
      + '    pwd\n\n'
      + 'To verify the content of "' + dirname + '" type:\n\n'
      + '    ls -l ' + dirname,
  }

  return errProps
}
