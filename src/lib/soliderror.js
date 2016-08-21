/**
 * SolidError module. Expose {@link module:lib/soliderror~SolidError|SolidError}
 * class.
 * @module lib/soliderror
 * @author RobertoMauro <erremauro@icloud.com>
 * @since 0.3.0
 * @version 0.1.0
 *
 * @requires  {@link modules:lib/solidapi|SolidApi}
 * @requires  {@link modules:lib/exterror|ExtendableError}
 */

const SolidApi = require( './solidapi' )
const ExtendableError = require( './exterror' )

/**
 * @class
 * @classdesc
 * Augmented error for providing detailed error description
 * @extends {module:lib/exterror~ExtError}
 * @property {string} [code] An error code
 * @property {number} [errno] The error number
 * @property {string} message The error message
 * @property {string} stack The error stack trace
 * @property {string} [path] An optional reference path
 * @property {SolidErrorPropsType} props SolidError property
 * @description Extends Error with provided `message` and `props`
 * @param {string|Object} [message] An error message or an Error instance
 * @param {SolidErrorPropsType} [props] SolidError properties
 * @since 0.1.0
 * @version 0.1.0
 */
class SolidError extends ExtendableError {
  constructor( message, props ) {
    super()

    if ( typeof message === 'string' ) {
      props = Object.assign( props || {}, { message } )
    }
    else if ( message instanceof Error ) {
      const innerError = message
      const sysErrors = SolidApi.getSysErrors()
      props = sysErrors.getSolidErrorProps( innerError )
    }
    else if ( typeof message === 'object' ) {
      props = message
    }

    this.setProps( props )
  }

  /**
   * Get the default properties
   * @return {SolidErrorPropsType} Default properties
   * @since 0.1.0
   * @version 0.1.0
   */
  defaultProps() {
    return {
      code: 'EUNX',
      errno: 1,
      name: 'Error',
      readableName: 'Unexpected',
      message: 'An unexpected error occurred',
    }
  }

  /**
   * Set the object properties. While updating SolidError `props` property,
   * some of the `props` properties will be assigned to the main object.
   * These ar tipically properties that belongs to Error objects like `name`,
   * `code`, `errno`, `message` and `path`.
   * @param {SolidErrorPropsType} props
   * @since 0.1.0
   * @version 0.1.0
   */
  setProps( props ) {
    this.props = Object.assign( this.props || this.defaultProps(), props )
    const classProps = [ 'name', 'code', 'errno', 'message', 'path' ]
    classProps.forEach( propName => {
      if ( typeof this.props[ propName ] !== 'undefined' ) {
        this[ propName ] = this.props[ propName ]
      }
    })
  }
}

module.exports = SolidError
