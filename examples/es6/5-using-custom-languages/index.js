/**
 * Shows how to use custom languages and overriding default system errors.
 * @see examples/es6/3-using-error-definitions
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.0
 * @since 0.2.0
 */
import fs from 'fs'
import path from 'path'
import solidErr, { createError, logError } from '../../../index'

// Path that contains your Error Definitions files
const customErrPath = path.join( __dirname, './definitions' )

solidErr.setOptions({
  lang: 'it',                   // set the language to 'it'
  includes: [ customErrPath ]
})

solidErr.setFormat({
  headerTitle: 'ERRORE',
})

try {
  // raise ENOENT (file or directory not found ) error
  fs.readFileSync( '/non/existent/file' )
}
catch( readErr ) {
  // log translated error.
  // you can also use the helper method `createError`
  // to create SolidError instances.
  logError( createError( readErr ) )
}
