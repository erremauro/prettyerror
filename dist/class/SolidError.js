'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @module    class/SolidError
 * @author    Roberto Mauro <erremauro@icloud.com>
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}.
 * @version   0.1.0
 * @since     0.3.1
 *
 * 
 */
var createPropsFrom = require('../lib/SysErrors').createPropsFrom;
var SolidObjectError = require('./SolidObjectError');

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
var DefaultProps = {
  code: 'EUNX',
  errno: 1,
  name: 'Error',
  readableName: 'Unexpected',
  message: 'An unexpected error occurred'
};

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

var SolidError = function (_SolidObjectError) {
  _inherits(SolidError, _SolidObjectError);

  /**
   * Extends {@link module:class/ExtError~external:Error} with provided
   * `message` and `props`
   * @param  {string|Error} message An error message or an Error object
   * @param  {SolidErrorProps} props SolidError properties
   */
  function SolidError(message, props) {
    _classCallCheck(this, SolidError);

    var _this = _possibleConstructorReturn(this, (SolidError.__proto__ || Object.getPrototypeOf(SolidError)).call(this, '', props, DefaultProps));

    if (typeof message === 'string') {
      props = Object.assign(props || {}, { message: message });
    } else if (message instanceof Error) {
      var innerError = message;
      props = createPropsFrom(innerError);
    } else if ((typeof message === 'undefined' ? 'undefined' : _typeof(message)) === 'object') {
      props = message;
    }

    _this.setProps(props);
    return _this;
  }

  _createClass(SolidError, [{
    key: 'propsDidUpdate',
    value: function propsDidUpdate() {
      var _this2 = this;

      var classProps = ['name', 'code', 'errno', 'message', 'path'];
      classProps.forEach(function (propName) {
        if (typeof _this2.props[propName] !== 'undefined') {
          _this2[propName] = _this2.props[propName];
        }
      });
    }
  }]);

  return SolidError;
}(SolidObjectError);

module.exports = SolidError;