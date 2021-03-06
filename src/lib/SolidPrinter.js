/**
 * SolidPrinter.js
 * 2016, Roberto Mauro
 * @flow
 */
const SolidError = require( '../class/SolidError' )
const SolidApi = require( '../shared/SolidApi' )

/**
 * @module lib/SolidPrinter
 * @exports {@link lib/SolidPrinter.logError|logError}
 * @exports {@link lib/SolidPrinter.render|render}
 */
const SolidPrinter = {
  /**
   * Log an Error to the console. If the provided error is a SolidError
   * it will be renderer using the current
   * {@link module:lib/solidapi.options.renderer|rederer}
   * @memberOf module:lib/SolidPrinter
   * @param  {any} error Any Error type object
   * @returns {undefined}
   * @version 0.1.0
   * @since 0.1.0
   */
  logError: ( error: any ) => {
    if ( !error instanceof SolidError ) {
      console.log( error )
      return
    }
    console.log( SolidPrinter.render( error ) )
  },

  /**
   * Render a SolidError
   * @memberOf module:lib/SolidPrinter
   * @param  {SolidError} solidError A SolidError object
   * @return {string}                Renderer SolidError
   * @version 0.1.0
   * @since 0.1.0
   */
  render: ( solidError: SolidError ): string => {
    const options = SolidApi.getOptions()
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
}

module.exports = SolidPrinter
