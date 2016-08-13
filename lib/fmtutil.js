/**
 * @module lib/fmtutil
 * @author  Roberto Mauro <erremauor@icloud.com>
 * @version 0.1.0
 * @since  0.2.0
 */

/**
 * Maximum allowed chars per line
 * @const
 * @type {number}
 */
var MAX_CHARS = 80

var colors = require( 'chalk' )
var wordwrap = require( './wordwrap' )
var marked = require( 'marked' )
var renderer = require( './renderer' )

marked.setOptions({
  renderer: new renderer(),
  sanitize: true,
  tables: true,
  gfm: true,
  breaks: false,
})

module.exports = {
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
 * Format PrettyError's description message.
 * @name module:lib/fmtutil.format.describe
 * @memberOf module:lib/fmtutil.format
 * @function
 * @param  {string} errDesc An error description
 * @return {string}         Formatted description
 * @version  0.1.0
 * @since  0.1.0
 */
function fmtDescribe( errDesc ) {
  return colors.yellow( '\n' + wordwrap( errDesc, MAX_CHARS, false ) + '\n' )
}

/**
 * Format PrettyError's explanation message.
 * @name module:lib/fmtutil.format.explain
 * @memberOf module:lib/fmtutil.format
 * @function
 * @param  {string} errExplain  An error explanation
 * @return {string}             Formatted explanation
 * @version  0.1.0
 * @since  0.1.0
 */
function fmtExplain( errExplain ) {
  return '\n' + wordwrap( errExplain, MAX_CHARS, false ) + '\n'
}

/**
 * Format PrettyError's example message.
 * @name module:lib/fmtutil.format.example
 * @memberOf module:lib/fmtutil.format
 * @function
 * @param  {string} errHint     An example or a hint about the error
 * @return {string}             Formatted example
 * @version  0.1.0
 * @since  0.1.0
 */
function fmtExample( errHint ) {
  var fmt = getDivider( 'EXAMPLE' ) + '\n'
  fmt += marked( errHint )
  //fmt += wordwrap( errHint, MAX_CHARS, false )
  return fmt + '\n'
}

/**
 * Format PrettyError's footer message.
 * @name module:lib/fmtutil.format.footer
 * @memberOf module:lib/fmtutil.format
 * @function
 * @param  {string} errcode     Error code
 * @param  {string} errpath     Error's path property value
 * @return {string}             Formatted footer
 * @version  0.1.0
 * @since  0.1.0
 */
function fmtFooter( errcode, errpath ) {
  if ( !errcode && !errpath )  { return '' }

  var fmt = '\n' + getDivider()
  if ( errcode ) {
    fmt += 'Code:\t' + errcode + '\n'
  }
  if ( errpath ) {
    fmt += 'Path:\t' + errpath + '\n'
  }
  return colors.blue( fmt + getDivider() )
}

/**
 * Format PrettyError's header message.
 * @name module:lib/fmtutil.format.header
 * @memberOf module:lib/fmtutil.format
 * @function
 * @param  {string} errHeader   Error message
 * @return {string}             Formatted header
 * @version  0.1.0
 * @since  0.1.0
 */
function fmtHeader( errHeader ) {
  var prefix = '\n==== ERROR: '
  var suffix = ' ===='
  var minLen = prefix.length + suffix.length

  var fmt = prefix
  fmt += truncate( errHeader, ( MAX_CHARS - minLen ) )
  fmt += suffix

  while( fmt.length < MAX_CHARS ) {
    fmt += '='
  }

  fmt += '\n'

  return colors.cyan( fmt )
}

/**
 * Format PrettyError's stack trace.
 * @name module:lib/fmtutil.format.trace
 * @memberOf module:lib/fmtutil.format
 * @function
 * @param  {string} errStack    Error stack
 * @return {string}             Formatted stack trace
 * @version  0.1.0
 * @since  0.1.0
 */
function fmtTrace( errStack ) {
  var fmt = getDivider( 'INNER ERROR' )
  fmt += '\n' + wordwrap( errStack, MAX_CHARS, false ) + '\n'
  return fmt
}

/**
 * Return a divider with an optional title
 * @memberOf module:lib/fmtutil
 * @param  {string} [title] A title for the divider.
 * @returns {string}        A divider with an optional title.
 */
function getDivider( title ) {
  var divider = title ? '\n---- ' + title + ' ' : ''
  var len = MAX_CHARS - divider.length

  for ( var i = 0; i < len; i++ ) {
    divider += '-'
  }
  return divider + '\n'
}

/**
 * Truncate a string at `maxlen` and ellipsis at the end.
 * @memberOf module:lib/fmtutil
 * @param  {string} string      String to be truncated
 * @param  {number} [maxlen=80] Maximum number of chars
 * @return {string}             A truncated string of max 80 chars.
 * @version  0.1.0
 * @since  0.1.0
 */
function truncate( string, maxlen ) {
  var maxlen = maxlen || MAX_CHARS
  var msglen = maxlen - 3

  if ( string.length > maxlen ){
    return string.substring( 0, msglen ) + '...';
  }
  else {
    return string;
  }
}

