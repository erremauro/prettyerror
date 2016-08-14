/**
 * A [marked](https://github.com/chjj/marked) renderer for the terminal.
 * @module  lib/renderer
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.0
 * @since  0.2.0
 */

var colors = require( 'chalk' )
var Table = require('cli-table')
var cardinal = require( 'cardinal' )
var emoji = require('node-emoji')
var wordwrap = require( './wordwrap' )

var TABLE_CELL_SPLIT = '^*||*^';
var TABLE_ROW_WRAP = '*|*|*|*';
var TABLE_ROW_WRAP_REGEXP = new RegExp( escapeRegExp( TABLE_ROW_WRAP ), 'g');

var COLON_REPLACER = '*#COLON|*'
var COLON_REPLACER_REGEXP = new RegExp(escapeRegExp( COLON_REPLACER ), 'g')

var HARD_RETURN = '\r'

module.exports = PrettyRenderer

//////////////

/**
 * PrettyRenderer style properties
 * @typedef module:lib/renderer~PrettyRendererProps
 * @property {Function} code         Chalk coloring function
 * @property {Function} blockquote   Chalk coloring function
 * @property {Function} html         Chalk coloring function
 * @property {Function} heading      Chalk coloring function
 * @property {Function} firstHeading Chalk coloring function
 * @property {Function} hr           Chalk coloring function
 * @property {Function} listitem     Chalk coloring function
 * @property {Function} table        Chalk coloring function
 * @property {Function} paragraph    Chalk coloring function
 * @property {Function} strong       Chalk coloring function
 * @property {Function} em           Chalk coloring function
 * @property {Function} codespan     Chalk coloring function
 * @property {Function} del          Chalk coloring function
 * @property {Function} link         Chalk coloring function
 * @property {Function} href         Chalk coloring function
 * @property {Function} text         Chalk coloring function
 * @property {boolean}  gfm          Activate GitHub Flavored Markdown syntax
 * @property {boolean}  emoji        Activate emoji support
 * @property {number}   columns      Maximum text width
 * @property {boolean}  table        Render markdown tables.
 */
var defaultProps = {
  code: colors.yellow,
  blockquote: colors.gray.italic,
  html: colors.gray,
  heading: colors.green,
  firstHeading: colors.blue.bold,
  hr: colors.reset,
  listitem: colors.reset,
  table: colors.reset,
  paragraph: colors.reset,
  strong: colors.bold,
  em: colors.italic,
  codespan: colors.yellow,
  del: colors.dim.gray.strikethrough,
  link: colors.blue,
  href: colors.blue.underline,
  text: colors.white,
  gfm: true,
  emoji: true,
  columns: 80,
  wordwrap: true,
  tables: true,
}

/**
 * @class
 * @classdesc
 *
 * Render [marked](https://github.com/chjj/marked) structure to stylized
 * text for the terminal.
 *
 * @memberOf module:lib/renderer
 * @property {module:lib/renderer~PrettyRendererProps} props  options
 *
 * @description
 *
 * Initialize PrettyRenderer options, emoji support and syntax sanitizing.
 *
 * @param {module:lib/renderer~PrettyRendererProps} props PrettyRenderer options
 *
 * @version 0.1.0
 * @since 0.1.0
 */
function PrettyRenderer( props ) {
  this.props = Object.assign( {}, this.props, defaultProps )
  this._transform = compose( undoColon, unescapeEntities, insertEmojis )
  this._emoji = insertEmojis
  this._highlightOptions = {}
}

/**
 * Fix terminal hardreturn
 * @param  {string} text        Text containing an hard return
 * @param  {boolena} wordwrapped Defines if the text is wordwrapped
 * @return {string}             A sanitized string
 * @version 0.1.0
 * @since 0.1.0
 */
function fixHardReturn( text, wordwrapped ) {
  return wordwrapped ? text.replace( HARD_RETURN, /\n/g ) : text
}

