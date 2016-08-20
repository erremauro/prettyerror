'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Options = require('./options');
var ExtendableError = require('./exterror');

var SolidError = function (_ExtendableError) {
  _inherits(SolidError, _ExtendableError);

  function SolidError(message, props) {
    _classCallCheck(this, SolidError);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SolidError).call(this));

    if (typeof message === 'string') {
      props = Object.assign(props || {}, { message: message });
    } else if (message instanceof Error) {
      var innerError = message;
      props = Options.getSysErrors().getSolidErrorProps(innerError);
    } else if ((typeof message === 'undefined' ? 'undefined' : _typeof(message)) === 'object') {
      props = message;
    }

    _this.setProps(props);
    return _this;
  }

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
  }, {
    key: 'setProps',
    value: function setProps(props) {
      this.props = Object.assign(this.props || this.defaultProps(), props);
      this.name = this.props.name || this.name;
      this.code = this.props.code || this.code;
      this.errno = this.props.errno || this.errno;
      this.message = this.props.message || this.message;
      this.path = this.props.path || this.path;
    }
  }]);

  return SolidError;
}(ExtendableError);

module.exports = SolidError;