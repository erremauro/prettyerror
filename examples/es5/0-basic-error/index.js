/**
 * Shows how to log a basic pretty error
 * @author Roberto Mauro
 * @version 0.1.0
 * @since 0.2.0
 */
var solidErr = require( '../../../index' )
var SolidError = solidErr.SolidError

solidErr.logError( new SolidError( 'Something got wrong.' ) )
