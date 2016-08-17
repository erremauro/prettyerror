/**
 * Shows how to log a wrapped system error with SolidError
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.0
 * @since 0.2.0
 */
import fs from 'fs'
import { SolidError, logError } from '../../../index'

fs.readFile( '/non/existent/file', ( err, data ) => {
  if ( err ) {
    let readErr = new SolidError( err )
    logError( readErr )
  }
})
