/**
 * @module lib/fmtutil
 * @author  Roberto Mauro <erremauor@icloud.com>
 * @version 0.1.0
 * @since  0.2.0
 */

var colors = require( 'chalk' )
var wordwrap = require( './wordwrap' )
var marked = require( 'marked' )
var Defaults = require( './defaults' )
var PrettyRenderer = require( './renderer' )

/**
 * @name module:lib/fmtutil~FormatOptions
 * @typedef module:lib/fmtutil~FormatOptions
 * @memberOf module:lib/fmtutil
 * @property {boolean} [colors=true]    Defines output color state
 * @property {boolean} [markdown=true]  Defines markdown support
 * @property {boolean} [highlight=true] Define javascript code highlight state
 * @property {boolean} [wordwrap=true]  Wrap paragraph at `columns`
 * @property {number}  [columns=80]     Fix wordwrap width at specified number.
 * @property {Function} [explain]       Explain section style function
 * @property {Function} [header]        Header section style function
 * @property {string} [headerStyle='='] Header character style
 * @property {Functon} [describe]       Describe section style function
 * @property {Functon} [footer]         Footer section style function
 * @property {string} [footerStyle='-'] Footer char style
 * @property {string} [exampleStyle='-'] Example divider char style
 * @property {string} [exampleTitle]     Example section title
 *
 * @version 0.1.0
 * @since 0.2.0
 */

/**
 * @name module:lib/fmtutil.defaultOptions
 * @memberOf module:lib/fmtutil
 * @type {module:lib/fmtutil~FormatOptions}
 *
 * @version 0.1.0
 * @since 0.2.0
 */
var defaultOptions = {
  colors: Defaults.COLORS,
  markdown: Defaults.MARKDOWN,
  wordwrap: Defaults.WORDWRAP,
  highlight: Defaults.HIGHLIGHT,
  columns: Defaults.COLUMNS,
  explain: colors.reset,
  header: colors.cyan,
  headerStyle: Defaults.HEADER_STYLE,
  headerTitle: Defaults.HEADER_TITLE,
  describe: colors.yellow,
  footer: colors.blue,
  footerStyle: Defaults.FOOTER_STYLE,
  example: colors.reset,
  exampleStyle: Defaults.EXAMPLE_STYLE,
  exampleTitle: Defaults.EXAMPLE_TITLE,
  inner: colors.reset,
  innerTitle: Defaults.INNER_TITLE,
  innerStyle: Defaults.INNER_STYLE,
}
/**
 * @name module:lib/fmtutil~options
 * @memberOf module:lib/fmtutil
 * @type {module:lib/fmtutil~FormatOptions}
 *
 * @version 0.1.0
 * @since 0.2.0
 */
var options = {}

// Initialize fmtuitl options
setOptions( defaultOptions )

module.exports = {
  setOptions: setOptions,
  getOptions: getOptions,
  defaultOptions: defaultOptions,
  getDivider: getDivider,
  truncate: truncate,
  format: {
    describe: fmtDescribe,
    explain: fmtExplain,
    example: fmtExample,
    footer: fmtFooter,
    header: fmtHeader,
    trace: fmtTrace,
  },
}

////////////////

/**
 * Format error message sections
 * @typedef {module:lib/fmtutil~Format}
 * @property {Function} describe Fromat PrettyErrors' description message
 */


/**
 * @class format
 * @static
 * @type {module:lib/fmtutil~Format}
 * @memberOf module:lib/fmtutil
 */


/**
 * Set {@link module:lib/fmtutil~FormatOptions|format options} and setup marked.
 * @memberOf module:lib/fmtutil
 * @function
 * @static
 * @param {module:lib/fmtutil~FormatOptions} props Format utils options.
 * @version 0.1.0
 * @since 0.2.0
 */
function setOptions( props ) {
  options = Object.assign( {}, options, props )
  var rendererOptions = {
    wordwrap: options.wordwrap,
    columns: options.columns,
  }
  marked.setOptions({
    renderer: new PrettyRenderer( rendererOptions ),
    sanitize: true,
    tables: true,
    gfm: true,
    breaks: false,
  })
}

/**
 * Get the module global options
 * @memberOf module:lib/fmtutil
 * @function
 * @static
 * @return {module:lib/fmtutil~FormatOptions} Module global options
 * @version 0.1.0
 * @since 0.2.0
 */
function getOptions() {
  return options
}


/**
 * Format PrettyError's description message.
 * @name module:lib/fmtutil.format.describe
 * @memberOf module:lib/fmtutil.format
 * @function
 * @param  {string} errDesc An error description
 * @return {string}         Formatted description
 * @version  0.1.1
 * @since  0.1.0
 */
function fmtDescribe( errDesc ) {
  return options.describe( '\n' + format( errDesc ) + '\n' )
}

