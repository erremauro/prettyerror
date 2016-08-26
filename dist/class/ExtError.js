'use strict';

/**
 * @module class/ExtError
 * @author Roberto Mauro <erremauro@icloud.com>
 * @license {@link https://opensource.org/licenses/MIT|MIT License}.
 * @version 0.1.1
 * @since 0.3.0
 */

/**
 * The node Error object
 * @external Error
 * @see {@link https://nodejs.org/api/errors.html#errors_class_error|Error}
 */

/**
 * @class
 * @classdesc
 * An Extendable Error class. Provide retro-compatibility with
 * Error extendability in ES6.
 *
 * @property {string} name The error name
 * @property {string} message The error message
 * @property {string} stack The error stack trace
 *
 * @param {?string} message An error message
 *
 * @extends {external:Error}
 * @since 0.3.0
 * @version 0.1.1
 */
function ExtError(message) {
  Error.captureStackTrace(this, this.constructor);

  this.name = 'Error';
  this.message = message;

  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error(message).stack;
  }
}
ExtError.prototype = Object.create(Error.prototype, ExtError.prototype);
ExtError.prototype.constructor = ExtError;

module.exports = ExtError;