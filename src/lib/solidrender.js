/**
 * Expose default SolidError {@link SolidRenderer~SolidRendererType|renderer}.
 * @module lib/solidrender
 * @author Roberto Mauro <erremauro@icloud.com>
 * @since 0.3.0
 * @version 0.1.0
 * 
 * @requires {@link https://github.com/chalk/chalk|chalk}
 * @requires {@link https://github.com/chjj/marked|marked}
 * @requires {@link module:lib/solidtext|SolidText}
 * @requires {@link module:lib/ttyrender|TTYRender}
 */

const colors = require( 'chalk' )
const marked = require( 'marked' )
const SolidText = require( './solidtext' )
const TTYRender = require( './ttyrender' )

/**
 * @class
 *
 * Default {@link module:lib/soliderror~SolidError|SolidError}
 * {@link SolidRenderer.SolidRendererType|renderer}.
 *
 * @see {@link module:soliderror.render|SolidError render function}
 * 
 * @property {SolidRender~SolidRenderPropsType} props SolidRender properties
 * 
 * @description Initializes markdown renderer and set renderer properties.
 * @param {SolidRender~SolidRenderPropsType} [props] SolidRender properties
 * 
 * @since 0.1.0
 * @version 0.1.0
 */
class SolidRender {

  constructor( props ) {
    this.marked = marked
    this.setProps( props )
  }

  /**
   * Set object properties.
   * @param {SolidRenderPropsType} props SolidRender properties
   * @since 0.1.0
   * @version 0.1.0
   */
  setProps( props ) {
    this.props = Object.assign( this.props || this.defaultProps(), props )

    const ttyProps = {
      wordwrap: this.props.wordwrap,
      columns: this.props.columns,
      markdown: this.props.markdown
    }

    this.marked.setOptions({
      renderer: new TTYRender( ttyProps ),
      sanitize: true,
      tables: true,
      gfm: true,
      breaks: false,
    })
  }

  /**
   * Get the default object properties
   * @return {SolidRenderPropsType} default properties
   * @since 0.1.0
   * @version 0.1.0
   */
  defaultProps() {
    return {
      columns: 80,
      wordwrap: true,
      markdown: true,
      marginRight: 2,
      textColor: 'reset',
      messageColor: 'yellow',
      explainColor: 'reset',
      headerColor: 'cyan',
      hintsColor: 'green',
      footerColor: 'cyan',
      traceColor: 'reset',
      headerTitle: 'ERROR:',
      hintsTitle: 'HINTS:',
      traceTitle: 'STACK TRACE:',
      dividerStyle: '-',
      headerStyle: '=',
      hintsStyle: '-',
      footerStyle: '-',
      traceStyle: '-'
    }
  }

  /**
   * Render the error header
   * @param  {strong} readableName SolidError readable name
   * @return {string}              Renderer header section
   * @since 0.1.0
   * @version 0.1.0
   */
  header( readableName ) {
    const headerTitle = readableName
      ? `${this.props.headerTitle} ${readableName}`
      : this.props.headerTitle

    const coloredText = this.applyColor(
      this.props.headerColor,
      this.getDivider( headerTitle, this.props.headerStyle )
    )
    return `\n${coloredText}\n`
  }

  /**
   * Render the error message
   * @param  {string} text The error message
   * @return {string}      Renderer header section
   * @since 0.1.0
   * @version 0.1.0
   */
  message( text ) {
    const formattedText = this.formatText( text )
    const color = this.props.messageColor
    return '\n' + this.applyColor( color, formattedText  ) + '\n'
  }

  /**
   * Render SolidError explanation
   * @param  {string} text SolidError's error explanation
   * @return {string}      Renderer explain section
   * @since 0.1.0
   * @version 0.1.0
   */
  explain( text ) {
    if ( this.props.markdown ) {
      return this.marked( text )
    }

    return '\n' + this.applyColor( this.props.explain, text )
  }

