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
var SYSERRORS = [
  'EACCES',
  'EADDRINUSE',
  'ECONNREFUSED',
  'ECONNRESET',
  'EEXIST',
  'EISDIR',
  'EMFILE',
  'ENOENT',
  'ENOTDIR',
  'EPERM',
  'EPIPE',
  'ETIMEDOUT'
]

/**
 * SysErrors global options
 * @memberOf module:lib/syserrors
 * @type {module:lib/syserrors~SysErrorsOptions}
 * @property {string} langDir The current error definition language directory
 * @property {string[]} includeDirs Additional error language directories
 */
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
 * Describe {@link module:lib/syserrors|syserrors} global options.
 * @typedef module:lib/syserrors~SysErrorsOptions
 * @property {string} [lang=en] Language country code
 * @property {string[]} [includes] Additional directory to scan for errors
 *                                 definitions.
 */

/**
 * Set syserrors module global options
 * @memberOf module:lib/syserrors
 * @param {module:lib/syserrors~SysErrorsOptions} props syserrors global options
 * @version 0.1.1
 * @since 0.1.0
 */
function setOptions( props ) {
  if ( typeof props.includes === 'string' ) {
    props.includes = [ props.includes ]
  }

  options = Object.assign( options, props )
  options.langDir = langDir()
  options.includeDirs = includeDirs()
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
 * @version 0.1.0
 * @since 0.1.0
 */
function langDir() {
  return path.join( LANG_DIR, options.lang )
}

/**
 * Get language directories for
 * {module:prettyError~PrettyErrorProps|option included} dirctories.
 * @return {string[]} Language aware directory path
 * @version 0.1.0
 * @since 0.1.0
 */
function includeDirs() {
  return options.includes.map( function( includePath ) {
    return path.join( includePath, options.lang )
  })
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
 * @version 0.1.2
 * @since  0.1.0
 */
function prettyProps( err ) {
  var filename = ( err.code || err.name || 'Uknown' )
    , searchDirs = includeDirs()

  searchDirs.push( langDir() )
  var errProps = getErrorProps( filename, searchDirs )

  if ( !errProps ) {
    return unexpectedError( err )
  }

  return composeErrorProps( err, errProps )
}

/**
 * Search ´dirs´ for a corresponding `name` error definition.
 * @memberOf module:lib/prettyError
 * @param  {string}   name Errot definition name
 * @param  {string[]} dirs     A collection of directories to search for
 * @return {module:lib/prettyError~PrettyErrorProps} Error props or null.
 * @version 0.1.0
 * @since 0.1.0
 */
function getErrorProps( name, dirs ) {
  var filename = name + '.yml'
    , i = 0
    , len = dirs.length

  for ( i = 0; i < len; i++ ) {
    var dir = dirs[ i ]
    if ( !dir ) { continue }

    var errFilePath = path.join( dir, filename )

    try {
      return yaml.safeLoad( fs.readFileSync( errFilePath, 'utf8' ) )
    }
    catch ( readErr ) {
      if ( readErr === 'YAMLException' ) {
        return null
      }

      if ( readErr.code === 'ENOENT' ) { // File not found
        if ( i === len - 1 ) { // is last
          return loadGenericError()
        }
      }
    }
  }

  return null
}

/**
 * Load a language aware Generic Error file.
 * @return {module:lib/prettyError~PrettyErrorProps} Generic Error props
 * @version 0.1.0
 * @since 0.1.0
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
 * @version 0.1.0
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
 * @version 0.1.1
 * @since 0.1.0
 */
function composeErrorProps( err, props ) {
  props.inner = err
  if ( err.path ) { props.path = err.path }

  if ( err.name !== 'Error' ) {
    props.name = err.name
    props.message = err.name.match( /[A-Z][a-z]+/g ).join(' ').trim()
    props.errname = err.name.replace( 'Error', '' )
  }

  var iarticle = props.message.slice(0, 1).match( /[AEIOU]/g ) ? 'An ' : 'A '
  props.describe = iarticle + props.message + ' occurred.'
  props.describe = err.message ?
    formatMessage( err.message ) :
    props.describe
  return props
}

/**
 * Strip syserror code from `message` and capitalize it.
 * @param  {string} message An error message
 * @return {string}
 * @version 0.1.0
 * @since 0.1.0
 */
function formatMessage( message ) {
  var message = message
    .replace( /^E[A-Z]+\:\s/g, '' ) // remove err.code
  return message
    .charAt(0).toUpperCase() + message.slice(1) // capitalize first letter
}

