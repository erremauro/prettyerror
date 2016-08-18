'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Expose SysErrors class for managing external error definitions.
 * @module lib/syserrors
 * @author Roberto Mauro <erremauro@icloud.com>
 * @since 0.3.0
 * @version 0.1.0
 *
 * @requires {@link https://github.com/nodeca/js-yaml|js-yaml}
 * @requires {@link module:lib/solidtext~SolidText|SolidText}
 */

var path = require('path');
var fs = require('fs');
var yaml = require('js-yaml');
var SolidText = require('./solidtext');

/**
 * Default error definitions extensions.
 * @memberOf module:lib/syserrors
 * @const {string}
 * @inner
 */
var DEFINITIONS_EXT = 'yaml';

/**
 * Internal error definitions path.
 * @memberOf module:lib/syserrors
 * @const {string}
 * @inner
 */
var DEFINITIONS_PATH = path.join(__dirname, '../../errdef');

/**
 * Default external definition Error filename
 * @memberOf module:lib/syserrors
 * @const {string}
 * @inner
 */
var GENERIC_ERROR_FILE = 'Error.' + DEFINITIONS_EXT;

/**
 * @class
 * Manages SolidError external error definitions. Properties like `lang` and
 * `includes` can be set in order to change the default lookup language
 * (a subdirectory with correspoding `lang` name) and additional
 * error definitions directories. Additional error definitions takes precedence
 * over the default when for the corresponding language, when found. Otherwise
 * SysErrors will try to fallback to a default error definition if available.
 * @property {SysErrorsPropsType} props SysError properties
 */

var SysErrors = function () {
  function SysErrors(props) {
    _classCallCheck(this, SysErrors);

    this.setProps(props);
  }

  /**
   * Get the default object properties.
   * @return {SysErrorsPropsType} Default properties
   * @since 0.1.0
   * @version 0.1.0
   */


  _createClass(SysErrors, [{
    key: 'defaultProps',
    value: function defaultProps() {
      return {
        lang: 'en',
        includes: []
      };
    }

    /**
     * Set {module:lib/syserrors~SysErrors#props|SysErrors properties}
     * @param {SysErrorPropsType} props SysErrors properties
     * @since 0.1.0
     * @version 0.1.0
     */

  }, {
    key: 'setProps',
    value: function setProps(props) {
      if (props && typeof props.includes === 'string') {
        props.includes = [props.includes];
      }
      this.props = Object.assign(this.props || this.defaultProps(), props);
    }

    /**
     * Get the error definitions directory path based on the current
     * {@link module:lib/syserrors~SysErrors#props|`lang` option}.
     * @return {string} Error definitions directory path for current language
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'definitionsDir',
    value: function definitionsDir() {
      return path.join(DEFINITIONS_PATH, this.props.lang);
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

  }, {
    key: 'includeDirs',
    value: function includeDirs() {
      var _this = this;

      return this.props.includes.map(function (includePath) {
        return path.join(includePath, _this.props.lang);
      });
    }

    /**
     * Create {@link module:solidError~SolidErrorProps|SolidErrorProps}
     * from a standard`Error` object.
     * @param  {Error} err  An error to be convrted.
     * @return {SolidErrorPropsType}
     * @version 0.1.0
     * @since  0.1.0
     */

  }, {
    key: 'getSolidErrorProps',
    value: function getSolidErrorProps(err) {
      var targetFilename = err.code || err.name || 'Uknown';
      var searchDirs = this.includeDirs().concat(this.definitionsDir());
      var errProps = this.loadErrorProps(targetFilename, searchDirs);
      if (!errProps) {
        return this.unexpectedError(err);
      }
      return this.composeErrorProps(err, errProps || {});
    }

    /**
     * Search ´dirs´ for a corresponding `name` error definition.
     * @memberOf module:lib/syserrors
     * @param  {string}   name     Errot definition name
     * @param  {string[]} dirs     A collection of directories to search for
     * @return {?SolidErrorPropsType} Error props or null.
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'loadErrorProps',
    value: function loadErrorProps(name, dirs) {
      var filename = name + '.' + DEFINITIONS_EXT;

      for (var i = 0; i < dirs.length; i++) {
        var dir = dirs[i];
        if (!dir) continue;

        var errFilePath = path.join(dir, filename);

        try {
          return yaml.safeLoad(fs.readFileSync(errFilePath, 'utf8'));
        } catch (readErr) {
          if (readErr === 'YAMLException') {
            return null;
          }

          if (readErr.code === 'ENOENT') {
            // File not found
            if (i === dirs.length - 1) {
              // is last
              return this.loadGenericError();
            }
          }
        }
      }

      return null;
    }

    /**
     * Load a Generic Error file.
     * @return {SolidErrorPropsType} Generic Error props
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'loadGenericError',
    value: function loadGenericError() {
      try {
        var errFilePath = path.join(this.definitionsDir(), GENERIC_ERROR_FILE);
        return yaml.safeLoad(fs.readFileSync(errFilePath, 'utf8'));
      } catch (readErr) {
        return null;
      }
    }

    /**
     * Get {@link module:lib/solidError~SolidErrorProps } properties
     * for an unexpected error.
     * @param  {Error} innerError  An Error object
     * @return {SolidErrorPropsType}  SolidErrors' props
     * @version 0.1.0
     * @since  0.1.0
     */

  }, {
    key: 'unexpectedError',
    value: function unexpectedError(innerError) {
      var errProps = {
        code: 'EUNX',
        errno: -100,
        name: 'UnexpectedError',
        readableName: 'Unexpected Error',
        message: 'This operation cannot be completed due to an unexpected error.',
        explain: 'Unfortunately this error was not expected to occur and no ' + 'specific explanation can be provided.\n',
        inner: innerError
      };
      return errProps;
    }

    /**
     * Merge an Error with given
     * {@link module:lib/soliderror~SolidErrorProps|properties}
     * @param  {Error} err   The source error
     * @param  {SolidErrorPropsType} props SolidError properties
     * @return {SolidErrorPropsType} Composed properties
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'composeErrorProps',
    value: function composeErrorProps(err, props) {
      props.inner = err;
      if (err.path) props.path = err.path;

      if (err.name !== 'Error') {
        props.name = err.name;
        props.readableName = err.name.match(/[A-Z][a-z]+/g).join(' ').trim();
      }

      var article = props.readableName.slice(0, 1).match(/[AEIOU]/g) ? 'An ' : 'A ';

      props.message = article + props.readableName + ' occurred.';

      props.message = err.message ? this.formatMessage(err.message) : props.message;
      return props;
    }

    /**
     * Strip syserror code from `message` and capitalize it.
     * @param  {string} message An error message
     * @return {string}
     * @version 0.1.0
     * @since 0.1.0
     */

  }, {
    key: 'formatMessage',
    value: function formatMessage(msg) {
      // Removes error code from msg
      return SolidText.capitalizeFirstLetter(msg.replace(/^E[A-Z]+:\s/g, ''));
    }
  }]);

  return SysErrors;
}();

module.exports = SysErrors;