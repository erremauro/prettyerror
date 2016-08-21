'use strict';

/**
 * Public Module. Expose 
 * {@link module:lib/soliderror~SolidError|SolidError} and
 * provide api for settings options and rendering styles. Note that settings
 * styles while using a custom
 * {@link module:lib/solidapi.options.renderer|rederer} will have no effect.
 * @see  {@link module:lib/solidapi|SolidApi}
 * @module soliderror
 * @author Roberto Mauro <erremauro@icloud.com>
 * @since 0.3.0
 * @version 0.1.0
 */
var SolidRender = require('./lib/solidrender');
var SolidError = require('./lib/soliderror');
var SolidApi = require('./lib/solidapi');

SolidApi.setOptions({
  renderer: new SolidRender()
});

/**
 * Log an Error to the console. If the provided error is a SolidError
 * it will be renderer using the current
 * {@link module:lib/solidapi.options.renderer|rederer}
 * @memberOf module:soliderror
 * @param  {Error} error Any Error type object
 * @version 0.1.0
 * @since 0.1.0
 */
function logError(error) {
  if (error.constructor.name !== 'SolidError') {
    return console.log(error);
  }
  console.log(render(error));
}

/**
 * Render a SolidError
 * @memberOf module:soliderror
 * @param  {module:lib/soliderror~SolidError} solidError A SolidError object
 * @return {string}            Renderer SolidError
 * @version 0.1.0
 * @since 0.1.0
 */
function render(solidError) {
  var options = SolidApi.getOptions();
  var render = options.renderer;

  var result = '';

  result += render.header(solidError.props.readableName || '');
  result += render.message(solidError.message);

  if (solidError.props.explain) {
    result += render.explain(solidError.props.explain);
  }

  if (solidError.props.hints) {
    result += render.hints(solidError.props.hints);
  }

  return result + render.footer(solidError.code, solidError.path);
}

module.exports = {
  /**
   * Update library options.
   * @memberOf module:soliderror
   * @function
   * @param {SolidErrorOptionsType} props Library options
   * @since 0.1.0
   * @version 0.1.0
   */
  setOptions: SolidApi.setOptions,

  /**
   * Get the current library options
   * @memberOf module:soliderror
   * @function
   * @return {SolidErrorOptionsType}
   * @since 0.1.0
   * @version 0.1.0
   */
  getOptions: SolidApi.getOptions,

  /**
   * Set the default library renderer styles. Note that updating styles when
   * a **custom renderer** is currently active, it will have no effect.
   * @memberOf module:soliderror
   * @function
   * @param {module:soliderror~SolidErrorStylesType} props Solid Renderer styles
   * @since 0.1.0
   * @version 0.1.0
   */
  setStyles: SolidApi.setStyles,
  logError: logError,
  render: render,
  /**
   * @memberOf  module:soliderror
   * @type {module:lib/soliderror~SolidError}
   * @since 0.1.0
   * @version 0.1.0
   */
  SolidError: SolidError
};