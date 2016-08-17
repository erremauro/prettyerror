/**
 * Shows how to log a custom error from an Error Definitin file.
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.0
 * @since 0.2.0
 */

import path from 'path'
import solidErr, { SolidError, logError } from '../../../index'

// Path that contains your Error Definition files.
let customErrPath = path.join( __dirname, './definitions' )

// Set the additional path in soliderror global options.
solidErr.setOptions({
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
try {
  throwError()
}
catch( err ) {
  // log error using the definition file.
  logError( new SolidError( err ) )
}
