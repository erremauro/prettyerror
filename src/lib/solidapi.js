/**
 * SolidError API for working with options, styles and external definitions.
 * @module lib/solidapi
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.0
 * @since 0.3.0
 *
 * @requires {@link module:syserrors|SysErrors}
 */

const SysErrors = require( './syserrors' )

/**
 * @memberOf module:lib/solidapi
 * @inner
 * @type {module:soliderror~SolidErrorOptionsType}
 */
let options = {
  renderer: null,
  lang: 'en',
  includes: [],
}

/**
 * @memberOf module:lib/solidapi
 * @inner
 * @type {module:lib/syserrors~SysErrors}
 */
const sysErrors = new SysErrors({
  lang: options.lang,
  includes: options.includes
})

/**
 * Update library options.
 * @memberOf module:lib/solidapi
 * @param {module:soliderror~SolidErrorOptionsTypes} props Library options
 * @version 0.1.0
 * @since 0.1.0
 */
function setOptions ( props ) {
  options = Object.assign( options, props )
  sysErrors.setProps({
    lang: options.lang,
    includes: options.includes
  })
}

/**
 * Get the current library options
 * @memberOf module:lib/solidapi
 * @return {module:soliderror~SolidErrorOptionsTypes}
 * @version 0.1.0
 * @since 0.1.0
 */
function getOptions () {
  return options
}

/**
 * Set the default library renderer styles. Note that updating styles when
 * a custom renderer is currently active, it will have no effect.
 * @memberOf module:lib/solidapi
 * @param {module:soliderror~SolidErrorStylesType} props Solid Renderer styles
 * @version 0.1.0
 * @since 0.1.0
 */
function setStyles ( props ) {
  if ( options.renderer.constructor.name === 'SolidRender' ) {
    options.renderer.setProps( props )
  }
}

/**
 * Get SysErrors object for retrieving.
 * @memberOf module:lib/solidapi
 * {@link module:lib/soliderror~SolidErrorPropsType|SolidError properties} from
 * external definitions.
 * @return {module:lib/syserrors~SysErrors} SysErrors object
 * @version 0.1.0
 * @since 0.1.0
 */
function getSysErrors () {
  return sysErrors
}

module.exports = {
  setOptions,
  getOptions,
  getSysErrors,
  setStyles
}
