var gulp = require( 'gulp' )
var fs = require( 'fs-extra' )
var path = require( 'path' )
var pkg = require( './package.json' )
var chalk = require( 'chalk' )
var jest  = require( 'jest-cli' )
var sequence = require( 'run-sequence' )
var exec = require( 'child_process' ).exec
var $ = require( 'gulp-load-plugins' )()

// ==== CONFIGURATIONS ======================================================

var srcDir = './src'
var buildDir = './dist'
var docsDir = './docs'
var jsdocReadme = './.readme.jsdoc.md'

/**
 * General configurations
 * consumed by tasks.
 */
var config = {
  buildDir: buildDir,
  srcDir: srcDir,
  docsDir: docsDir,
  devDocsDir:  docsDir + '/dev',
  defsDir: srcDir + '/**/*.yaml',
  testDir: './__tests__',
  srcJs: 'src/**/*.js',
  babelrc: './.babelrc',
  eslintrc: './.eslintrc.json',
  jsdoc: 'jsdoc --readme ' + jsdocReadme + ' -c .jsdoc.json',
  jsdocReadme: jsdocReadme,
  changeLog: './CHANGELOG.md',
  lcovInfo: './coverage/lcov.info',
  eslintDirs: [ '**src/**/*.js', '!node_modules', '!**/api.jsdoc']
}

// ==== TASKS ===============================================================

/**
 * @name          default
 * @description   The default task
 */
gulp.task( 'default', [ 'help' ], function () {

})

gulp.task( 'help', $.taskListing )

gulp.task( 'test', function ( done ) {
  logInfo( 'Running test...' )
  sequence(
    'build-test',
    'sync-definitions',
    'run-test',
    'build',
    done
  )
})

gulp.task( 'ci-test', function ( done ) {
  logInfo( 'Running travis test...' )
  sequence(
    'build-test',
    'run-test-coverage',
    'run-codecov',
    'build',
    done
  )
})

/**
 * @name         build-docs
 * @description  Build developer documentation with jsdoc.
 */
gulp.task('docs', function ( done ) {
  logInfo('Building documentation...')
  createDocReadme( function () {
    exec( config.jsdoc, function ( err, stdout, stderr ) {
      if ( err ) throw err
      fs.unlink( config.jsdocReadme )
      done()
    })
  })
})

/**
 * @name        run-test
 * @description Run tests with Jest CLI
 */
gulp.task( 'run-test', function () {
  logInfo( 'Running tests....' )
  return gulp
    .src( config.testDir )
    .pipe( $.jest() )
})

/**
 * @name        run-test
 * @description Run tests with Jest CLI
 */
gulp.task( 'run-test-coverage', function () {
  logInfo( 'Running tests with coverage reporting....' )
  return gulp
    .src( config.testDir )
    .pipe( $.jest({ collectCoverage: true }) )
})

gulp.task( 'run-codecov', function () {
  logInfo( 'Sending coverage info to codecov...' )
  return gulp
    .src( config.lcovInfo )
    .pipe( $.plumber({
      errorHandler: function ( err ) {
        this.emit('end')
      }
    }))
    .pipe( $.codecov() )
})

/**
 * @name         build-test
 * @description  Clean build dir and transpile src using rewire for testing
 */
gulp.task( 'build-test', function () {
  logInfo( 'Building tests....' )

  fs.ensureDirSync( config.buildDir )
  var babelrc = JSON.parse( fs.readFileSync( config.babelrc ) )
  babelrc.plugins.push('rewire')

  return gulp
    .src( config.srcJs )
    .pipe( $.plumber() )
    .pipe( $.babel( babelrc ) )
    .pipe( gulp.dest( config.buildDir ) )
})

/**
 * @name          watch-source
 * @description   Watch source dir and rebuild on file changes.
 */
gulp.task( 'watch', function () {
  logInfo( 'Watching sources for changes' )
  return gulp.watch( config.srcJs, [ 'typecheck', 'run-build' ] )
})

/**
 * @name          sync-definitions
 * @description   Move all error definitions under the build dir
 */
gulp.task( 'sync-definitions', function() {
  return gulp
    .src( config.defsDir )
    .pipe( gulp.dest( config.buildDir ) )
})

/**
 * @name          run-build
 * @description   Parse sources with Babel and ouput results to build dir.
 */
gulp.task( 'build', function () {
  logInfo( 'Building sources' )

  fs.ensureDirSync( config.buildDir )
  var babelrc = JSON.parse( fs.readFileSync( config.babelrc ) )

  return gulp
    .src( config.srcJs )
    .pipe( $.cached( 'building' ) )
    .pipe( $.plumber() )
    .pipe( $.babel( babelrc ) )
    .pipe( gulp.dest( config.buildDir ) )
})

/**
 * @name          lint
 * @description   Lint sources with eslint
 */
gulp.task( 'lint', function () {
  logInfo('Linting sources...')

  return gulp
    .src( config.eslintDirs )
    .pipe( $.cached( 'linting' ) )
    .pipe( $.plumber() )
    .pipe( $.eslint( config.eslintrc ) )
    .pipe( $.eslint.format() )
    .pipe( $.eslint.failAfterError() )
})

/**
 * @name          typecheck
 * @description   Typecheck sources with FlowType
 * @see https://flowtype.org
 */
gulp.task( 'typecheck', function () {
  logInfo('Type Checking...')

  return gulp
    .src( config.srcDir )
    .pipe( $.flowtype() )
})

/**
 * @name          build-api
 * @description   Build API Documentation
 */
gulp.task( 'api', function () {
  logInfo('Wrinting API documentation...')

  return gulp
    .src('./src/api.jsdoc')
    .pipe( $.jsdocToMarkdown() )
    .pipe( $.rename( function (path ) {
      path.extname = '.md'
    }))
    .pipe( gulp.dest( config.docsDir ) )
})

// ==== OTHER FUNCTIONS =====================================================

/**
 * Print an colored message to the console
 * @param  {string} message A message
 * @return {undefined}
 */
function logInfo ( message ) {
  return console.log( chalk.cyan( message ) )
}

/**
 * Creates a jsdoc readme
 * @return {undefined}
 */
function createDocReadme( done ) {
  fs.readFile( config.changeLog, function ( err, data ) {
    if ( err ) throw err
    data = data.toString().replace(/Change Log/, 'solid-error')
    fs.writeFile( config.jsdocReadme,  data, 'utf8', function ( err ) {
      if ( err ) throw err
      done()
    })
  })
}
