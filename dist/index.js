'use strict';

var SolidRender = require('./lib/solidrender');
var SolidError = require('./lib/soliderror');
var Options = require('./lib/options');

Options.setOptions({
  renderer: new SolidRender()
});

function logError(error) {
  if (error.constructor.name !== 'SolidError') {
    return console.log(error);
  }
  console.log(render(error));
}

function render(solidError) {
  var options = Options.getOptions();
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
  setOptions: Options.setOptions,
  getOptions: Options.getOptions,
  setStyles: Options.setStyles,
  logError: logError,
  render: render,
  SolidError: SolidError
};