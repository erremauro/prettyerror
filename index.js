/**
 * @module  prettyError
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.2.0
 *
 * @property {module:prettyError~PrettyError} PrettyError PrettyError object
 * @property {Function}   create  Create a PrettyError instance
 * @property {Function} log Log a PrettyError to the console
 */

var fmterr = require( './lib/fmtutil' ).format
var syserrors = require( './lib/syserrors' )

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
 * @property {string}  name      Error name (i.e. FileNotFoundError)
 * @property {string}  errname   Error name without suffix (i.e. FileNotFound)
 * @property {!string} message   An error message
 * @property {string} [describe] A long description of the error
 * @property {string} [explain]  An explanation about how to avoid the error
 * @property {number} [code]     An error code
 * @property {string} [path]     Path to file or directory related to the error
 * @property {Error}  [inner]    An inner error wrapped by PrettyError
 *
 * @version 0.2.0
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
 * @version 0.2.0
 * @since 0.1.0
 * */
function PrettyError( message, props ) {
  Error.captureStackTrace( this, this.constructor )
  this.pretty = true

  // Check if "message" is really an Error instance and assign this
  // to the `inner` PrettyError's props.
  if ( typeof message === 'object' && message.hasOwnProperty( 'stack' ) ) {
    props = Object.assign( ( props || {} ), { inner: message } )
  }
  else if ( typeof message === 'string' ) {
    this.message = message
  }

  this._setProps( props )
}
PrettyError.prototype = Object.create( Error.prototype, PrettyError.prototype )
PrettyError.prototype.constructor = PrettyError

PrettyError.prototype._setProps = function( props ) {
  this.code = props.code || this.code || 0
  this.errname = props.name || this.name || 'Error'
  this.name = ( props.name || '' ) + 'Error'
  this.describe = props.describe || props.description || this.describe || ''
  this.explain = props.explain || props.explanation || this.explain || ''
  this.example = props.example || props.hint || this.example || ''
  this.path = props.path || this.path || ''
  this.inner = props.inner || this.inner || null
  this.message = props.message || this.message || ''
}

/**
 * Return a pretty formatted error
 *
 * @methodOf module:prettyError~PrettyErrorProps
 * @return {string} Pretty error text
 *
 * @version 0.2.0
 * @since 0.1.0
 */
PrettyError.prototype.toString = function() {
  var props = Object.assign({}, this )
  var fmtTrace = ''

  if ( !this.message && this.inner ) {
    props = syserrors.prettyProps( this.inner )
    fmtTrace = fmterr.trace( this.inner.stack )
  }

  var result = fmterr.header( props.message )
  result += fmterr.describe( props.describe )

  if ( props.explain ) {
    result += fmterr.explain( props.explain )
  }

  if ( props.example ) {
    result += fmterr.example( props.example )
  }

  if ( props.code === 'EUKN' ) {
    result += fmtTrace
  }

  result += fmterr.footer( props.code, props.path )

  return result
}
