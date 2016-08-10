var fs = require( 'fs' )
var path = require( 'path' )
var prettyError = require( './index' )

var dirName = 'myNonExistentDir'
var destDir = path.join( process.cwd(), dirName )

fs.stat( destDir, function( statErr, stat ) {
  if ( statErr ) {
    if ( statErr.errno === -2 ) { // not found
        var errMsg = prettyError
          .createError( 'Path not found', {
            code: -2,
            name: 'PathNotFound',
            filepath: destDir,
            describe: 'Required directory is missing from current path.',
            explain: 'The application was expecting to found a directory named '
              + '"' + dirName + '" at path "' + path.dirname( destDir )
              + '", but none was found. Please verify your current path.',
            example: 'To check your current path, type `pwd` in your terminal '
              + 'and press [ENTER]:\n\n$ pwd\n\t/path/to/your/current/dir',
          }
        )
       return prettyError.logError( errMsg )
    }
    throw statErr
  }
})
