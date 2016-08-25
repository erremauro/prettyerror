/**
 * @overview
 *
 * An extendable base {@link external:Error|Error} class with properties
 * management. This class works pretty much like
 * {@link module:class/SolidObject~SolidObject|SolidObject} besides extending
 * an {@link external:Error|Error} object.
 *
 * @module class/SolidObjectError
 * @author    Roberto Mauro <erremauro@icloud.com>
 * @license   MIT License. See LICENSE file in the root directory.
 * @version   0.1.0
 * @since     0.3.1
 *
 * @requires module:class/ExtError~ExtError
 *
 * @flow
 */

const ExtendableError = require( './ExtError' )

/**
 * @class
 * @classdesc
 * An {@link external:Error|Error} Object with better props assignment.
 * Note that the `props` property should always be updated using  the `setProps`
 * method. Direct changes to the `props` object will not trigger props
 * update notification.
 *
 * @example
 *
 * const DefaultProps = {
 *   code: 'EAWS',
 *   number: 100,
 *   name: 'AwesomeError',
 *   message: 'An awesome error occurred'
 * }
 *
 * class AwesomeError extends SolidObjectError {
 *   constructor( message, props ) {
 *     super( message, props, DefaultProps )
 *   }
 * }
 *
 * throw new AwesomeError( 'Awesome configuration missing', {
 *   path: '/etc/awesome.cfg'
 * })
 *
 *
 * @property {Object} props Object properties
 * @property {Function} defaultProps Returns default object properties.
 *
 * @description
 *
 * Initialize a SolidObject with optional properties and default properties.
 *
 * @param {?string} message An optional error message
 * @param  {?Object} props The object properties
 * @param  {?Object} defaultProps Object default properties.
 *
 * @version 0.1.0
 * @since 0.1.0
 */
class SolidObjectError extends ExtendableError {
  props: Object
  defaultProps: Function;

  constructor( message?: string, props?: any, defaultProps?: any ) {
    super( null )
    this.defaultProps = (): any => defaultProps
    this.props = defaultProps || {}
    this.setProps( props )
  }

  /**
   * @method setProps
   * @name module:class/SolidObjectError~SolidObjectError#setProps
   *
   * @description
   *
   * Set the object properties. During property assignment the method will check
   * if we can update the properties, will parse the properties internally and
   * then notifies the update completion.
   *
   * @see {@link module:shared/SolidObject~SolidObject#propsShouldUpdate|propsShouldUpdate}
   * @see {@link module:shared/SolidObject~SolidObject#propsShouldUpdate|propsWillUpdate}
   * @see {@link module:shared/SolidObject~SolidObject#propsShouldUpdate|propsDidUpdate}
   *
   * @param {?Object} [props] Object properties
   * @returns {any} The object properties
   *
   * @since 0.1.0
   * @version 0.1.0
   */
  setProps( props?: any ): any {
    if ( !props ) return

    if ( typeof props !== 'object' ) {
      throw new TypeError(
        this.constructor.name + ' expected props to be an object but found a '
        + (typeof props) + ' instead. Please provide a valid '
        + this.constructor.name + ' property object.'
      )
    }

    if ( this.propsShouldUpdate() ) {
      props = this.propsWillUpdate( props )
      this.props = Object.assign( this.props,  props )
      this.propsDidUpdate()
    }

    return props
  }

  /**
   * @method propsShouldUpdate
   * @name module:class/SolidObjectError~SolidObjectError#propsShouldUpdate
   *
   * @description
   *
   * Called before properties are updated.
   * Override this method to programatically enable/disable properties update.
   *
   * @returns {boolean} Defines if props should update
   *
   * @since 0.1.0
   * @version 0.1.0
   */
  propsShouldUpdate(): boolean {
    return true
  }

  /**
   * @method propsWillUpdate
   * @name module:class/SolidObjectError~SolidObjectError#propsWillUpdate
   *
   * @description
   *
   * Called before the properties are assigned.
   * Override this method to manipulate the properties.
   *
   * @param {any} props The object properties
   * @returns {Object} Props that will update the object.
   *
   * @since 0.1.0
   * @version 0.1.0
   */
  propsWillUpdate( props?: any ): ?any {
    return props
  }

  /**
   * @method propsDidUpdate
   * @name module:class/SolidObjectError~SolidObjectError#propsDidUpdate
   *
   * @description
   *
   * Called after properties are updated.
   * Override this method to do any additional work that need to be performed
   * right after properties update.
   *
   * @returns {undefined}
   */
  propsDidUpdate() {
    // called after props update completes
  }
}

module.exports = SolidObjectError
