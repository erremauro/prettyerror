'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
 * 
 */

var ExtendableError = require('./ExtError');

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

var SolidObjectError = function (_ExtendableError) {
  _inherits(SolidObjectError, _ExtendableError);

  function SolidObjectError(message, props, defaultProps) {
    _classCallCheck(this, SolidObjectError);

    var _this = _possibleConstructorReturn(this, (SolidObjectError.__proto__ || Object.getPrototypeOf(SolidObjectError)).call(this, null));

    _this.defaultProps = function () {
      return defaultProps;
    };
    _this.props = defaultProps || {};
    _this.setProps(props);
    return _this;
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


  _createClass(SolidObjectError, [{
    key: 'setProps',
    value: function setProps(props) {
      if (!props) return;

      if ((typeof props === 'undefined' ? 'undefined' : _typeof(props)) !== 'object') {
        throw new TypeError(this.constructor.name + ' expected props to be an object but found a ' + (typeof props === 'undefined' ? 'undefined' : _typeof(props)) + ' instead. Please provide a valid ' + this.constructor.name + ' property object.');
      }

      if (this.propsShouldUpdate()) {
        props = this.propsWillUpdate(props);
        this.props = Object.assign(this.props, props);
        this.propsDidUpdate();
      }

      return props;
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

  }, {
    key: 'propsShouldUpdate',
    value: function propsShouldUpdate() {
      return true;
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

  }, {
    key: 'propsWillUpdate',
    value: function propsWillUpdate(props) {
      return props;
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

  }, {
    key: 'propsDidUpdate',
    value: function propsDidUpdate() {
      // called after props update completes
    }
  }]);

  return SolidObjectError;
}(ExtendableError);

module.exports = SolidObjectError;