/**
 * Indent body, colorize text via props and add line spacing to begin and end
 * of the line.
 *
 * @see {@link module:lib/renderer~PrettyRendererProps}
 * @param  {string} quote Blockquote text
 * @return {string}       line spaced, indented and colorized blockquote
 *
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.blockquote = function( quote ) {
  return '\n' + this.props.blockquote( indentify( quote.trim() ) ) + '\n'
}

/**
 * Render a break with a hard-return (`/r`) when wordwrap options is active,
 * otherwise fallsback to a standard carriage return (`\n`).
 * @return {string}   Hard or standard return (`\r` OR `\n`)
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.br = function() {
  return this.props.wordwrap ? HARD_RETURN : '\n'
}

/**
 * Indent and colorize codeblock via props style. If javascript syntax is
 * detected via GitHub Flavored Markdown (gfm) backtick syntax, the code
 * will be highlighted accordingly. Codeblock is line spaced at the beginning
 * and the end of the block.
 * @see {@link module:lib/renderer~PrettyRendererProps}
 * @param  {string} code Raw codeblock's code
 * @param  {string} lang Language syntax code
 * @return {string}      Line spaced, indented, hilighted codeblock
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.code = function( code, lang ) {
  return '\n' + indentify(
    highlight( code, lang, this.props, this._highlightOptions ) ) + '\n'
}

/**
 * Colorize inline code span via props style.
 * @param  {string} text Inline raw code
 * @return {string}      Colorized inline code
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.codespan = function( text ) {
  text = fixHardReturn( text, this.props.wordwrap )
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
PrettyRenderer.prototype.del = function( text ) {
  return this.props.del( text )
}

/**
 * Render text to italic via props style
 * @see {@link module:lib/renderer~PrettyRendererProps}
 * @param  {string} text Text to convert to italic
 * @return {string}      Italic text via props style
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.em = function( text ) {
  text = fixHardReturn( text, this.props.wordwrap )
  return this.props.em( text )
}

/**
 * Stylez markdown headings. The title heading can be styled differently
 * from the subsequent heading via props styles.
 * @param  {string} text  Heading text
 * @param  {string} level Heading level
 * @param  {string} raw   Heading raw text
 * @return {string}       Styled heading
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.heading = function( text, level, raw ) {
  text = this._transform( text )
  var prefix = new Array( level + 1 ).join( '#' ) + ' '
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
 * Stylize a markdown break as line
 * @return {string}      Styled markdown break
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.hr = function() {
  return this.props.hr(
    hr( '-', this.props.wordwrap && this.props.columns ) ) + '\n'
}

/**
 * Stylize html text via props style
 * @param  {string} text HTML text
 * @return {string}      HTML styled text
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.html = function( text ) {
  return this.props.html( text )
}

/**
 * Stylize a markdown image similarly to a link.
 * @see {@link modue:lib/render~PrettyError#link}
 * @param  {string} href  Image URL
 * @param  {string} [title] Image title
 * @param  {string} [text]  Image alternate text
 * @return {string}         Styled markdown image syntax
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.image = function( href, title, text ) {
  var out = '![' + text
  out += title ? ' – ' + title : ''
  return this.props.link( out + '](' + href + ')\n' )
}

/**
 * Render a Markdown link.
 * @param  {string} href  Link URL
 * @param  {string} title Link title
 * @param  {string} text  Link text.
 * @return {string}       Styled link.
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.link = function( href, title, text ) {
  try {
    var prot = decodeURIComponent(unescape( href ) )
      .replace( /[^\w:]/g, '' )
      .toLowerCase()
  } catch ( err ) {
    return ''
  }

  if ( prot.indexOf( 'javascript:' ) === 0 ) { // eslint-disable-line
    return '';
  }

  var hasText = text && text !== href;
  var out = '';
  out += hasText ? this._emoji( text ) + ' (' : ''
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
PrettyRenderer.prototype.list = function( body, ordered ) {
  body = indentLines( this.props.listitem( body ) )
  if ( !ordered ) {
    return formatUnordered( body )
  }
  return changeToOrdered( body )
}

/**
 * Rendere a single list item.
 * @see module:lib/renderer~PrettyRenderer#list
 * @param  {string} text Single item list text.
 * @return {string}      Rendered item list.
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.listitem = function( text ) {
  var isNested = ~text.indexOf( '\n' ) // eslint-disable-line
  if ( isNested ) {
    text = text.trim()
  }
  return '\n * ' + this._transform( text )
}

/**
 * Stylize a markdown paragraph.
 * @param  {string} text Paragraph text
 * @return {string}      Styled paragraph
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.paragraph = function( text ) {
  text = this._transform( text )
  text = wordwrap( text, this.props.columns, this.props.gfm )
  return '\n' + text + '\n'
}

/**
 * Render markdown strong text format via props styles.
 * @see {@link module:lib/renderer~PrettyErrorProps}
 * @param  {string} text Markdown strong text
 * @return {string}      Styled strong text via props styles.
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.strong = function( text ) {
  return this.props.strong( text )
}

/**
 * Render a markdown table
 * @param  {string} header Table header
 * @param  {string} body   Table body
 * @return {string}        Style table for the terminal
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.table = function(header, body) {
  var table = new Table( Object.assign({}, {
      head: createTableRow( header )[0]
  }, this.tableSettings ) )

  createTableRow( body, this._transform ).forEach( function (row) {
    table.push( row )
  })
  return '\n' + this.props.table( table.toString() ) + '\n'
}

/**
 * Style a single markdown table row
 * @see {@link module:lib/renderer~PrettyError#table}
 * @param  {string} content Row content
 * @return {string}         Styled text row
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.tablerow = function(content) {
  return TABLE_ROW_WRAP + content + TABLE_ROW_WRAP + '\n';
}

/**
 * Render a single markdown table cell
 * @see {@link module:lib/renderer~PrettyError#table}
 * @param  {string} content Cell content
 * @param  {string} flags   Cell flags
 * @return {string}         Rendered cell
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.tablecell = function(content, flags) {
  return content + TABLE_CELL_SPLIT;
}

/**
 * Render standard markdown text
 * @param  {string} text Markdown text
 * @return {strong}      Resulting styled text
 * @version 0.1.0
 * @since 0.1.0
 */
