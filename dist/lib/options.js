'use strict';

var options = {
  renderer: null,
  lang: 'en',
  includes: []
};

var SysErrors = require('./syserrors');
var sysErrors = new SysErrors({
  lang: options.lang,
  includes: options.includes
});

var Options = {
  setOptions: setOptions,
  getOptions: getOptions,
  setStyles: setStyles,
  getSysErrors: getSysErrors
};

function setOptions(props) {
  options = Object.assign(options, props);
  sysErrors.setProps({
    lang: options.lang,
    includes: options.includes
  });
}

function getOptions() {
  return options;
}

function setStyles(props) {
  if (options.renderer.constructor.name === 'SolidRender') {
    options.renderer.setProps(props);
  }
}

function getSysErrors() {
  return sysErrors;
}

module.exports = Options;