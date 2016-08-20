/**
 * Shows how to use custom languages and overriding default system errors.
 * @see examples/es6/3-using-error-definitions
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.0
 * @since 0.2.0
 */
const fs = require( 'fs' )
const path = require( 'path' )
const solidError = require( '../../dist/index' )
const SolidError = solidError.SolidError
const logError = solidError.logError

// Path that contains your Error Definitions files
const customErrPath = path.join( __dirname, './definitions' )

solidError.setOptions({
  lang: 'it',                   // set the language to 'it'
  includes: [ customErrPath ]
})
solidError.setStyles({
  headerTitle: 'ERRORE:',
})

try {
  // raise ENOENT (file or directory not found ) error
  fs.readFileSync( '/non/existent/file' )
}
catch( readErr ) {
  // log translated error.
  logError( new SolidError( readErr ) )
}
