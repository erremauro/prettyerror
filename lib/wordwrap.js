// HARD_RETURN holds a character sequence used to indicate text has a
// hard (no-wordwrapping) line break.  Previously \r and \r\n were turned
// into \n in marked's lexer- preprocessing step. So \r is safe to use
// to indicate a hard (non-wordwrapped) return.
var HARD_RETURN = '\r',
    HARD_RETURN_RE = new RegExp( HARD_RETURN ),
    HARD_RETURN_GFM_RE = new RegExp( HARD_RETURN + '|<br />' )

module.exports = wordwrap

//////////////

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

// Compute length of str not including ANSI escape codes.
// See http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
function textLength( str ) {
  return str.replace( /\u001b\[(?:\d{1,3})(?:;\d{1,3})*m/g, '' ).length
}
