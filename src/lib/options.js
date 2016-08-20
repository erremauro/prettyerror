let options = {
  renderer: null,
  lang: 'en',
  includes: [],
}

const SysErrors = require( './syserrors' )
const sysErrors = new SysErrors({
  lang: options.lang,
  includes: options.includes
}) 

const Options = {
 setOptions,
 getOptions,
 setStyles,
 getSysErrors,
}

function setOptions ( props ) {
  options = Object.assign( options, props )
  sysErrors.setProps({
    lang: options.lang,
    includes: options.includes
  })
}

function getOptions () {
  return options
}

function setStyles ( props ) {
  if ( options.renderer.constructor.name === 'SolidRender' ) {
    options.renderer.setProps( props )
  }
}

function getSysErrors () {
  return sysErrors
}

module.exports = Options
