/**
 * Shows how to log a basic pretty error
 * @author Roberto Mauro
 * @version 0.1.0
 * @since 0.2.0
 */
import { SolidError, logError } from '../../../index'

logError( new SolidError( 'Something got wrong.' ) )
