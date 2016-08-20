/**
 * Shows how to log a custom error from an Error Definitin file.
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.1
 * @since 0.2.0
 */
const path = require( 'path' )
const solidError = require( '../../dist/index' )
const SolidError = solidError.SolidError
const logError = solidError.logError

// Path that contains your Error Definition files.
const customErrPath = path.join( __dirname, './definitions' )

// Set the additional path in soliderror global options.
solidError.setOptions({
  includes: [ customErrPath ],
})

/**
 * A custom error class defined in your program.
 */
class CustomError extends Error {
  constructor( message ) {
    super( message )
    this.name = 'CustomError'
  }
}

/**
 * A function that throws your custom error
 * @throw {CustomError}
 */
function throwError() {
  throw new CustomError()
}

// try-catch block that raises an error
try {
  throwError()
}
catch ( err ) {
  // log error using the definition file.
  logError( new SolidError( err ) )
}
