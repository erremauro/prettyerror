'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var SolidApi = require('./solidapi');
var ExtendableError = require('./exterror');

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

var SolidError = function (_ExtendableError) {
  _inherits(SolidError, _ExtendableError);

  function SolidError(message, props) {
    _classCallCheck(this, SolidError);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SolidError).call(this));

    if (typeof message === 'string') {
      props = Object.assign(props || {}, { message: message });
    } else if (message instanceof Error) {
      var innerError = message;
      var sysErrors = SolidApi.getSysErrors();
      props = sysErrors.getSolidErrorProps(innerError);
    } else if ((typeof message === 'undefined' ? 'undefined' : _typeof(message)) === 'object') {
      props = message;
    }

    _this.setProps(props);
    return _this;
  }

  /**
   * Get the default properties
   * @return {SolidErrorPropsType} Default properties
   * @since 0.1.0
   * @version 0.1.0
   */


  _createClass(SolidError, [{
    key: 'defaultProps',
    value: function defaultProps() {
      return {
        code: 'EUNX',
        errno: 1,
        name: 'Error',
        readableName: 'Unexpected',
        message: 'An unexpected error occurred'
      };
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

  }, {
    key: 'setProps',
    value: function setProps(props) {
      var _this2 = this;

      this.props = Object.assign(this.props || this.defaultProps(), props);
      var classProps = ['name', 'code', 'errno', 'message', 'path'];
      classProps.forEach(function (propName) {
        if (typeof _this2.props[propName] !== 'undefined') {
          _this2[propName] = _this2.props[propName];
        }
      });
    }
  }]);

  return SolidError;
}(ExtendableError);

module.exports = SolidError;