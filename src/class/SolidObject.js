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
 * @version   0.1.4
 * @since     0.3.1
 *
 */

/**
 * Generate a standard guid
 * @memberOf module:class/SolidObject
 * @function
 * @inner
 * @returns {undefined}
 */
function guid (): string {
  const s4 = (): string => Math
    .floor( ( 1 + Math.random() ) * 0x10000 )
    .toString(16)
    .substring(1)

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
  s4() + '-' + s4() + s4() + s4();
}

/**
 * SolidObject readonly property symbols
 * @type {Object}
 * @memberOf module:class/SolidObject
 * @inner
 * @property {Symbol} state
 * @property {Symbol} props
 * @property {Symbol} key
 * @property {Symbol} defaults
 * @property {Symbol} solid
 * @since 0.1.4
 * @version 0.1.0
 */
const Symbols = {
  state: Symbol( '__state__' ),
  props: Symbol(' __props__' ),
  key: Symbol( '__key__' ),
  defaults: Symbol( '__defaults__' ),
  solid: Symbol( '__solid__' )
}

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
 * @version   0.1.3
 * @since     0.3.1
 */
class SolidObject {
  constructor( props?: any, defaultProps?: any ) {
    this[ Symbols.solid ] = true
    this[ Symbols.key ] = guid()
    this[ Symbols.props ] = defaultProps || {}
    this[ Symbols.state ] = {}
    this[ Symbols.defaults ] = defaultProps
    this.setProps( props )
  }

  /**
   * Tells if it's a solid object.
   * @type {boolean}
   * @readOnly
   * @memberOf module:class/SolidObject~SolidObject
   */
  get solid(): string {
    return this[ Symbols.solid ]
  }

  /**
   * SolidObject unique key
   * @type {string}
   * @readOnly
   * @memberOf module:class/SolidObject~SolidObject
   * @since 0.3.1
   * @version 0.1.3
   */
  get key(): string {
    return this[ Symbols.key ]
  }

  /**
   * SolidObject properties
   * @type {Object}
   * @readOnly
   * @memberOf module:class/SolidObject~SolidObject
   * @since 0.3.1
   * @version 0.1.3
   */
  get props (): Object {
    return Object.assign( {}, this[ Symbols.props ] )
  }

  /**
   * SolidObject internal state object.
   * @type {Object}
   * @memberOf module:class/SolidObject~SolidObject
   * @since 0.3.1
   * @version 0.1.3
   */
  get state(): Object {
    return Object.assign( {}, this[ Symbols.state ] )
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
      this[ Symbols.props ] = Object.assign( this.props,  props )
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
