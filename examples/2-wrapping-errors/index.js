/**
 * Shows how to log a wrapped system error with SolidError
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.1
 * @since 0.2.0
 */
const fs = require( 'fs' )
const solidError = require( '../../dist/index' )
const SolidError = solidError.SolidError
const logError = solidError.logError

fs.readFile( '/non/existent/file', ( err, data ) => {
  if ( err ) {
    const readErr = new SolidError( err )
    return logError( readErr )
  }

  if ( data ) {
    console.log( 'Data received', data )
  }
})
