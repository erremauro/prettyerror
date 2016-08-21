/**
 * Expose {@link lib/exterror~ExtError|Extendable Error} class.
 * @module lib/exterror
 * @author Roberto Mauro <erremauro@icloud.com>
 * @since 0.3.0
 * @version 0.1.0
 */

/**
 * @class
 * @classdesc
 * An Extendable Error class. Standard object like Date and Error cannot be
 * currently extended in ES6. This class provide retrocompatibility with
 * Error extendability.
 * @extends {Error}
 * @property {string} message The error message
 * @property {string} name The error name
 * @property {stack} string The error stack trace.
 * @description  Subclass Error object and capture current stack trace.
 * @param {string} [message] An error message
 * @since 0.1.0
 * @version 0.1.0
 */
function ExtError( message ) {
  Error.captureStackTrace( this, this.constructor )

  this.name = 'Error'
  this.message = message

  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(this, this.constructor)
  }
  else { 
    this.stack = ( new Error( message ) ).stack
  }
}
ExtError.prototype = Object.create( Error.prototype, ExtError.prototype )
ExtError.prototype.constructor = ExtError

module.exports = ExtError