/**
 * Format PrettyError's explanation message.
 * @name module:lib/fmtutil.format.explain
 * @memberOf module:lib/fmtutil.format
 * @function
 * @param  {string} errExplain  An error explanation
 * @return {string}             Formatted explanation
 * @version  0.1.1
 * @since  0.1.0
 */
function fmtExplain( errExplain ) {
  if ( options.markdown ) {
    return marked( errExplain )
  }
  return options.explain( '\n' + format( errExplain ) )
}

/**
 * Format PrettyError's example message.
 *
 * **Note**: when {@link module:lib/fmtutil.options|markdown} is active,
 * {@link module:lib/fmtutil.options|example} body color will be **ignored**
 * (the section header will still inherit the option).
 *
 * @name module:lib/fmtutil.format.example
 * @memberOf module:lib/fmtutil.format
 * @function
 * @param  {string} errHint     An example or a hint about the error
 * @return {string}             Formatted example
 * @version  0.1.2
 * @since  0.1.0
 */
function fmtExample( errHint ) {
  var fmt = options.example(
    getDivider( options.exampleTitle, options.exampleStyle )
  )
  if ( options.markdown ) {
    return fmt + marked( errHint )
  }
  return options.example( fmt + '\n' + format( errHint ) + '\n' )
}

/**
 * Format PrettyError's footer message.
 * @name module:lib/fmtutil.format.footer
 * @memberOf module:lib/fmtutil.format
 * @function
 * @param  {string} errcode     Error code
 * @param  {string} errpath     Error's path property value
 * @return {string}             Formatted footer
 * @version  0.1.1
 * @since  0.1.0
 */
function fmtFooter( errcode, errpath ) {
  if ( !errcode && !errpath )  { return '' }

  var fmt = getDivider( null, options.footerStyle )
  if ( errcode ) {
    fmt += format( 'Code:\t' + errcode )
    fmt += errpath ? '\n' : ''
  }
  if ( errpath ) {
    fmt += format( 'Path:\t' + errpath )
  }
  return options.footer( fmt + getDivider( null, options.footerStyle ) )
}

/**
 * Format PrettyError's header message.
 * @name module:lib/fmtutil.format.header
 * @memberOf module:lib/fmtutil.format
 * @function
 * @param  {string} errHeader   Error message
 * @return {string}             Formatted header
 * @version  0.1.2
 * @since  0.1.0
 */
function fmtHeader( errHeader ) {
  var headerTitle = options.headerTitle + ': ' + errHeader
  return options.header( getDivider( headerTitle, options.headerStyle ) )
}

/**
 * Format PrettyError's stack trace.
 *
 * @function
 * @name module:lib/fmtutil.format.trace
 * @memberOf module:lib/fmtutil.format
 *
 * @param  {string} errStack    Error stack
 * @return {string}             Formatted stack trace
 *
 * @version  0.1.2
 * @since  0.1.0
 */
function fmtTrace( errStack ) {
  var fmt = getDivider( options.innerTitle, options.innerStyle )
  fmt += '\n' + errStack
  return options.inner( fmt + '\n' )
}

/**
 * Format text. Text will be wordwrapped if
 * {@link module:lib/fmtutil~options.wordwrap|wardwrap} options is `true`.
 *
 * @memberOf module:lib/fmtutil
 * @see {@module:lib/fmtutil~options|options}
 *
 * @param  {string} text Text to be formatted
 * @return {string}      Unformatted text, or wordwrapped
 *
 * @version 0.1.0
 * @since 0.2.0
 */
function format( text ) {
  if ( options.wordwrap ) {
    return wordwrap( text, options.columns, true )
  }
  return text
}

/**
 * Return a divider with an optional title and style.
 *
 * @memberOf module:lib/fmtutil
 *
 * @param  {string} [title]     A title for the divider.
 * @param  {string} [style='-'] Divider style
 * @returns {string}            A divider with an optional title.
 *
 * @version 0.1.4
 * @since 0.1.0
 */
function getDivider( title, style ) {
  style = style || '-'
  var divider = [1,2,3,4].map( function(){ return style }).join('')
  divider = title ?
    divider + ' ' + title + ' '
    : ''
  var len = options.columns - divider.length

  for ( var i = 0; i <= len; i += style.length ) {
    divider += style
  }
  return '\n' + divider + '\n'
}

/**
 * Truncate a string at `maxlen` and add ellipsis at the end.
 *
 * @memberOf module:lib/fmtutil
 *
 * @param  {string} string      String to be truncated
 * @param  {number} [maxlen=80] Maximum number of chars
 * @return {string}             A truncated string of max 80 chars.
 *
 * @version  0.1.1
 * @since  0.1.0
 */
function truncate( string, maxlen ) {
  var maxlen = maxlen || options.columns
  var msglen = maxlen - 3

  if ( string.length > maxlen ){
    return string.substring( 0, msglen ) + '...';
  }
  else {
    return string;
  }
}

