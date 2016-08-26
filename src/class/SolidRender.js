/**
 * @flow
 * @module    class/SolidRender
 * @author    Roberto Mauro <erremauro@icloud.com>
 * @license   MIT License. See LICENSE file in the root directory.
 * @version   0.1.0
 * @since     0.3.1
 *
 * @requires class/SolidObject~SolidObject
 * @requires class/TTYRender~TTYRender
 * @requires lib/SolidText~SolidText
 */

const SolidObject = require( './SolidObject' )
const TTYRender = require( './TTYRender' )
const SolidText = require( '../lib/SolidText' )

/**
 * SolidRender default properties
 * @const
 * @default
 */
const SolidRenderDefaults: SolidRenderStyles = {
  columns: 80,
  wordwrap: true,
  markdown: true,
  marginRight: 2,
  textColor: 'reset',
  messageColor: 'yellow',
  explainColor: 'reset',
  headerColor: 'cyan',
  hintsColor: 'reset',
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

/**
 * SolidError's default Renderer
 * @class
 * @property {SolidRenderStyles} props SolidRender properties
 * @param {SolidRenderStyles} [props] SolidRender properties
 */
class SolidRender extends SolidObject {

  constructor( props?: SolidRenderStyles ) {
    super( props, SolidRenderDefaults )
  }

  propsDidUpdate() {
    const ttyProps = {
      wordwrap: this.props.wordwrap,
      columns: this.props.columns,
      markdown: this.props.markdown
    }

    SolidText.setMarkedOptions({
      renderer: new TTYRender( ttyProps ),
      sanitize: true,
      tables: true,
      gfm: true,
      breaks: false,
    })
  }

  /**
   * Render the error header
   * @param  {string} readableName SolidError readable name
   * @return {string}              Renderer header section
   * @since 0.1.0
   * @version 0.1.1
   */
  header( readableName: string ): string {
    const headerTitle = this.fixColonInHeaderTitle(
      this.props.headerTitle,
      readableName
    )

    const headerText = readableName
      ? `${headerTitle} ${readableName}`
      : headerTitle

    const coloredText = this.applyColor(
      this.props.headerColor,
      this.getDivider( headerText, this.props.headerStyle )
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
  message( text: string ): string {
    const formattedText = this.formatText( text )
    const color = this.props.messageColor
    return '\n' + this.applyColor( color, formattedText  ) + '\n'
  }

  /**
   * Render SolidError explanation
   * @param  {string} text SolidError's error explanation
   * @return {string}      Renderer explain section
   * @since 0.1.0
   * @version 0.1.1
   */
  explain( text: string ): string {
    if ( this.props.markdown ) {
      return SolidText.markdown2tty( text )
    }

    return '\n' + this.applyColor(
      this.props.explain,
      this.formatText( text )
    )
  }

  /**
   * Render SolidError hints
   * @param  {string} text SolidError's error hints
   * @return {string}      Renderer hints section
   * @since 0.1.0
   * @version 0.1.0
   */
  hints( text: string ): string {
    let hintsText = text
    let divider = this.getDivider(
      this.props.hintsTitle,
      this.props.hintsStyle
    )
    divider = this.applyColor(
      this.props.hintsColor,
      divider
    )

    hintsText = this.props.markdown
      ? SolidText.markdown2tty( hintsText )
      : '\n' + this.formatText( hintsText ) + '\n'

    return `\n${divider}\n${hintsText}`
  }

  /**
   * Render the SolidError stacktrace
   * @param  {string} stack SolidError's error explanation
   * @return {string}      Renderer trace section
   * @since 0.1.0
   * @version 0.1.0
   */
  trace( stack: string ): string {
    const divider = this.applyColor(
      this.props.traceColor,
      this.getDivider( this.props.traceTitle, this.props.traceStyle )
    )
    return `\n${divider}\n\n${stack}`
  }

  /**
   * Render the SolidError footer
   * @param  {string} [errorCode] Error code
   * @param  {string} [errorPath] Error path
   * @return {string}      Renderer footer section
   * @since 0.1.0
   * @version 0.1.0
   */
  footer( errorCode?: string, errorPath?: string ): string {
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
   * @version 0.1.1
   */
  applyColor( name: string, text: string ): string {
    name.split( '.' ).forEach( (name: string) => {
      if ( typeof SolidText.color[ name ] === 'function' ) {
        const colorFn = SolidText.color[ name ]
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
  formatText( text: string ): string {
    if ( this.props.wordwrap ) {
      return SolidText.wordwrap( text, this.props.columns, true )
    }
    return text
  }

  /**
   * Add or remove ending colon depending on wether header `text` is available
   * or not.
   * @param  {string} title      The header title
   * @param  {string} text       The header text
   * @return {string}            Header title with or without ending colon
   * @since  0.1.0
   * @version 0.1.0
   */
  fixColonInHeaderTitle( title: string, text: string ): string {
    if ( title.slice( -1 ) === ':' ) {
      return text ? title : title.substr( 0, title.length - 1 )
    }
    return title
  }

  /**
   * Crate a divider using the optionsl `style` char and `title` provided. The
   * lenght of the divider depends on SolidRender
   * {@link module:solidrender~SolidRender.props.columns} property.
   *
   * @param  {?string} title Divider label title
   * @param  {?string} style Divider style char
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
  getDivider( title: ?string, style: ?string ): string {
    const divStyle = style || this.props.dividerStyle

    let divider = [ 1, 2, 3, 4 ].map( (): string => divStyle ).join( '' )
    divider = title ? divider + ' ' + title + ' ' : ''

    const len = this.props.columns - divider.length - this.props.marginRight
    for ( let i = 0; i <= len; i += divStyle.length ) {
      divider += divStyle
    }

    return divider
  }
}

module.exports = SolidRender
