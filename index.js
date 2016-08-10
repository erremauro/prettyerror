/**
 * @module  prettyError
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.0
 *
 * @property {module:prettyError~PrettyError} PrettyError PrettyError object
 * @property {Function}   create  Create a PrettyErro instance
 * @property {Function} log Log a PrettyError to the console
 */

/**
 * Maximum allowed chars per line
 * @const
 * @type {Number}
 */
var MAX_CHARS = 80

var colors = require( 'chalk' )
var wordwrap = require( 'wordwrap')( MAX_CHARS )

module.exports = {
  PrettyError: PrettyError,
  createError: create,
  logError: log,
}

/**
 * PrettyError properties
 *
 * @memberOf module:prettyError
 * @typedef module:prettyError~PrettyErrorProps
 *
 * @property {string}  name      Error name (i.e. FileNotFound)
 * @property {!string} message   An error message
 * @property {string} [describe] A long description of the error.
 * @property {string} [explain]  An explanation about how to avoid the error
 * @property {number} [code]     An error code.
 * @property {string} [filepath] Path to file or directory related to the error.
 *
 * @version 0.1.0
 * @since 0.1.0
 */

/**
 * Crates a PrettyError instance
 *
 * @memberOf module:prettyError
 *
 * @param  {string} message Error message
 * @param  {module:prettyError~PrettyErrorProps} props   Error properties
 * @return {module:prettyError~PrettyError}          A PrettyError instance
 *
 * @version  0.1.0
 * @since 0.1.0
 */
function create( message, props ) {
  return new PrettyError( message, props )
}

/**
 * Log an error to the console. Pretty unuseful, unless you have to print
 * a PrettyError.
 *
 * @memberOf module:prettyError
 *
 * @param  {Error} error An error to be printed to the console.
 *
 * @version 0.1.0
 * @since 0.1.0
 */
function log( error ) {
  if ( error.hasOwnProperty( 'pretty' ) ) {
    return console.log( '' + error )
  }
  return console.log( error )
}

/**
 * @class
 * @classdesc
 *
 * An Error that accept in-depth error explanation and return a clear and
 * formatted error message when printed to the console or converted to string.
 *
 * @extends {Error}
 * @memberOf module:prettyError
 *
 * @description
 *
 * Initialize a new PrettyError instance with provided message and optional
 * properties.
 *
 * @param {string} message The error message.
 * @param {module:prettyError~PrettyErrorProps} props   PrettyError properties
 *
 * @version 0.1.0
 * @since 0.1.0
 * */
function PrettyError( message, props ) {
  Error.captureStackTrace( this, this.constructor )
  this.pretty = true
  this.message = message
  this.errname = props.name || ''
  this.name = this.errname + 'Error'
  this.code = props.code || 0
  this.describe = props.describe || ''
  this.explain = props.explain || ''
  this.example = props.example || ''
  this.filepath = props.filepath || ''
}
PrettyError.prototype = Object.create( Error.prototype, PrettyError.prototype )
PrettyError.prototype.constructor = PrettyError

/**
 * Return a pretty formatted error
 *
 * @methodOf module:prettyError~PrettyErrorProps
 * @return {string} Pretty error text
 *
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyError.prototype.toString = function() {
  var message = fmtHeader( this.message )
  message += fmtDescribe( this.describe )

  if ( this.explain ) {
    message += fmtExplain( this.explain )
  }

  if ( this.example ) {
    message += fmtExample( this.example )
  }

  message += fmtInfo( this.code, this.filepath )

  return message
}

function fmtHeader( message ) {
  var prefix = '\n==== ERROR: '
  var suffix = ' ===='
  var minLen = prefix.length + suffix.length
  var fmt = prefix
  fmt += truncate( message, ( MAX_CHARS - minLen ) )
  fmt += suffix

  while( fmt.length < MAX_CHARS ) {
    fmt += '='
  }

  fmt += '\n'

  return colors.cyan( fmt )
}

function fmtDescribe( description ) {
  return colors.yellow( '\n' + wordwrap( description ) + '\n' )
}

function fmtExplain( explanation ) {
  return '\n' + wordwrap( explanation ) + '\n'
}

function fmtExample( example ) {
  var fmt = getDivider( 'EXAMPLE' ) + '\n'
  fmt += wordwrap( example )
  return fmt + '\n'
}

function fmtInfo( code, filepath ) {
  if ( !code && !filepath )  { return '' }

  var fmt = '\n' + getDivider()
  if ( code ) {
    fmt += 'Code:\t' + code + '\n'
  }
  if ( filepath ) {
    fmt += 'Path:\t' + filepath + '\n'
  }
  return colors.blue( fmt + getDivider() )
}

/**
 * Return a divider with an optional title
 * @inner
 *
 * @param  {string} [title] A title for the divider.
 * @return {string}       A divider with an optional title.
 *
 * @version 0.1.0
 * @since 0.1.0
 */
function getDivider( title ) {
  var divider = title ? '\n---- ' + title + ' ' : ''
  var len = MAX_CHARS - divider.length
  for ( var i = 0; i < len; i++ ) {
    divider += '-'
  }
  return divider + '\n'
}

function truncate( string, maxlen ) {
  var maxlen = maxlen || MAX_CHARS
  var msglen = maxlen - 3
  if ( string.length > maxlen ){
    return string.substring( 0, msglen ) + '...';
  }
  else {
    return string;
  }
}
