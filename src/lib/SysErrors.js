const path = require( 'path' )
const fs = require( 'fs' )
const yaml = require( 'js-yaml' )
const SolidText = require( '../lib/SolidText' )

/**
 * SysErrors Constants
 * @type {Object}
 * @memberOf module:lib/SysErrors
 * @inner
 * @property {string} Extensione yaml
 * @property {string} Path Error definitions path
 * @property {string} GenericErrorFilename Generic Error Filename
 * @since 0.1.0
 * @version 0.1.0
 */
const ErrorDefinition = {
  Extension: 'yaml',
  Path: path.join( __dirname, '../definitions' ),
  GenericErrorFilename: 'Error.yaml'
}

/**
 * SysErrors options
 * @type {Object}
 * @memberOf module:lib/SysError
 * @inner
 * @property {string} lang Error language
 * @property {string[]} includes Additional error definitions directories
 * @since 0.1.0
 * @version 0.1.0
 */
let options: SysErrorsOptions = {
  lang: 'en',
  includes: []
}

/**
 * @module lib/SysErrors
 * @author Roberto Mauro <erremauro@icloud.com>
 * @license {@link https://opensource.org/licenses/MIT|MIT}
 * @version 0.1.1
 * @since 0.3.1
 */
class SysErrors {
  /**
   * Get the current options
   * @return {module:lib/SysErrors~SysErrorsOptions} SysError's options
   * @version 0.1.0
   * @since 0.1.1
   */
  static getOptions (): SysErrorsOptions {
    return Object.assign({}, options )
  }

  /**
   * Set SysError's options
   * @param {module:lib/SysErrors~SysErrorsOptions} props new options
   * @returns {module:lib/SysErrors~SysErrorsOptions} SysErrors options
   * @version 0.1.0
   * @since 0.1.0
   */
  static setOptions ( props: SysErrorsOptions ): SysErrorsOptions {
    if ( !props ) return
    if ( props && typeof props.includes === 'string' ) {
      props.includes = [ props.includes ]
    }
    options = Object.assign( options, props )
    return options
  }


  /**
   * Get the error definitions directory path based on the current
   * {@link module:lib/SysErrors~SysErrors#props|`lang` option}.
   * @return {string} Error definitions directory path for current language
   * @version 0.1.0
   * @since 0.1.0
   */
  static definitionsDir(): string {
    return path.join( ErrorDefinition.Path, options.lang )
  }

  /**
   * Get language directories for
   * {@link module:lib/SysErrors~SysErrors#props|option included} directories.
   * @return {string[]} Additional error definitions directory path for
   *                    current languge.
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  static includeDirs(): string[] {
    return options.includes.map(
      (includePath: string): string => path.join(includePath, options.lang))
  }

  /**
   * Create {@link module:solidError~SolidErrorProps|SolidErrorProps}
   * from a standard`Error` object.
   * @param  {ValidError} err  An error to be convrted.
   * @returns {SolidErrorPropsType} Solid Error property object
   * @version 0.1.0
   * @since  0.1.0
   */
  static createPropsFrom( err: ValidError ): SolidErrorProps {
    const targetFilename = ( err.code || err.name || 'Uknown' )
    const searchDirs = SysErrors
      .includeDirs()
      .concat( SysErrors.definitionsDir() )
    const errProps = SysErrors.loadErrorProps( targetFilename, searchDirs )
    if ( !errProps ) {
      return SysErrors.unexpectedError( err )
    }
    return SysErrors.composeErrorProps( err, errProps || {} )
  }

  /**
   * Search ´dirs´ for a corresponding `name` error definition.
   * @memberOf module:lib/SysErrors
   * @param  {string}   name     Errot definition name
   * @param  {string[]} dirs     A collection of directories to search for
   * @return {?SolidErrorProps} Error props or null.
   * @version 0.1.0
   * @since 0.1.0
   */
  static loadErrorProps( name: string, dirs: string[] ): ?SolidErrorProps {
    const filename = `${name}.${ErrorDefinition.Extension}`

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
            return SysErrors.loadGenericError()
          }
        }
      }
    }

    return null
  }

  /**
   * Load a Generic Error file.
   * @return {?SolidErrorProps} Generic Error props
   * @version 0.1.0
   * @since 0.1.0
   */
  static loadGenericError(): ?SolidErrorProps {
    try {
      const errFilePath = path.join(
        SysErrors.definitionsDir(), ErrorDefinition.GenericErrorFilename )
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
   * @return {?SolidErrorProps}  SolidErrors' props
   * @version 0.1.0
   * @since  0.1.0
   */
  static unexpectedError( innerError: Error ): SolidErrorProps {
    const errProps: SolidErrorProps = {
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
   * @param  {Error} err   The source error
   * @param  {SolidErrorProps} props SolidError properties
   * @return {SolidErrorProps} Composed properties
   * @version 0.1.0
   * @since 0.1.0
   */
  static composeErrorProps( err: any, props: SolidErrorProps ): SolidErrorProps {
    props.inner = err
    if ( err.path ) props.path = err.path

    if ( err.name !== 'Error' ) {
      props.name = err.name
      const splittedName = err.name.match( /[A-Z][a-z]+/g )
      if ( splittedName ) {
        props.readableName = splittedName.join(' ').trim()
      }
    }

    const article = props.readableName.slice(0, 1).match( /[AEIOU]/g ) ? 'An ' : 'A '

    props.message = article + props.readableName + ' occurred.'
    props.message = err.message
      ? SysErrors.formatMessage( err.message )
      : props.message
    return props
  }

  /**
   * Strip syserror code from `message` and capitalize it.
   * @param  {string} message An error message
   * @returns {string} capitalized message
   * @version 0.1.0
   * @since 0.1.0
   */
  static formatMessage( message: string ): string {
    // Removes error code from msg
    return SolidText.capitalizeFirstLetter( message )
  }
}

module.exports = SysErrors
