const colors = require( 'chalk' )
const marked = require( 'marked' )
const SolidText = require( './solidtext' )
const TTYRender = require( './ttyrender' )

class SolidRender {

  constructor( props ) {
    this.marked = marked
    this.setProps( props )
  }

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

  message( text ) {
    const formattedText = this.formatText( text )
    const color = this.props.messageColor
    return '\n' + this.applyColor( color, formattedText  ) + '\n'
  }

  explain( text ) {
    if ( this.props.markdown ) {
      return this.marked( text )
    }

    return '\n' + this.applyColor( this.props.explain, text )
  }

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

  trace( stack ) {
    let divider = this.applyColor(
      this.props.traceColor,
      this.getDivider( this.props.traceTitle, this.props.traceStyle )
    )
    return `\n${divider}\n\n${stack}`
  }

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

  applyColor( name, text ) {
    name.split( '.' ).forEach( style => {
      if ( typeof colors[ style ] === 'function' ) {
        const colorFn = colors[ style ]
        text = colorFn( text )
      }
    })
    return text
  }

  formatText( text ) {
    if ( this.props.wordwrap ) {
      return SolidText.wordwrap( text, this.props.columns, true )
    }
    return text
  }

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
