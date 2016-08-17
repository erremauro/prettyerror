/**
 * @module lib/wordwrap
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.0
 * @since 0.2.0
 */

/**
 * @memberOf module:lib/wordwrap
 * @const {string}
 */
var HARD_RETURN = '\r'
/**
 * @memberOf module:lib/wordwrap
 * @const {RegEx}
 */
var HARD_RETURN_RE = new RegExp( HARD_RETURN )
/**
 * @memberOf module:lib/wordwrap
 * @const {RegEx}
 */
var HARD_RETURN_GFM_RE = new RegExp( HARD_RETURN + '|<br />' )

module.exports = wordwrap

//////////////

/**
 * @memberOf module:lib/wordwrap
 * @param  {string} text  Text to be wordwrapped
 * @param  {number} width Wordwrap columns width
 * @param  {boolean} gfm  Support GitHub Flavored Markdown
 * @return {string}       Wordwrapped text
 * @version 0.1.0
 * @since 0.1.0
 */
function wordwrap( text, width, gfm ) {
  // Hard break was inserted by Renderer.prototype.br or is
  // <br /> when gfm is true
  var splitRe = gfm ? HARD_RETURN_GFM_RE : HARD_RETURN_RE
    , sections = text.split( splitRe )
    , wordrapped = []
  var i, secLen = sections.length

  for ( i = 0; i < secLen; i++ ) {
    var section = sections[ i ]

    var words = section.split( /[ \t\n]+/ )
      , column = 0
      , nextText = ''
    var j, wordsLen = words.length

    for ( var j = 0; j < wordsLen; j++ ) {
      var word = words[ j ]
      var addOne = column !== 0;
      if ( ( column + textLength( word ) + addOne ) > width ) {
        nextText += '\n'
        column = 0;
      } else if ( addOne ) {
        nextText += ' '
        column += 1
      }
      nextText += word;
      column += textLength( word )
    }

    wordrapped.push( nextText )
  }

  return wordrapped.join( '\n' )
}

/**
 * Compute length of str not including ANSI escape codes.
 * @see http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
 * @param  {string} str The string from which calculate the length
 * @return {number}     Length of `string` not includi ANSI escape codes.
 * @version 0.1.0
 * @since 0.1.0
 */
function textLength( str ) {
  return str.replace( /\u001b\[(?:\d{1,3})(?:;\d{1,3})*m/g, '' ).length
}
