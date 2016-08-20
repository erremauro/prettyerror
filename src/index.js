const SolidRender = require( './lib/solidrender' )
const SolidError = require( './lib/soliderror' )
const Options = require( './lib/options' )

Options.setOptions({
  renderer: new SolidRender()
})

function logError ( error ) {
  if ( error.constructor.name !== 'SolidError' ) {
    return console.log( error )
  }
  console.log( render( error ) )
}

function render ( solidError ) {
  const options = Options.getOptions()
  const render = options.renderer

  let result = ''

  result += render.header( solidError.props.readableName || '' )
  result += render.message( solidError.message )

  if ( solidError.props.explain ) {
    result += render.explain( solidError.props.explain )
  }

  if ( solidError.props.hints ) {
    result += render.hints( solidError.props.hints )
  }

  return result + render.footer( solidError.code, solidError.path )
}

module.exports = {
  setOptions: Options.setOptions,
  getOptions: Options.getOptions,
  setStyles: Options.setStyles,
  logError,
  render,
  SolidError,
}
