'use strict';

/**
 * SolidError Module. Export {@link SolidError} class and
 * provide API for settings options and rendering styles. Note that settings
 * styles while using a custom
 * {@link module:shared/SolidApi.options.renderer|rederer} will have no effect.
 *
 * @see  {@link module:shared/SolidApi|SolidApi}
 *
 * @module solid-error
 * @author Roberto Mauro <erremauro@icloud.com>
 * @since 0.3.0
 * @version 0.1.1
 *
 * 
 */

var SolidApi = require('./shared/SolidApi');
var SolidPrinter = require('./lib/SolidPrinter');
var SolidError = require('./class/SolidError');
var SolidText = require('./lib/SolidText');

module.exports = {
  /**
   * @memberOf module:solid-error
   */
  logError: SolidPrinter.logError,
  /**
   * @memberOf module:solid-error
   */
  render: SolidPrinter.render,
  /**
   * @name module:solid-error.SolidError
   * @memberOf module:solid-error
   * @type {module:lib/soliderror~SolidError}
   * @since 0.1.0
   * @version 0.1.0
   */
  SolidError: SolidError,
  /**
   * @memberOf module:solid-error
   * @type {module:lib/SolidText}
   * @since 0.1.1
   * @version 0.1.0
   */
  SolidText: SolidText,
  /**
   * Update library options.
   * @memberOf module:solid-error
   * @function
   * @param {SolidErrorOptionsType} props Library options
   * @since 0.1.0
   * @version 0.1.0
   */
  setOptions: SolidApi.setOptions,

  /**
   * Get the current library options
   * @memberOf module:solid-error
   * @function
   * @return {SolidErrorOptionsType}
   * @since 0.1.0
   * @version 0.1.0
   */
  getOptions: SolidApi.getOptions,

  /**
   * Set the default library renderer styles. Note that updating styles when
   * a **custom renderer** is currently active, it will have no effect.
   * @memberOf module:solid-error
   * @function
   * @param {module:solid-error~SolidErrorStylesType} props Solid Renderer styles
   * @since 0.1.0
   * @version 0.1.0
   */
  setStyles: SolidApi.setStyles
};