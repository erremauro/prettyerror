/**
 * Shows how to log a custom error from an Error Definitin file.
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.0
 * @since 0.2.0
 */

var path = require( 'path' )
var solidErr = require( '../../../index' )
var SolidError = solidErr.SolidError

// Path that contains your Error Definition files.
var customErrPath = path.join( __dirname, './definitions' )

// Set the additional path in soliderror global options.
solidErr.setOptions({
  includes: [ customErrPath ],
})

/**
 * A custom error class defined in your program.
 */
function CustomError( message ) {
  Error.captureStackTrace( this, this.constructor )
  this.name = 'CustomError'
}
CustomError.prototype = Object.create( Error.prototype, CustomError.prototype )
CustomError.prototype.constructor = CustomError

/**
 * A function that throws your custom error
 * @throw {CustomError}
 */
function throwError() {
  throw new CustomError()
}

// try-catch block that raises an error
try {
  throwError()
}
catch( err ) {
  // log error using the definition file.
  solidErr.logError( new SolidError( err ) )
}
