/**
 * @module    class/SolidError
 * @author    Roberto Mauro <erremauro@icloud.com>
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}.
 * @version   0.1.0
 * @since     0.3.1
 *
 * @flow
 */
const createPropsFrom = require( '../lib/SysErrors' ).createPropsFrom
const SolidObjectError = require( './SolidObjectError' )

/**
 * SolidError Default properties
 * @type {SolidErrorProps}
 * @readOnly
 * @property {string} [code=EUNX] Default error code
 * @property {number} [errno=1]   Default error number
 * @property {string} [name=Error] Default error name
 * @property {string} [readableName=Unexpected] Default error's readable name
 * @property {string} [message=An unexpected error occurred] error's message
 */
const DefaultProps = {
  code: 'EUNX',
  errno: 1,
  name: 'Error',
  readableName: 'Unexpected',
  message: 'An unexpected error occurred',
}

/**
 * @class
 * @classdesc
 * SolidError is an {@link external:Error|Error} object with
 * properties to write a more verbose error explanation and hints to help
 * the user understand and resolve the facing issue.
 *
 * @example
 *
 *  const err = new SolidError(
 *   'Command not found.',
 *   {
 *     code: 'ECNF',
 *     errno: -512,
 *     name: 'CmdNotFoundError',
 *     readableName: 'Command not found',
 *     explain: 'The command you tried to run was not found. Path to the binary '
 *       + 'file could be missing from `$PATH` environment or the binary could '
 *       + 'not exists anymore. Also, check your spelling. '
 *     hints: 'To view your current $PATH environment type:\n\n'
 *       + '    echo $PATH\n\n'
 *       + 'To search for the binary type:\n\n'
 *       + '    which <command_name>'
 *   }
 * )
 *
 * @extends module:class/ExtError~ExtError
 * @since 0.1.0
 * @version 0.2.0
 */
class SolidError extends SolidObjectError {
  props: SolidErrorProps;

  /**
   * Extends {@link module:class/ExtError~external:Error} with provided
   * `message` and `props`
   * @param  {string|Error} message An error message or an Error object
   * @param  {SolidErrorProps} props SolidError properties
   */
  constructor( message?: ValidError, props: SolidErrorProps ) {
    super( '', props, DefaultProps )

    if ( typeof message === 'string' ) {
      props = Object.assign( props || {}, { message } )
    }
    else if ( message instanceof Error ) {
      const innerError = message
      props = createPropsFrom( innerError )
    }
    else if ( typeof message === 'object' ) {
      props = message
    }

    this.setProps( props )
  }

  propsDidUpdate() {
    const classProps = [ 'name', 'code', 'errno', 'message', 'path' ]
    classProps.forEach( ( propName: string ) => {
      if ( typeof this.props[ propName ] !== 'undefined' ) {
        this[ propName ] = this.props[ propName ]
      }
    })
  }
}

module.exports = SolidError
