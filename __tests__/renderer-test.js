jest.unmock( 'fs' )
jest.unmock( 'chalk' )
jest.unmock( 'marked' )
jest.unmock( 'cli-table' )
jest.unmock( 'cardinal' )
jest.unmock( 'node-emoji' )
jest.unmock( '../lib/wordwrap' )
jest.unmock( '../lib/renderer' )

var colors = require( 'chalk' )
var PrettyRenderer

describe( 'lib/renderer', function() {
  beforeEach( function() {
    PrettyRenderer = require( '../lib/renderer' )
  })

  it( 'should convert **strong** to bold', function() {
    var renderer = new PrettyRenderer({})
    var text = 'Test'
    var expected = colors.bold( text )
    var actual = renderer.strong( text )
    expect( expected ).toEqual( actual )
  })

  it( 'should convert <br /> to return', function() {
    var renderer = new PrettyRenderer({})
    var expected = '\r'
    var actual = renderer.br()
    expect( expected ).toEqual( actual )
  })

  it( 'should highlight javascript `code` blocks', function() {
    var renderer = new PrettyRenderer({})
    var code = 'function sayHello() {\n'
      + '    console.log( "Hello World!" );\n'
      + '};\n'
    var expected = '\n   \u001b[94mfunction\u001b[39m '
      + '\u001b[37msayHello\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)'
      + '\u001b[39m \u001b[33m{\u001b[39m\n       \u001b[34mconsole\u001b[39m'
      + '\u001b[32m.\u001b[39m\u001b[34mlog\u001b[39m\u001b[90m(\u001b[39m '
      + '\u001b[92m"Hello World!"\u001b[39m \u001b[90m)\u001b[39m\u001b[90m;'
      + '\u001b[39m\n   \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m\n   \n'
    var actual = renderer.code( code, 'javascript' )
    expect( expected ).toEqual( actual )
  })

  it( 'should convert non javascript `code` blocks to yellow text', function() {
    var renderer = new PrettyRenderer({})
    var text = 'def say_hello:\n'
      + '  put "Hello World"\n'
      + 'end\n'
    // takes colon substitution into account
    var expected = colors.yellow( 'def say_hello*#COLON|*\n'
      + '  put "Hello World"\n'
      + 'end\n' )
    var actual = renderer.codespan( text )
    expect( expected ).toEqual( actual )
  })

  it( 'should convert `codespan` to yellow text', function() {
    var renderer = new PrettyRenderer({})
    var text = 'Test'
    var expected = colors.yellow( text )
    var actual = renderer.codespan( text )
    expect( expected ).toEqual( actual )
  })

  it( 'should convert ~~del~~ to strikethrough text', function() {
    var renderer = new PrettyRenderer({ del: colors.strikethrough })
    var TEXT = 'Test'
    var expected = colors.strikethrough( TEXT )
    var actual = renderer.del( TEXT )
    expect( expected ).toEqual( actual )
  })

  it( 'should convert _em_ to italic', function() {
    var renderer = new PrettyRenderer({})
    var text = 'Test'
    var expected = colors.italic( text )
    var actual = renderer.em( text )
    expect( expected ).toEqual( actual )
  })

  // HEADINGS

  it( 'should convert first heading to blue bold text', function() {
    var renderer = new PrettyRenderer({})
      , LEVEL = 1
      , TEXT = 'Test'
      , RAW = '# ' + TEXT
    var expected = '\n' + colors.blue.bold( RAW ) + '\n'
    var actual = renderer.heading( TEXT, LEVEL, RAW )
    expect( expected ).toEqual( actual )
  })

  it( 'should convert other headings to green text', function() {
    var renderer = new PrettyRenderer({})
    var TEXT = 'Test'
    var prefix = '#'
    for ( var level = 2; level < 6; level++ ) {
      prefix += '#'
      var raw = prefix + ' ' + TEXT
      var expected = '\n' + colors.green( raw ) + '\n'
      var actual = renderer.heading( TEXT, level, raw )
      expect( expected ).toEqual( actual )
    }
  })

  it( 'should not wordwrap heading if specified', function() {
    var renderer = new PrettyRenderer( { wordwrap: false } )
    var HEADING_LENGTH = 120
    // create a TEXT of HEADING_LENGTH chars
    var TEXT = ( function() {
      var text = []
      for ( var i = 0; i < HEADING_LENGTH; i++ ) {
        text.push( 'a' )
      }
      return text.join('')
    })()
    var prefix = '#'
    var level = 1
    var raw = prefix + ' ' + TEXT
    var expected = '\n' + colors.blue.bold( raw ) + '\n'
    var actual = renderer.heading( TEXT, level, raw )
    expect( expected ).toEqual( actual )
    // Discard line-height and test head length. If wordwrap is disabled
    // the lenght of the heading should be greater than its actual length
    // given that terminal entities that renders blue and bold should be
    // added to the original string.
    expect( actual.split('\n')[1].length > raw.length ).toBeTruthy()
  })

  it( 'should convert --- and *** to a horizontal line', function() {
    var COLUMNS = 80
      , LINE_CHAR = '-'
      , renderer = new PrettyRenderer( { columns: COLUMNS } )
      , BRS = [ '---', '***' ]

    var expected = colors.reset(
      '\n' + new Array( COLUMNS ).join( LINE_CHAR ) + '\n' )

    BRS.forEach( function( line ) {
      var actual = renderer.hr( line )
      expect( expected ).toEqual( actual )
    })
  })

  it( 'should convert html to stylized text', function() {
    var TEXT = '<div id="app"><h1># Welcome to App</h1></div>'
    var renderer = new PrettyRenderer( { html: colors.gray } )

    var expected = colors.gray( TEXT )
    var actual = renderer.html( TEXT )

    expect( expected ).toEqual( actual )
  })

  it( 'should convert ![img](...) to blue text with title', function() {
    var HREF = 'http://www.example.com/image.png'
      , ALT_TEXT = 'alt-text'
      , TITLE = 'image title'
      , renderer = new PrettyRenderer( { link: colors.blue } )

    var expected = '\n' + colors.blue(
      '![' + ALT_TEXT + ' - ' + TITLE + '](' + HREF + ')' ) + '\n'
    var actual = renderer.image( HREF, TITLE, ALT_TEXT )

    expect( expected.length ).toEqual( actual.length )
  })

  it( 'should convert ![img](...) to blue text (no title)', function() {
    var HREF = 'http://www.example.com/image.png'
      , TITLE = null
      , ALT_TEXT = 'alt-text'
      , renderer = new PrettyRenderer( { link: colors.blue } )

    var expected = '\n' + colors.blue(
      '![' + ALT_TEXT + '](' + HREF + ')' ) + '\n'
    var actual = renderer.image( HREF, TITLE, ALT_TEXT )

    expect( expected.length ).toEqual( actual.length )
  })

  it( 'should render [link] to blue underlined text', function() {
    var HREF = 'http://www.google.com'
      , TITLE = 'Link'
      , TEXT = 'link'
      , renderer = new PrettyRenderer({emoji:false})

    var expected = colors.blue(
      TEXT + ' (' + colors.blue.underline( HREF ) + ')'
    )
    var actual = renderer.link( HREF, TITLE, TEXT )

    expect( expected ).toEqual( actual )
  })

  it( 'should remove javascript from link', function() {
    // eslint-disable-next-line
    var HREF = 'javascript:function(){ alert("Hello World"); };'
      , TITLE = 'Link'
      , TEXT = 'link'
      , renderer = new PrettyRenderer({emoji:false})

    var expected = ''
    var actual = renderer.link( HREF, TITLE, TEXT )

    expect( expected ).toEqual( actual )
  })

  it( 'should render an unordered list of items', function() {
    var IS_ORDERED = false
    var LIST_BODY = '\n * First'
      + '\n * Second'
      + '\n * Third'

    var renderer = new PrettyRenderer({ listitem: colors.reset })

    var expected = colors.reset( LIST_BODY )
    expected = '\n' + expected
      .split('\n')
      .map( function( line ) {
        return '    ' + line.trim()
      })
      .reduce( function( acc, line ) {
        return acc + line + '\n'
      }).trim() + '\n'
    var actual = renderer.list( LIST_BODY, IS_ORDERED )

    expect( expected ).toEqual( actual )
  })

  it( 'should render an ordered list of items', function() {
    var IS_ORDERED = true
    var LIST_BODY = '\n * First'
      + '\n * Second'
      + '\n * Third'
    var counter = 0
      , expected = ''

    var renderer = new PrettyRenderer({ listitem: colors.reset })

    expected = colors.reset( LIST_BODY )
    expected = '\n' + expected
      .split('\n')
      .map( function( line ) {
        if ( line.match( /\s\*\s/g ) ) { counter++ }
        return '    ' + line.replace( '*', counter + '.' ).trim()
      })
      .reduce( function( acc, line ) {
        return acc + line + '\n'
      }).trim() + '\n'
    var actual = renderer.list( LIST_BODY, IS_ORDERED )

    expect( expected ).toEqual( actual )
  })

  it( 'should convert a single list item', function() {
    var LIST_ITEM = 'Item'

    var renderer = new PrettyRenderer({ listitem: colors.reset })

    var expected = '\n * ' + LIST_ITEM
    var actual = renderer.listitem( LIST_ITEM )

    expect( expected ).toEqual( actual )
  })

  it( 'should format a tablecell', function() {
    var TABLE_CELL_SPLIT = '^*||*^'
    var CELL_TEXT = 'test'

    var renderer = new PrettyRenderer({})

    var expected = CELL_TEXT + TABLE_CELL_SPLIT
    var actual = renderer.tablecell( CELL_TEXT )

    expect( expected ).toEqual( actual )
  })

  it( 'should format a tablerow', function() {
    var TABLE_ROW_WRAP = '*|*|*|*'
    var CELL_TEXT = 'test'
    var renderer = new PrettyRenderer({})

    var expected = TABLE_ROW_WRAP + CELL_TEXT + TABLE_ROW_WRAP + '\n'
    var actual = renderer.tablerow( CELL_TEXT )

    expect( expected ).toEqual( actual )
  })

  it( 'should convert markdown table to cli-table', function() {
    var TABLE_CELL_SPLIT = '^*||*^'
    var TABLE_ROW_WRAP = '*|*|*|*'
    var HEADER = TABLE_ROW_WRAP + 'command' + TABLE_CELL_SPLIT
      + 'description' + TABLE_CELL_SPLIT + TABLE_ROW_WRAP + '\n'
    var BODY = TABLE_ROW_WRAP + 'ls -l' + TABLE_CELL_SPLIT
      + 'List all files' + TABLE_CELL_SPLIT + TABLE_ROW_WRAP + '\n'
    var renderer = new PrettyRenderer({})
    var expected = '\n\u001b[0m\u001b[90m┌─────────┬────────────────┐\u001b[39m'
      + '\n\u001b[90m│\u001b[39m\u001b[31m command \u001b[39m\u001b[90m│'
      + '\u001b[39m\u001b[31m description    \u001b[39m\u001b[90m│\u001b[39m'
      + '\n\u001b[90m├─────────┼────────────────┤\u001b[39m\n\u001b[90m│'
      + '\u001b[39m ls -l   \u001b[90m│\u001b[39m List all files \u001b[90m│'
      + '\u001b[39m\n\u001b[90m└─────────┴────────────────┘\u001b[39m\u001b[0m'
      + '\n'
    var actual = renderer.table( HEADER, BODY )
    expect( expected ).toEqual( actual )
  })

  it( 'should print emoji', function() {
    var renderer = new PrettyRenderer({})
    var TEXT = ':heart:'
    var EMOJI_CODES = [
      '\u2764\uFE0F',
      '\u2764',
      '\uE022',
      '\uDBBA\uDF0C',
    ]
    var actual = renderer.paragraph( TEXT )
    var found = false
    for( var i = 0; i < EMOJI_CODES.length; i++ ) {
      var emojiCode = EMOJI_CODES[ i ]
      if ( actual.indexOf( emojiCode ) !== -1 ) {
        found = true
        return
      }
    }
    expect( found ).toBeTruthy()
  })

  it( 'should skip non-emoji', function() {
    var renderer = new PrettyRenderer({ emoji: true })
    var TEXT = ':teststring:'
    var actual = renderer.paragraph( TEXT )
    expect( actual.indexOf( TEXT ) !== -1 ).toBeTruthy()
  })

  it( 'should not alter standard text', function() {
    var renderer = new PrettyRenderer({})
      , TEXT = 'test'
    var expected = TEXT
    var actual = renderer.text( TEXT )
    expect( expected ).toEqual( actual )
  })

  it( 'should wrap paragraphs to given columns', function() {
    var COLUMNS = 80
    var renderer = new PrettyRenderer( { columns: COLUMNS } )
    var longText = 'Lorem Ipsum is simply dummy text of the printing and '
      + 'typesetting industry. Lorem Ipsum has been the industry\'s standard '
      + 'dummy text ever since the 1500s, when an unknown printer took a '
      + 'galley of type and scrambled it to make a type specimen book. It has '
      + 'survived not only five centuries, but also the leap into electronic '
      + 'typesetting, remaining essentially unchanged. It was popularised in '
      + 'the 1960s with the release of Letraset sheets containing Lorem Ipsum '
      + 'passages, and more recently with desktop publishing software like '
      + 'Aldus PageMaker including versions of Lorem Ipsum.'
    renderer.paragraph( longText )
      .split('\n').forEach( function( item ) {
        expect( item.length <= COLUMNS ).toBeTruthy()
      })
  })


})

