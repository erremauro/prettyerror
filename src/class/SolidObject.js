/**
 * @overview
 *
 * A base class with properties management.
 * {@link module:class/SolidObject~SolidObject|SolidObject} has built-in
 * methods for safely assign properties to an object. By subclassing
 * {@link module:class/SolidObject~SolidObject|SolidObject} is possible
 * to override props update notification methods like `propsShouldUpdate`,
 * `propsWillUpdate` and `propsDidUpdate`.
 *
 * @module class/SolidObject
 * @author    Roberto Mauro <erremauro@icloud.com>
 * @license   MIT License. See LICENSE file in the root directory.
 * @version   0.1.0
 * @since     0.3.1
 *
 * @flow
 */

/**
 * @class
 * @classdesc
 * An object with better props assignment.
 * Note that the `props` property should always be updated using  the `setProps`
 * method. Direct changes to the `props` object will not trigger props
 *
 * @example
 *
 * const DefaultProps = {
 *   name: 'John Doe',
 *   birthday: new Date(1900,01,01),
 *   gender: "unknown"
 * }
 *
 * class Person extends SolidObject {
 *   constructor( props ) {
 *     super( props, DefaultProps )
 *   }
 *
 *   propsShouldUpdate( props ) {
 *     if ( props.birthday !== this.props.birthday ) {
 *       console.log(`${this.props.name}, once born you can\'t reborn.`)
 *       return false
 *     }
 *     return true
 *   }
 *
 *   propsDidUpdate() {
 *     console.log(`Hi, ${this.props.name}. You seems... different.`)
 *   }
 * }
 *
 * const Michael = new Person({
 *   name: 'Michael',
 *   birthday: new Date(1973, 02, 02)
 * })
 *
 * // will print "Hi Michael! You seems... different."
 * Michael.setProps({geneder:'Male'})
 *
 * // will print "Michael, once born you can't reborn."
 * // props are not updated. `propsDidUpdate` is not called.
 * Michael.setProps({ birthday: new Date(1981,02,02)})
 *
 * @description
 *
 * Initialize a SolidObject with optional properties and default properties.
 *
 * @param  {?Object} [props] The object properties
 * @param  {?Object} [defaultProps] Object default properties
 * @version   0.1.0
 * @since     0.3.1
 */
class SolidObject {
  props: Object
  defaultProps: Function;

  constructor( props?: any, defaultProps?: any ) {
    this.defaultProps = (): any => defaultProps
    this.props = defaultProps || {}
    this.setProps( props )
  }

  /**
   * @method setProps
   * @name module:class/SolidObject~SolidObject#setProps
   *
   * @description
   *
   * Set the object properties. During property assignment the method will check
   * if we can update the properties, will parse the properties internally and
   * then notifies the update completion.
   *
   * @param {?Object} props Object properties
   * @returns {any} Updated Props
   *
   * @since 0.3.1
   * @version 0.1.2
   */
  setProps( props?: any ): any {
    if ( !props ) {
      this.propsDidUpdate()
      return this.props
    }

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

    return this.props
  }

  /**
   * @method propsShouldUpdate
   * @name module:class/SolidObject~SolidObject#propsShouldUpdate
   *
   * @description
   *
   * Called before properties are updated.
   * Override this method to allow or disallow properties update.
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
   * @name module:class/SolidObject~SolidObject#propsWillUpdate
   *
   * @description
   *
   * Called before the properties are assigned.
   * Override this method to manipulate the properties.
   *
   * @param {any} props Object properties
   * @returns {Object} Props that will update the object
   *
   * @since 0.1.0
   * @version 0.1.0
   */
  propsWillUpdate( props?: any ): ?any {
    return props
  }

  /**
   * @method propsDidUpdate
   * @name module:class/SolidObject~SolidObject#propsDidUpdate
   *
   * @description
   *
   * Called after properties are updated.
   * Override this method to do any additional work that need to be performed
   * right after properties update.
   *
   * @returns {undefined}
   *
   * @since 0.1.0
   * @version 0.1.0
   */
  propsDidUpdate() {
    // called after props update completes
  }
}

module.exports = SolidObject
