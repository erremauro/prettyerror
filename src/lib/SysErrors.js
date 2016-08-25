/**
 * SysErrors.js
 * @flow
 * 2016, Roberto Mauro <erremauro@icloud.com>
 */

const path = require( 'path' )
const fs = require( 'fs' )
const yaml = require( 'js-yaml' )
const SolidText = require( '../lib/SolidText' )

/**
 * SysErrors Constants
 * @type {Object}
 * @property {string} Extensione yaml
 * @property {string} Path Error definitions path
 * @property {string} GenericErrorFilename Generic Error Filename
 *
 * @since 0.3.1
 * @version 0.1.0
 */
const ErrorDefinition = {
  Extension: 'yaml',
  Path: path.join( __dirname, '../definitions' ),
  GenericErrorFilename: 'Error.yaml'
}

let options = {
  lang: 'en',
  includes: []
}

function setOptions ( props: any ) {
  if ( !props ) return
  if ( props && typeof props.includes === 'string' ) {
    props.includes = [ props.includes ]
  }
  options = Object.assign( options, props )
}


/**
 * Get the error definitions directory path based on the current
 * {@link module:lib/syserrors~SysErrors#props|`lang` option}.
 * @return {string} Error definitions directory path for current language
 * @version 0.1.0
 * @since 0.1.0
 */
function definitionsDir(): string {
  return path.join( ErrorDefinition.Path, options.lang )
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
function includeDirs(): string[] {
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
function createPropsFrom( err: ValidError ): SolidErrorProps {
  const targetFilename = ( err.code || err.name || 'Uknown' )
  const searchDirs = includeDirs().concat( definitionsDir() )
  const errProps = loadErrorProps( targetFilename, searchDirs )
  if ( !errProps ) {
    return unexpectedError( err )
  }
  return composeErrorProps( err, errProps || {} )
}

/**
 * Search ´dirs´ for a corresponding `name` error definition.
 * @memberOf module:lib/syserrors
 * @param  {string}   name     Errot definition name
 * @param  {string[]} dirs     A collection of directories to search for
 * @return {?SolidErrorProps} Error props or null.
 * @version 0.1.0
 * @since 0.1.0
 */
function loadErrorProps( name: string, dirs: string[] ): ?SolidErrorProps {
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
          return loadGenericError()
        }
      }
    }
  }

  return null
}

/**
 * Load a Generic Error file.
 * @return {SolidErrorPropsType} Generic Error props
 * @version 0.1.0
 * @since 0.1.0
 */
function loadGenericError(): ?SolidErrorProps {
  try {
    const errFilePath = path.join(
      definitionsDir(), ErrorDefinition.GenericErrorFilename )
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
function unexpectedError( innerError: Error ): SolidErrorProps {
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
 * @return {?SolidErrorProps} Composed properties
 * @version 0.1.0
 * @since 0.1.0
 */
function composeErrorProps( err: any, props: SolidErrorProps ): SolidErrorProps {
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
    ? formatMessage( err.message )
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
function formatMessage( message: string ): string {
  // Removes error code from msg
  return SolidText.capitalizeFirstLetter( message )
}

module.exports = {
  setOptions,
  createPropsFrom
}
