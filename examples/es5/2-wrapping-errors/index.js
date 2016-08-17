/**
 * Shows how to log a wrapped system error with SolidError
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.0
 * @since 0.2.0
 */
var fs = require( 'fs' )
var solidErr = require( '../../../index' )
var SolidError = solidErr.SolidError

fs.readFile( '/non/existent/file', function( err, data ) {
  if ( err ) {
    var readErr = new SolidError( err )
    solidErr.logError( readErr )
  }
})
