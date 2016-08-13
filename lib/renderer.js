/**
 * @module  lib/prettyrender
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.0
 */

var colors = require( 'chalk' )
var Table = require('cli-table')
var cardinal = require( 'cardinal' )
var emoji = require('node-emoji')
var wordwrap = require( './wordwrap' )

var TABLE_CELL_SPLIT = '^*||*^';
var TABLE_ROW_WRAP = '*|*|*|*';
var TABLE_ROW_WRAP_REGEXP = new RegExp(escapeRegExp(TABLE_ROW_WRAP), 'g');

var COLON_REPLACER = '*#COLON|*'
var COLON_REPLACER_REGEXP = new RegExp(escapeRegExp(COLON_REPLACER), 'g')

var HARD_RETURN = '\r'

module.exports = PrettyRenderer

//////////////

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

function PrettyRenderer( props ) {
  this.props = Object.assign( {}, this.props, defaultProps )
  this.transform = compose( undoColon, unescapeEntities, insertEmojis )
  this.emoji = insertEmojis
  this.highlightOptions = {}
}

function fixHardReturn( text, wordwrapped ) {
  return wordwrapped ? text.replace( HARD_RETURN, /\n/g ) : text
}

PrettyRenderer.prototype.blockquote = function( quote ) {
  return '\n' + this.props.blockquote( indentify( quote.trim() ) ) + '\n'
}

PrettyRenderer.prototype.br = function( text ) {
  return this.props.wordwrap ? HARD_RETURN : '\n'
}

PrettyRenderer.prototype.code = function( code, lang ) {
  return '\n' + indentify(
    highlight( code, lang, this.props, this.highlightOptions ) ) + '\n'
}

PrettyRenderer.prototype.codespan = function( text ) {
  text = fixHardReturn( text, this.props.wordwrap )
  return this.props.codespan( text.replace( /:/g, COLON_REPLACER ) )
}

PrettyRenderer.prototype.del = function( text ) {
  return this.props.del( text )
}

PrettyRenderer.prototype.em = function( text ) {
  text = fixHardReturn( text, this.props.wordwrap )
  return this.props.em( text )
}

PrettyRenderer.prototype.heading = function( text, level, raw ) {
  text = this.transform( text )
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

PrettyRenderer.prototype.hr = function( text ) {
  return this.props.hr(
    hr( '-', this.props.wordwrap && this.props.columns ) ) + '\n'
}

PrettyRenderer.prototype.html = function( text ) {
  return this.props.html( text )
}

PrettyRenderer.prototype.image = function( href, title, text ) {
  var out = '![' + text
  out += title ? ' – ' + title : ''
  return this.props.link( out + '](' + href + ')\n' )
}

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
  out += hasText ? this.emoji( text ) + ' (' : ''
  out +=  this.props.href( href )
  out += hasText ? ')' : ''
  return this.props.link( out )
}

PrettyRenderer.prototype.list = function( body, ordered ) {
  body = indentLines( this.props.listitem( body ) )
  if ( !ordered ) {
    return formatUnordered( body )
  }
  return changeToOrdered( body )
}

PrettyRenderer.prototype.listitem = function( text ) {
  var isNested = ~text.indexOf( '\n' ) // eslint-disable-line
  if ( isNested ) {
    text = text.trim()
  }
  return '\n * ' + this.transform( text )
}

PrettyRenderer.prototype.paragraph = function( text ) {
  text = this.transform( text )
  text = wordwrap( text, this.props.columns, this.props.gfm )
  return '\n' + text + '\n'
}

PrettyRenderer.prototype.strong = function( text ) {
  return this.props.strong( text )
}

PrettyRenderer.prototype.table = function(header, body) {
  var table = new Table(Object.assign({}, {
      head: generateTableRow( header )[0]
  }, this.tableSettings ) )

  generateTableRow( body, this.transform ).forEach( function (row) {
    table.push( row )
  })
  return '\n' + this.props.table( table.toString() ) + '\n'
}

PrettyRenderer.prototype.tablerow = function(content) {
  return TABLE_ROW_WRAP + content + TABLE_ROW_WRAP + '\n';
}

PrettyRenderer.prototype.tablecell = function(content, flags) {
  return content + TABLE_CELL_SPLIT;
}

PrettyRenderer.prototype.text = function( text ) {
  return text
}

function changeToOrdered( text ) {
  var i = 1;
  return '\n' + text.split( '\n' ).reduce( function ( acc, line ) {
    if ( !line ) { return '\n' + acc }
    return acc + line.replace( /(\s*)\*/, '$1' + ( i++ ) + '.' ) + '\n'
  }).trim() + '\n' // remove last carriage return
}

function formatUnordered( text ) {
  return '\n' + text.split( '\n' ).reduce( function ( acc, line ) {
    if ( !line ) { return '\n' + acc }
    return acc + line + '\n'
  }).trim() + '\n' // remove last carriage return
}

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

// TODO: Add support <hr /> tags
function hr( inputHrStr, length ) {
  length = length || process.stdout.columns;
  return ( new Array( length ) ).join( inputHrStr )
}

function tab( size ) {
  size = size || 4;
  return ( new Array( size ) ).join( ' ' )
}

function indentLines( text ) {
  return text.replace( /\n/g, '\n' + tab() ) + '\n\n'
}

function indentify( text ) {
  if ( !text ) { return text }
  return tab() + text.split( '\n' ).join( '\n' + tab() )
}

function insertEmojis( text ) {
  return text.replace( /:([A-Za-z0-9_\-\+]+?):/g, function ( emojiString ) {
    var emojiSign = emoji.get( emojiString )
    if ( !emojiSign ) { return emojiString }
    // TODO: emojis are still stacked when printed
    return emojiSign + ' '
  })
}

function undoColon (str) {
  return str.replace( COLON_REPLACER_REGEXP, ':')
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

function generateTableRow( text, escape ) {
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

function identity( str ) {
  return str
}

function unescapeEntities( html ) {
  return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'") // eslint-disable-line
}

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
