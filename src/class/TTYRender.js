/** @flow */
const Table = require( 'cli-table' )
const cardinal = require( 'cardinal' )
const SolidObject = require( './SolidObject' )
const SolidText = require( '../lib/SolidText' )
const wordwrap = SolidText.wordwrap
const escapeRegExp = SolidText.escapeRegExp
const emojis = SolidText.emojis

/**
 * Default TTYRender properties
 * @const {TTYRenderProps}
 * @default
 */
const defaultProps: TTYRenderProps = {
  tables: true,
  columns: 80,
  emojis: true,
  wordwrap: true,
  highlightOptions: {},
  tableSettings: {},
  blockquote: SolidText.color.gray.italic,
  code: SolidText.color.yellow,
  codespan: SolidText.color.yellow,
  del: SolidText.color.dim.gray.strikethrough,
  em: SolidText.color.italic,
  firstHeading: SolidText.color.blue.bold,
  gfm: true,
  heading: SolidText.color.green,
  hr: SolidText.color.reset,
  href: SolidText.color.blue.underline,
  html: SolidText.color.gray,
  link: SolidText.color.blue,
  listitem: SolidText.color.reset,
  paragraph: SolidText.color.reset,
  strong: SolidText.color.bold,
  table: SolidText.color.reset,
  text: SolidText.color.white,
}

const HARD_RETURN = '\r'
const COLON_REPLACER = '*#COLON|*'
const TABLE_CELL_SPLIT = '^*||*^'
const TABLE_ROW_WRAP = '*|*|*|*'
const TABLE_ROW_WRAP_REGEXP = new RegExp( escapeRegExp( TABLE_ROW_WRAP ), 'g')
const COLON_REPLACER_REGEXP = new RegExp( escapeRegExp( COLON_REPLACER ), 'g')

/**
 * @class
 * @classdesc Render marked output in the terminal.
 *
 * @property {any} emojis Emojis object
 * @property {Function} transform Transform text function
 * @property {TTYRenderProps} props TTYRender properties
 *
 * @requires cardinal
 * @requires cli-table
 * @requires SolidText
 *
 * @author Roberto Mauro <erremauro@icloud.com>
 * @since  0.3.0
 * @version 0.1.2
 */
class TTYRender extends SolidObject {
  emojis: any;
  transform: Function;
  props: Object;

  /**
   * Initialized render
   * @param  {?TTYRenderProps}  props TTYRender properties
   */
  constructor( props?: TTYRenderProps ) {
    super( props, defaultProps )
    this.emojis = emojis
    this.transform = this.compose(
      this.undoColon.bind( this ),
      this.unescapeEntities.bind( this ),
      this.emojis.bind( this )
    )
  }

  /**
   * Indent body, colorize text via props and add line spacing to begin and end
   * of the line.
   *
   * @see {@link module:lib/renderer~PrettyRendererProps}
   * @param  {string} quote Blockquote text
   * @return {string}       Line spaced, indented and colorized blockquote
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  blockquote( quote: string ): string {
    return '\n' + this.props.blockquote( this.indentify( quote.trim() ) ) + '\n'
  }

  /**
   * Render a break with a hard-return (`/r`) when wordwrap options is active,
   * otherwise fallsback to a standard carriage return (`\n`).
   *
   * @return {string}   Hard or standard return (`\r` OR `\n`)
   *
   * @version 0.1.0
   * @since 0.1.0
   */
  br(): string {
    return this.props.wordwrap ? HARD_RETURN : '\n'
  }

  /**
   * Indent and colorize codeblock via props style. If javascript syntax is
   * detected via GitHub Flavored Markdown (gfm) backtick syntax, the code
   * will be highlighted accordingly. Codeblock is line spaced at the beginning
   * and the end of the block.
   * @param  {string} code Raw codeblock's code
   * @param  {string} lang Language syntax code
   * @return {string}      Line spaced, indented, hilighted codeblock
   *
   * @version 0.1.1
   * @since 0.1.0
   */
  code( code: string, lang: string ): string {
    return '\n' + this.indentify(
      this.highlight( code, lang, this.props, this.props.highlightOptions )
    ) + '\n'
  }

  /**
   * Colorize inline code span via props style.
   * @param  {string} text Inline raw code
   * @return {string}      Colorized inline code
   * @version 0.1.0
   * @since 0.1.0
   */
  codespan( text: string ): string {
    text = this.fixHardReturn( text, this.props.wordwrap )
    return this.props.codespan( text.replace( /:/g, COLON_REPLACER ) )
  }