  /**
   * Render SolidError hints
   * @param  {string} text SolidError's error hints
   * @return {string}      Renderer hints section
   * @since 0.1.0
   * @version 0.1.0
   */
  hints( text ) {
    let hintsText = text
    let divider = this.getDivider(
      this.props.hintsTitle,
      this.props.hintsStyle
    )
    divider = this.applyColor(
      this.props.hintsColor,
      divider
    )

    if ( this.props.markdown ) {
      hintsText = this.marked( hintsText )
    }
    else {
      hintsText = '\n' + hintsText
    }

    const formattedText = this.formatText( hintsText )
    return `\n${divider}\n${formattedText}`
  }

  /**
   * Render the SolidError stacktrace
   * @param  {string} text SolidError's error explanation
   * @return {string}      Renderer trace section
   * @since 0.1.0
   * @version 0.1.0
   */
  trace( stack ) {
    const divider = this.applyColor(
      this.props.traceColor,
      this.getDivider( this.props.traceTitle, this.props.traceStyle )
    )
    return `\n${divider}\n\n${stack}`
  }

  /**
   * Render the SolidError footer
   * @param  {string} errorCode Error code
   * @param  {string} errorPath Error path
   * @return {string}      Renderer footer section
   * @since 0.1.0
   * @version 0.1.0
   */
  footer( errorCode, errorPath ) {
    if ( !errorCode && !errorPath ) return ''
    const footerDivider = this.getDivider( null, this.props.footerSytle )
    let text = ''

    if ( errorCode ) {
      text += this.formatText( `Code: ${errorCode}` )
      text += errorPath ? '\n' : ''
    }

    if ( errorPath ) {
      text += this.formatText( `Path: ${errorPath}` )
    }
    text = `${footerDivider}\n${text}\n${footerDivider}`
    return '\n' + this.applyColor( this.props.footerColor, text ) + '\n'
  }

  /**
   * Apply the given color `name` to `text` using
   * {@link https://github.com/chalk/chalk|chalk}. Color name is transpilled to
   * chalk functions.
   *
   * @param  {string} name Color name
   * @param  {string} text Text that should be colored
   * @return {string}      Colored text
   *
   * @example
   *
   * this.applyColor(
   *   'cyan.dim.strong.italic', 
   *   'Will print a strong, italic, dimmed cyan text'
   * )
   *
   * @since 0.1.0
   * @version 0.1.0
   */
  applyColor( name, text ) {
    name.split( '.' ).forEach( style => {
      if ( typeof colors[ style ] === 'function' ) {
        const colorFn = colors[ style ]
        text = colorFn( text )
      }
    })
    return text
  }

  /**
   * Wordwrap givn `text` if 
   * {@link module:lib/solidrender~SolidReder.props.markdown|markdown} is
   * activated (true by default) otherwise returns the text as is.
   * @param  {string} text Text to be formatted.
   * @return {string}      Formatted text.
   * @since 0.1.0
   * @version 0.1.0
   */
  formatText( text ) {
    if ( this.props.wordwrap ) {
      return SolidText.wordwrap( text, this.props.columns, true )
    }
    return text
  }

  /**
   * Crate a divider using the optionsl `style` char and `title` provided. The
   * lenght of the divider depends on SolidRender
   * {@link module:solidrender~SolidRender.props.columns} property.
   * 
   * @param  {string} title Divider label title
   * @param  {string} style Divider style char
   * @return {string}       A divider
   *
   * @example
   *
   * getDivider( 'HINTS', '=' )
   * 
   * // return something like:
   * // ==== HINTS: ===============
   * 
   * @since 0.1.0
   * @version 0.1.0
   */
  getDivider( title, style ) {
    style = style || this.props.dividerStyle

    let divider = [ 1, 2, 3, 4 ].map( () => style ).join( '' )
    divider = title ? divider + ' ' + title + ' ' : ''

    const len = this.props.columns - divider.length - this.props.marginRight
    for ( let i = 0; i <= len; i += style.length ) {
      divider += style
    }

    return divider
  }
}

module.exports = SolidRender
