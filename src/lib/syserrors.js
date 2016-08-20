const path = require( 'path' )
const fs = require( 'fs' )
const yaml = require( 'js-yaml' )
const SolidText = require( './solidtext' )

const DEFINITIONS_EXT = 'yaml'
const DEFINITIONS_PATH = path.join( __dirname, '../../errdef' )
const GENERIC_ERROR_FILE = `Error.${DEFINITIONS_EXT}`

class SysErrors {

  constructor( props ) {
    this.setProps( props )
  }

  defaultProps() {
    return {
      lang: 'en',
      includes: []
    }
  }

  /**
   * Set {module:lib/syserrors~SysErrors#props|SysErrors properties}
   * @param {module:lib/syserrors~SysErrorsProps} props SysErrors properties
   */
  setProps( props ) {
    if ( props && typeof props.includes === 'string' ) {
      props.includes = [ props.includes ]
    }
    this.props = Object.assign( this.props || this.defaultProps(), props )
  }

  /**
   * Get the error definitions directory path based on the current
   * {@link module:lib/syserrors~SysErrors#props|`lang` option}.
   * @return {string} Error definitions directory path for current language
   * @version 0.1.1
   * @since 0.1.0
   */
  definitionsDir() {
    return path.join( DEFINITIONS_PATH, this.props.lang )
  }

  /**
   * Get language directories for
   * {@link module:lib/syserrors~SysErrors#props|option included} directories.
   * @return {string[]} Additional error definitions directory path for
   *                    current languge.
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  includeDirs() {
    return this.props.includes.map(
      includePath => path.join( includePath, this.props.lang ) )
  }

  /**
   * Create {@link module:solidError~SolidErrorProps|SolidErrorProps}
   * from a standard`Error` object.
   *
   * @memberOf module:lib/syserrors
   *
   * @param  {Error} err  An error to be convrted.
   * @return {module:lib/solidError~SolidErrorProps}
   *
   * @version 0.1.3
   * @since  0.1.0
   */
  getSolidErrorProps( err ) {
    const targetFilename = ( err.code || err.name || 'Uknown' )
    const searchDirs = this.includeDirs().concat( this.definitionsDir() )
    const errProps = this.loadErrorProps( targetFilename, searchDirs )
    if ( !errProps ) {
      return this.unexpectedError( err )
    }
    return this.composeErrorProps( err, errProps || {} )
  }

  /**
   * Search ´dirs´ for a corresponding `name` error definition.
   * @memberOf module:lib/syserrors
   * @param  {string}   name     Errot definition name
   * @param  {string[]} dirs     A collection of directories to search for
   * @return {module:lib/soliderror~SolidErrorProps} Error props or null.
   * @version 0.1.1
   * @since 0.1.0
   */
  loadErrorProps( name, dirs ) {
    const filename = `${name}.${DEFINITIONS_EXT}`

    for ( let i = 0; i < dirs.length; i++ ) {
      const dir = dirs[ i ]
      if ( !dir ) continue

      const errFilePath = path.join( dir, filename )

      try {
        return yaml.safeLoad( fs.readFileSync( errFilePath, 'utf8' ) )
      }
      catch ( readErr ) {
        if ( readErr === 'YAMLException' ) {
          return null
        }

        if ( readErr.code === 'ENOENT' ) { // File not found
          if ( i === dirs.length - 1 ) { // is last
            return this.loadGenericError()
          }
        }
      }
    }

    return null
  }

  /**
 * Load a Generic Error file.
 * @return {module:lib/solidError~SolidErrorProps} Generic Error props
 * @version 0.1.0
 * @since 0.1.0
 */
  loadGenericError() {
    try {
      const errFilePath = path.join( this.definitionsDir(), GENERIC_ERROR_FILE )
      return yaml.safeLoad( fs.readFileSync( errFilePath, 'utf8' ) )
    }
    catch( readErr ) {
      return null
    }
  }

  /**
   * Get {@link module:lib/solidError~SolidErrorProps } properties
   * for an unexpected error.
   * @param  {Error} innerError  An Error object
   * @return {module:lib/solidError~SolidErrorProps}  SolidErrors' props
   * @version 0.1.0
   * @since  0.1.0
   */
  unexpectedError( innerError ) {
    const errProps = {
      code: 'EUNX',
      errno: -100,
      name: 'UnexpectedError',
      readableName: 'Unexpected Error',
      message: 'This operation cannot be completed due to an unexpected error.',
      explain: 'Unfortunately this error was not expected to occur and no '
        + 'specific explanation can be provided.\n',
      inner: innerError,
    }
    return errProps
  }

  /**
   * Merge an Error with given
   * {@link module:lib/soliderror~SolidErrorProps|properties}
   *
   * @memberOf module:lib/syserrors
   *
   * @param  {Error} err   The source error
   * @param  {module:lib/soliderror~SolidErrorProps} props SolidError properties
   * @return {module:lib/soliderror~SolidErrorProps}
   *
   * @version 0.1.1
   * @since 0.1.0
   */
  composeErrorProps( err, props ) {
    props.inner = err
    if ( err.path ) props.path = err.path

    if ( err.name !== 'Error' ) {
      props.name = err.name
      props.readableName = err.name.match( /[A-Z][a-z]+/g ).join(' ').trim()
    }

    const article = props.readableName.slice(0, 1).match( /[AEIOU]/g ) ? 'An ' : 'A '

    props.message = article + props.readableName + ' occurred.'

    props.message = err.message
      ? this.formatMessage( err.message ) 
      : props.message
    return props
  }

  /**
   * Strip syserror code from `message` and capitalize it.
   * @param  {string} message An error message
   * @return {string}
   * @version 0.1.0
   * @since 0.1.0
   */
  formatMessage( msg ) {
    // Removes error code from msg
    return SolidText.capitalizeFirstLetter( msg.replace( /^E[A-Z]+:\s/g, '' ) )
  }
}

module.exports = SysErrors