  /**
   * Colorize striketrough text via props style
   * @see {@link module:lib/renderer~PrettyRendererProps}
   * @param  {string} text Striketrough raw text
   * @return {string}      Striketrough styled text
   * @version 0.1.0
   * @since 0.1.0
   */
  del( text: string ): string {
    return this.props.del( text )
  }

  /**
   * Render text to italic via props style
   * @see {@link module:lib/renderer~PrettyRendererProps}
   * @param  {string} text Text to convert to italic
   * @return {string}      Italic text via props style
   * @version 0.1.1
   * @since 0.1.0
   */
  em( text: string ): string {
    text = this.fixHardReturn( text, this.props.wordwrap )
    return this.props.em( text )
  }

  /**
   * Stylez markdown headings. The title heading can be styled differently
   * from the subsequent heading via props styles.
   * @param  {string} text  Heading text
   * @param  {string} level Heading level
   * @param  {string} raw   Heading raw text
   * @return {string}       Styled heading
   * @version 0.1.1
   * @since 0.1.0
   */
  heading( text: string, level: number ): string {
    text = this.transform( text )
    const prefix = new Array( level + 1 ).join( '#' ) + ' '
    text = prefix + text

    if ( this.props.wordwrap ) {
      text = wordwrap( text, this.props.columns, this.props.gfm )
    }

    if ( level === 1 ) {
      return '\n' + this.props.firstHeading( text ) + '\n'
    }
    return '\n' + this.props.heading( text ) + '\n'
  }
  /**
   * Stylize a markdown horizontal line
   * @return {string}      Styled markdown break
   * @version 0.1.1
   * @since 0.1.0
   */
  hr(): string {
    const length = this.props.columns
    return '\n' + this.props.hr( ( new Array( length ) ).join( '-' ) ) + '\n'
  }
  /**
   * Stylize html text via props style
   * @param  {string} text HTML text
   * @return {string}      HTML styled text
   * @version 0.1.0
   * @since 0.1.0
   */
  html( text: string ): string {
    return this.props.html( text )
  }
  /**
   * Stylize a markdown image similarly to a link.
   * @see {@link modue:lib/render~SolidError#link}
   * @param  {string} href  Image URL
   * @param  {string} [title] Image title
   * @param  {string} [text]  Image alternate text
   * @return {string}         Styled markdown image syntax
   * @version 0.1.1
   * @since 0.1.0
   */
  image( href: string, title: string, text: string ): string {
    let out = '![' + text
    out += title ? ' – ' + title : ''
    return '\n' + this.props.link( out + '](' + href + ')' ) + '\n'
  }
  /**
   * Render a Markdown link.
   * @param  {string} href  Link URL
   * @param  {string} title Link title
   * @param  {string} text  Link text.
   * @return {string}       Styled link.
   * @version 0.1.1
   * @since 0.1.0
   */
  link( href: string, title: string, text: string ): string {
    try {
      const prot = decodeURI( href )
        .replace( /[^\w:]/g, '' )
        .toLowerCase()
      if ( prot.indexOf( 'javascript:' ) === 0 ) {
        return '';
      }
    } catch ( err ) {
      return ''
    }

    const hasText = text && text !== href;
    let out = ''
    out += hasText ? this.emojis( text ) + ' (' : ''
    out +=  this.props.href( href )
    out += hasText ? ')' : ''
    return this.props.link( out )
  }
  /**
   * Render a markdown list.
   * @param  {string} body    List body
   * @param  {boolean} ordered Defines if it's a ordered list.
   * @return {string}         Styled markdown list.
   * @version 0.1.0
   * @since 0.1.0
   */
  list( body: string, ordered: string ): string {
    body = this.indentLines( this.props.listitem( body ) )
    if ( !ordered ) {
      return this.formatUnordered( body )
    }
    return this.changeToOrdered( body )
  }
  /**
   * Rendere a single list item.
   * @see module:lib/renderer~PrettyRenderer#list
   * @param  {string} text Single item list text.
   * @return {string}      Rendered item list.
   * @version 0.1.1
   * @since 0.1.0
   */
  listitem( text: string ): string {
    const isNested = ~text.indexOf( '\n' )
    if ( isNested ) {
      text = text.trim()
    }
    return '\n * ' + this.transform( text )
  }
  /**
   * Stylize a markdown paragraph.
   * @param  {string} text Paragraph text
   * @return {string}      Styled paragraph
   * @version 0.1.0
   * @since 0.1.0
   */
  paragraph( text: string ): string {
    text = this.transform( text )
    text = wordwrap( text, this.props.columns, this.props.gfm )
    return '\n' + text + '\n'
  }
  /**
   * Render markdown strong text format via props styles.
   * @see {@link module:lib/renderer~SolidErrorProps}
   * @param  {string} text Markdown strong text
   * @return {string}      Styled strong text via props styles.
   * @version 0.1.0
   * @since 0.1.0
   */
  strong( text: string ): string {
    return this.props.strong( text )
  }
  /**
   * Render a markdown table
   * @param  {string} header Table header
   * @param  {string} body   Table body
   * @return {string}        Style table for the terminal
   * @version 0.1.1
   * @since 0.1.0
   */
  table( header: string, body: string ): string {
    const table = new Table( Object.assign({}, {
        head: this.createTableRow( header )[0]
    }, this.props.tableSettings ) )

    this.createTableRow( body, this.transform ).forEach( (row: string) => {
      table.push( row )
    })
    return '\n' + this.props.table( table.toString() ) + '\n'
  }
  /**
   * Render a table row
   * @param  {string} content Row content
   * @return {string}         Rendered Table row
   * @version 0.1.0
   * @since 0.1.0
   */
  tablerow( content: string ): string {
    return TABLE_ROW_WRAP + content + TABLE_ROW_WRAP + '\n'
  }
  /**
   * Render a single markdown table cell
   * @see {@link module:lib/renderer~SolidError#table}
   * @param  {string} content Cell content
   * @param  {string} flags   Cell flags
   * @return {string}         Rendered cell
   * @version 0.1.1
   * @since 0.1.0
   */
  tablecell( content: string ): string {
    return content + TABLE_CELL_SPLIT
  }
  /**
   * Render standard markdown text
   * @param  {string} text Markdown text to be rendered
   * @return {string}      Resulting styled text
   * @version 0.1.0
   * @since 0.1.0
   */
  text( text: string ): string {
    return text
  }
  /**
   * Fix terminal hardreturn
   * @param  {string} text        Text containing an hard return
   * @param  {boolena} wordwrapped Defines if the text is wordwrapped
   * @return {string}             A sanitized string
   * @version 0.1.0
   * @since 0.1.0
   */
  fixHardReturn( text: string, wordwrapped: boolean ): string {
    if ( wordwrapped ) {
      return text.replace( HARD_RETURN, '/\n/g' )
    }
    return text
  }
  /**
   * Convert a markdown pre-rendered unordered list to an ordered one.
   * @see {@link module:lib/renderer~PretyError#list}
   * @see {@link module:lib/renderer~PretyError#listitem}
   * @param  {string} text Ordered list text
   * @return {string}      Converted markdown ordered list
   * @version 0.1.0
   * @since 0.1.0
   */
  changeToOrdered( text: string ): string {
    let i = 1
    return '\n' + text.split( '\n' )
      .reduce( ( acc: string, line: string ): string => {
        if ( !line ) return '\n' + acc
        return acc + line.replace( /(\s*)\*/, '$1' + ( i++ ) + '.' ) + '\n'
      }).trim() + '\n' // remove last carriage return
  }
  /**
   * Format a markdown unordered list.
   * @see {@link module:lib/renderer~PretyError#list}
   * @see {@link module:lib/renderer~PretyError#listitem}
   * @param  {string} text Markdown unordered list.
   * @return {string}      Rendered markdown unordered list
   * @version 0.1.0
   * @since 0.1.0
   */
  formatUnordered( text: string ): string {
    return '\n' + text
      .split( '\n' )
      .reduce( ( acc: string, line: string ): string => {
        if ( !line ) return '\n' + acc
        return acc + line + '\n'
      }).trim() + '\n' // remove last carriage return
  }
  /**
   * Format code highlighting for markdown codeblocks.
   * @see {@link module:lib/renderer~SolidError#code}
   * @see {@link module:lib/renderer~SolidError#codespan}
   * @param  {string} code           Code block
   * @param  {string} lang           Language code
   * @param  {string} opts           SolidError props
   * @param  {string} hightlightOpts Highlight specific options
   * @return {string}                Highlighted codeblock
   * @version 0.1.0
   * @since 0.1.0
   */
  highlight( code: string, lang: string, opts: Object ): string {
    if ( !SolidText.color.enabled ) { return code }

    const style = opts.code;

    code = this.fixHardReturn( code, opts.wordwrap )
    if ( lang !== 'javascript' && lang !== 'js' ) {
      return style( code )
    }

    try {
      return cardinal.highlight( code, this.props.hightlightOpts )
    } catch ( err ) {
      return style( code )
    }
  }
  /**
   * Return rendered tab spaced by give `size`
   * @param  {number} [size=4] Tab size in spaces
   * @return {string}          Tab spaces
   * @version 0.1.0
   * @since 0.1.0
   */
  tab( size?: number ): string {
    size = size || 4;
    return ( new Array( size ) ).join( ' ' )
  }
  /**
   * Indend a block of text.
   * @see {@link module:lib/renderer~SolidError#blockquote}
   * @see {@link module:lib/renderer~SolidError#code}
   * @param  {string} text Text to be indented
   * @return {string}      Indented text block
   * @version 0.1.0
   * @since 0.1.0
   */
  indentify( text: string ): string {
    if ( !text ) { return text }
    return this.tab() + text.split( '\n' ).join( '\n' + this.tab() )
  }
  /**
   * Indent the given `text`.
   * @see {@link module:lib/renderer~SolidError#list}
   * @param  {string} text Text to be indented
   * @return {string}      Indented text
   * @version 0.1.0
   * @since 0.1.0
   */
  indentLines( text: string ): string {
    return text.replace( /\n/g, '\n' + this.tab() ) + '\n\n'
  }

