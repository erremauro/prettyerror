/**
 * @module lib/syserrors
 * @author  Roberto Mauro <erremauor@icloud.com>
 * @version 0.1.0
 * @since  0.2.0
 */

var path = require( 'path' )
var fs = require( 'fs' )
var yaml = require( 'js-yaml' )
var Defaults = require( './defaults' )

var LANG_DIR = path.join( __dirname, '../lang/' )

var options = {
  lang: Defaults.LANG,
  includes: []
}

setOptions( options )

module.exports = {
  setOptions: setOptions,
  getOptions: getOptions,
  prettyProps: prettyProps,
}

///////////////

/**
 * Defines {@link module:lib/syserrors|syserrors} global options.
 * @typedef module:lib/syserrors~SysErrorsOptions
 * @property {string} [lang=en] Language country code
 * @property {string[]} [includes] Additional directory to scan for errors
 *                                 definitions.
 */

/**
 * Set syserrors module global options
 * @memberOf module:lib/syserrors
 * @param {module:lib/syserrors~SysErrorsOptions} props syserrors global options
 * @version 0.1.0
 * @since 0.1.0
 */
function setOptions( props ) {
  options = Object.assign( {}, options, props )
  options.langDir = langDir()
}

/**
 * Get the module's current global options
 * @memberOf module:lib/syserrors
 * @return {module:lib/syserrors~SysErrorsOptions} syserrors global options
 * @version 0.1.0
 * @since 0.1.0
 */
function getOptions() {
  return options
}

/**
 * Get the language directory path based on the current
 * {@link module:lib/syserrors.options|`lang` option}.
 * @return {string} Language aware directory path
 */
function langDir() {
  return path.join( LANG_DIR, options.lang )
}

/**
 * Create {@link module:prettyError~PrettyErrorProps|PrettyErrorProps}
 * from a standard`Error` object. If an unknonw error is given, properties for
 * an unexpected error will be returned instead.
 *
 * @memberOf module:lib/syserrors
 *
 * @param  {Error} err  An error to be convrted.
 * @return {module:lib/prettyError~PrettyErrorProps}
 *
 * @version 0.1.1
 * @since  0.1.0
 */
function prettyProps( err ) {
  var errFileName = ( err.code || err.name || 'Uknown' ) + '.yml'
  var errFilePath = path.join( langDir(), errFileName )

  try{
    var errProps = yaml.safeLoad( fs.readFileSync( errFilePath, 'utf8' ) )
    return composeErrorProps( err, errProps )
  }
  catch( readErr ) {
    if ( readErr.name === 'YAMLException' ) {
      // TODO: Manage 'yml' parse exception
    }

    if ( readErr.code === 'ENOENT' ) {
      return composeErrorProps( err, loadGenericError() )
    }
    // TODO: Manage non existent file
    return unexpectedError( err )
  }
}

/**
 * Load a language aware Generic Error file.
 * @return {module:lib/prettyError~PrettyErrorProps} Generic Error props
 */
function loadGenericError() {
  try {
    var errFilePath = path.join( langDir(), 'Error.yml' )
    return yaml.safeLoad( fs.readFileSync( errFilePath, 'utf8' ) )
  }
  catch( readErr ) {
    return null
  }
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
    code: 'EUNX',
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
 * Merge an Error with given
 * {@link module:prettyError~PrettyErrorProps|properties}
 *
 * @memberOf module:lib/syserrors
 *
 * @param  {Error} err   The source error
 * @param  {module:prettyError~PrettyErrorProps}  props PrettyError properties
 * @return {module:prettyError~PrettyErrorProps}
 *
 * @version 0.1.0
 * @since 0.1.0
 */
function composeErrorProps( err, props ) {
  props.inner = err

  if ( err.name !== 'Error' ) {
    props.name = err.name
    props.errname = err.name.replace( 'Error', '' )
    props.message = err.name.match( /[A-Z][a-z]+/g ).join(' ').trim()
  }

  var iarticle = props.message.slice(0, 1).match( /[AEIOU]/g ) ? 'An ' : 'A '
  props.describe = iarticle + props.message + ' occurred.'
  props.describe = err.message ? err.message : props.describe
  return props
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