PrettyRenderer.prototype.text = function( text ) {
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
function changeToOrdered( text ) {
  var i = 1;
  return '\n' + text.split( '\n' ).reduce( function ( acc, line ) {
    if ( !line ) { return '\n' + acc }
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
function formatUnordered( text ) {
  return '\n' + text.split( '\n' ).reduce( function ( acc, line ) {
    if ( !line ) { return '\n' + acc }
    return acc + line + '\n'
  }).trim() + '\n' // remove last carriage return
}

/**
 * Format code highlighting for markdown codeblocks.
 * @see {@link module:lib/renderer~PrettyError#code}
 * @see {@link module:lib/renderer~PrettyError#codespan}
 * @param  {string} code           Code block
 * @param  {string} lang           Language code
 * @param  {string} opts           PrettyError props
 * @param  {string} hightlightOpts Highlight specific options
 * @return {string}                Highlighted codeblock
 * @version 0.1.0
 * @since 0.1.0
 */
function highlight( code, lang, opts, hightlightOpts ) {
  if ( !colors.enabled ) { return code }

  var style = opts.code;

  code = fixHardReturn( code, opts.wordwrap )
  if ( lang !== 'javascript' && lang !== 'js' ) {
    return style( code )
  }

  try {
    return cardinal.highlight( code, hightlightOpts )
  } catch ( err ) {
    return style( code )
  }
}

/**
 * Render a markdown break
 * @param  {string} inputHrStr Break char (i.e. "-")
 * @param  {number} length     Break chars length
 * @return {string}            A styled markdown break
 * @version 0.1.0
 * @since 0.1.0
 */
function hr( inputHrStr, length ) {
  length = length || process.stdout.columns;
  return ( new Array( length ) ).join( inputHrStr )
}

/**
 * Return rendered tab spaced by give `size`
 * @param  {number} [size=4] Tab size in spaces
 * @return {string}          Tab spaces
 * @version 0.1.0
 * @since 0.1.0
 */
function tab( size ) {
  size = size || 4;
  return ( new Array( size ) ).join( ' ' )
}

/**
 * Indent single line of `text`.
 * @see {@link module:lib/renderer~PrettyError#list}
 * @param  {string} text Text to be indented
 * @return {string}      Indented text
 * @version 0.1.0
 * @since 0.1.0
 */
function indentLines( text ) {
  return text.replace( /\n/g, '\n' + tab() ) + '\n\n'
}

/**
 * Indend a block of text.
 * @see {@link module:lib/renderer~PrettyError#blockquote}
 * @see {@link module:lib/renderer~PrettyError#code}
 * @param  {string} text Text to be indented
 * @return {string}      Indented text block
 * @version 0.1.0
 * @since 0.1.0
 */
function indentify( text ) {
  if ( !text ) { return text }
  return tab() + text.split( '\n' ).join( '\n' + tab() )
}

/**
 * Render emoji from emoji tag (i.e. :heart: ) in given `text`.
 * @todo Fix emoji spacing.
 * @param  {string} text Text with emojis.
 * @return {string}      Text with rendered emoji tags
 * @version 0.1.0
 * @since 0.1.0
 */
function insertEmojis( text ) {
  return text.replace( /:([A-Za-z0-9_\-\+]+?):/g, function ( emojiString ) {
    var emojiSign = emoji.get( emojiString )
    if ( !emojiSign ) { return emojiString }
    // TODO: emojis are still stacked when printed
    return emojiSign + ' '
  })
}

/**
 * Restore a replaced colon
 * @param  {string} str String with replaced colon
 * @return {string}     String with restored colon
 * @version 0.1.0
 * @since 0.1.0
 */
function undoColon (str) {
  return str.replace( COLON_REPLACER_REGEXP, ':')
}

/**
 * Escape regexp from text
 * @param  {string} str Text with RegExp formatted content
 * @return {string}     Text with escaped RegExp content.
 * @version 0.1.0
 * @since 0.1.0
 */
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

/**
 * Split text into lines and converted to a formatted table row text.
 * @param  {string} text   Text to convert into a table row.
 * @param  {Function} escape Escape function
 * @return {string}          A table row from text.
 * @version 0.1.0
 * @since 0.1.0
 */
function createTableRow( text, escape ) {
  if ( !text ) { return [] }
  escape = escape || identity
  var lines = escape( text ).split( '\n' )

  var data = [];
  lines.forEach( function (line) {
    if ( !line ) { return }
    var parsed = line
      .replace( TABLE_ROW_WRAP_REGEXP, '' )
      .split( TABLE_CELL_SPLIT )

    data.push(parsed.splice( 0, parsed.length - 1 ) )
  })

  return data
}

/**
 * A helper function for standard text. It return what it gets.
 * @param  {string} str Text
 * @return {string}     Text
 * @version 0.1.0
 * @since 0.1.0
 */
function identity( str ) {
  return str
}

/**
 * Unascape HTML entities
 * @param  {string} html HTML markup text
 * @return {string}      HTML markup with unescaped entities.
 * @version 0.1.0
 * @since 0.1.0
 */
function unescapeEntities( html ) {
  return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'") // eslint-disable-line
}

/**
 * Compose a chian of functions into a single function.
 * @param {arguments} Function arguments
 * @return {Function} A function
 * @version 0.1.0
 * @since 0.1.0
 */
function compose() {
  var funcs = arguments;
  return function() {
    var args = arguments;
    for ( var i = funcs.length; i-- > 0; ) {
      args = [ funcs[ i ].apply( this, args ) ]
    }
    return args[ 0 ]
  }
}