  /**
   * Split text into lines and convert it to a formatted table row text.
   * @memberOf TTYRender
   * @param  {string} text   Text to convert into a table row.
   * @param  {Function} escape Escape function
   * @return {string}          A table row from text.
   * @version 0.1.1
   * @since 0.1.0
   */
  createTableRow( text: string, escape?: Function ): string[] {
    if ( !text ) { return [] }
    escape = escape || this.identity
    const lines = escape( text ).split( '\n' )

    const data = [];
    lines.forEach( ( line: string ) => {
      if ( !line ) return
      const parsed: string[] = line
        .replace( TABLE_ROW_WRAP_REGEXP, '' )
        .split( TABLE_CELL_SPLIT )
      const parsedText: any = parsed.slice( 0, parsed.length - 1 )

      data.push( parsedText )
    })

    return data
  }

  /**
   * Restore a replaced colon
   * @memberOf TTYRender
   * @param  {string} str String with replaced colon
   * @return {string}     String with restored colon
   * @version 0.1.0
   * @since 0.1.0
   */
  undoColon ( str: string ): string {
    return str.replace( COLON_REPLACER_REGEXP, ':')
  }

  /**
   * A helper function for standard text. It return what it gets.
   * @memberOf TTYRender
   * @param  {string} str Text
   * @return {string}     Text
   * @version 0.1.0
   * @since 0.1.0
   */
  identity( str: string ): string {
    return str
  }

