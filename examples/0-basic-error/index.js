/**
 * Shows how to log a basic pretty error
 * @author Roberto Mauro
 * @version 0.1.1
 * @since 0.2.0
 */
const solidError = require( '../../dist/index' )
const SolidError = solidError.SolidError
const logError = solidError.logError

logError( new SolidError( 'Something went wrong.' ) )