  /**
   * Create and return a function that pass its arguments
   * to every function argument provided to `compose`
   * @param {arguments} functions An array of function arguments
   * @return {Function} composed function
   * @version 0.1.0
   * @since 0.1.0
   */
  compose( ...functions: Function[] ): Function {
    return this.composeFunctions.bind( this, functions )
  }

  /**
   * Chain the results of every `funcs` called with `theArgs`. Provided `funcs`
   * are called in reverse order.
   * @param {Functions[]} funcs A collection of functions
   * @param {arguments} theArgs Arguments that will be passed to every `func`
   * @returns {Function} composed function
   * @since 0.3.1
   * @version 0.1.0
   */
  composeFunctions( funcs: Function[], ...theArgs: Function[] ): Function {
    let args = theArgs
    for( let i = funcs.length; i-- > 0; ) {
      args = [ funcs[ i ].apply( this, args ) ]
    }
    return args[ 0 ]
  }

  /**
   * Unascape HTML entities
   * @memberOf TTYRender
   * @param  {string} html HTML markup text
   * @return {string}      HTML markup with unescaped entities.
   * @version 0.1.0
   * @since 0.1.0
   */
  unescapeEntities( html: string ): string {
    const sanitized = html
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
    return sanitized
  }
}

module.exports = TTYRender
