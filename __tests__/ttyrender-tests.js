jest.unmock( 'chalk' )
jest.unmock( 'cli-table' )
jest.unmock( 'cardinal' )
jest.unmock( 'node-emoji' )
jest.unmock( '../dist/lib/solidtext' )
jest.unmock( '../dist/lib/ttyrender' )

var colors = require( 'chalk' )
var TTYRender = null

describe( 'lib/ttyrender', function () {

  describe( 'constructor', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should initialize with props', function () {
      var testProps = {
        tables: false,
        columns: 70,
        wordwrap: false,
      }

      var ttyRender = new TTYRender( testProps )

      expect( testProps.tables ).toEqual( ttyRender.props.tables )
      expect( testProps.columns ).toEqual( ttyRender.props.columns )
      expect( testProps.wordwrap ).toEqual( ttyRender.props.wordwrap )      
    })
  })

  describe( 'setProps', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'it should set props', function () {
      var ttyRender = new TTYRender()

      var testProps = {
        tables: false,
        columns: 70,
      }

      ttyRender.setProps( testProps )

      expect( testProps.tables ).toEqual( ttyRender.props.tables )
      expect( testProps.columns ).toEqual( ttyRender.props.columns )
    })

  })

  describe( 'transform', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should compose function arguments', function() {
      var ttyRender = new TTYRender()
      var argText = 'TEST'
      var fn1 = jest.fn()
      var fn2 = jest.fn()

      var composeFn = ttyRender.compose( fn1, fn2 )
      expect( typeof composeFn ).toEqual( 'function' )

      composeFn( argText )

      expect( fn1.mock.calls.length ).toBe( 1 )
      expect( fn2.mock.calls.length ).toBe( 1 )
    })

    it( 'should have emojis function', function () {
      var ttyRender = new TTYRender()
      expect( typeof ttyRender.emojis ).toEqual( 'function' )
    })

    it( 'should restore colon from placeholder', function () {
      var ttyRender = new TTYRender()
      var TEXT = 'TEST*#COLON|*'
      var expected = 'TEST:'
      var actual = ttyRender.undoColon( TEXT )
      expect( expected ).toEqual( actual )

    })

    it( 'should unescape entities', function() {
      var ttyRender = new TTYRender() 
      var TEXT = '&quot;result&quot;: i &amp; j &lt;&gt; &#39;a&#39;'
      var expected = '"result": i & j <> \'a\''
      var actual = ttyRender.unescapeEntities( TEXT )
      expect( expected ).toEqual( actual )
    })

    it( 'it should apply default transformation to text', function () {
      var ttyRender = new TTYRender()
      var TEXT = '&quot;result&quot;*#COLON|* :heart:'
      var expected = '"result": '
      var expectedEmojiCode = 10084 // unicode entity decimal
      var actual = ttyRender.transform( TEXT )
      var actualEmojiCode = actual.codePointAt(10)

      var actualTextOnly = actual.substr( 0, actual.length -3 )

      expect( expected ).toEqual( actualTextOnly )
      expect( expectedEmojiCode ).toEqual( actualEmojiCode )
    })

  })

  describe( 'blockquote', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'it should convert ""> blockquote" to markdown', function () {
      var blockquote = colors.gray.italic
      var ttyRender = new TTYRender({
        blockquote: blockquote
      })
      var TEXT = 'Blockquote text'

      var expected = '\n' + blockquote( '   Blockquote text' ) + '\n'
      var actual = ttyRender.blockquote( TEXT )

      expect( expected ).toEqual( actual )
    })

  })

  describe( 'br', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should return an hard return (wordwrap: true)', function () {
      var ttyRender = new TTYRender({ wordwrap: true })
      var expected = '\r'
      var actual = ttyRender.br()
      expect( expected ).toEqual( actual )  
    })

    it( 'should return an soft return (wordwrap: false)', function () {
      var ttyRender = new TTYRender({ wordwrap: false })
      var expected = '\n'
      var actual = ttyRender.br()
      expect( expected ).toEqual( actual )  
    })

  })

  describe( 'code', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should highlight javascript `code` blocks', function() {
      var ttyRender = new TTYRender()
      var code = 'function sayHello() {\n'
        + '    console.log( "Hello World!" );\n'
        + '};\n'
      var expected = '\n   \u001b[94mfunction\u001b[39m '
        + '\u001b[37msayHello\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)'
        + '\u001b[39m \u001b[33m{\u001b[39m\n       \u001b[34mconsole\u001b[39m'
        + '\u001b[32m.\u001b[39m\u001b[34mlog\u001b[39m\u001b[90m(\u001b[39m '
        + '\u001b[92m"Hello World!"\u001b[39m \u001b[90m)\u001b[39m\u001b[90m;'
        + '\u001b[39m\n   \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m\n   \n'
      var actual = ttyRender.code( code, 'javascript' )
      expect( expected ).toEqual( actual )
    })
  })

  describe( 'codespan', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should convert non javascript `code` blocks to yellow text', function() {
      var codespan = colors.yellow
      var ttyRender = new TTYRender({ codespan: codespan })
      var text = 'def say_hello:\n'
        + '  put "Hello World"\n'
        + 'end\n'
      // takes colon substitution into account
      var expected = codespan( 'def say_hello*#COLON|*\n'
        + '  put "Hello World"\n'
        + 'end\n' )
      var actual = ttyRender.codespan( text )
      expect( expected ).toEqual( actual )
    })

    it( 'should convert `codespan` to yellow text', function() {
      var codespan = colors.yellow
      var ttyRender = new TTYRender({ codespan: codespan })
      var text = 'Test'
      var expected = codespan( text )
      var actual = ttyRender.codespan( text )
      expect( expected ).toEqual( actual )
    })
  })

  describe( 'del', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should convert ~~del~~ to strikethrough text', function() {
      var strikethrough = colors.dim.gray.strikethrough
      var ttyRender = new TTYRender({strikethrough: strikethrough})
      var TEXT = 'Test'
      var expected = strikethrough( TEXT )
      var actual = ttyRender.del( TEXT )
      expect( expected ).toEqual( actual )
    })

  })

  describe( 'em', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should convert _em_ to italic', function() {
      var em = colors.italic
      var ttyRender = new TTYRender({ em: em })
      var text = 'Test'
      var expected = em( text )
      var actual = ttyRender.em( text )
      expect( expected ).toEqual( actual )
    })

  })

  describe( 'heading', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should convert first heading to blue bold text', function() {
      var firstHeading = colors.blue.bold
      var ttyRender = new TTYRender({ firstHeading: firstHeading })
      var LEVEL = 1
      var TEXT = 'Test'
      var RAW = '# ' + TEXT
      var expected = '\n' + firstHeading( RAW ) + '\n'
      var actual = ttyRender.heading( TEXT, LEVEL )
      expect( expected ).toEqual( actual )
    })

    it( 'should convert other headings to green text', function() {
      var heading = colors.green
      var ttyRender = new TTYRender({ heading: heading })
      var TEXT = 'Test'
      var prefix = '#'
      for ( var level = 2; level < 6; level++ ) {
        prefix += '#'
        var raw = prefix + ' ' + TEXT
        var expected = '\n' + heading( raw ) + '\n'
        var actual = ttyRender.heading( TEXT, level, raw )
        expect( expected ).toEqual( actual )
      }
    })

    it( 'should not wordwrap heading if specified', function() {
      var ttyRender = new TTYRender( { wordwrap: false } )
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
      var expectedLength = raw.length

      var actual = ttyRender.heading( TEXT, level, raw )
      var actualLength = actual.split('\n')[1]
        .replace( /\u001b\[(?:\d{1,3})(?:;\d{1,3})*m/g, '' ).length

      expect( expected ).toEqual( actual )
      expect( expectedLength ).toEqual( actualLength )
    })
  })

  describe( 'hr', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should convert --- and *** to an horizontal line', function () {
      var COLUMNS = 80
      var LINE_CHAR = '-'
      var ttyRender = new TTYRender( { columns: COLUMNS, hr: colors.reset } )
      var BRS = [ '---', '***' ]

      var expected = '\n' + colors.reset(
        new Array( COLUMNS ).join( LINE_CHAR ) ) + '\n'

      BRS.forEach( function( line ) {
        var actual = ttyRender.hr( line )
        expect( expected ).toEqual( actual )
      })
    })

  })

  describe( 'html', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should convert html to stylized text', function() {
      var TEXT = '<div id="app"><h1># Welcome to App</h1></div>'
      var ttyRender = new TTYRender( { html: colors.gray } )

      var expected = colors.gray( TEXT )
      var actual = ttyRender.html( TEXT )

      expect( expected ).toEqual( actual )
    })

  })

  describe( 'image', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should convert ![img](...) to blue text with title', function() {
      var HREF = 'http://www.example.com/image.png'
      var ALT_TEXT = 'alt-text'
      var TITLE = 'image title'
      var ttyRender = new TTYRender( { link: colors.blue } )

      var expected = '\n' + colors.blue(
        '![' + ALT_TEXT + ' - ' + TITLE + '](' + HREF + ')' ) + '\n'
      var actual = ttyRender.image( HREF, TITLE, ALT_TEXT )

      expect( expected.length ).toEqual( actual.length )
    })

    it( 'should convert ![img](...) to blue text (no title)', function() {
      var HREF = 'http://www.example.com/image.png'
      var TITLE = null
      var ALT_TEXT = 'alt-text'
      var ttyRender = new TTYRender( { link: colors.blue } )

      var expected = '\n' + colors.blue(
        '![' + ALT_TEXT + '](' + HREF + ')' ) + '\n'
      var actual = ttyRender.image( HREF, TITLE, ALT_TEXT )

      expect( expected.length ).toEqual( actual.length )
    })

  })

  describe( 'link', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should render [link] to blue underlined text', function() {
      var HREF = 'http://www.google.com'
      var TITLE = 'Link'
      var TEXT = 'link'
      var ttyRender = new TTYRender({ emoji:false })

      var expected = colors.blue(
        TEXT + ' (' + colors.blue.underline( HREF ) + ')'
      )
      var actual = ttyRender.link( HREF, TITLE, TEXT )

      expect( expected ).toEqual( actual )
    })

    it( 'should remove javascript from link', function() {
      // eslint-disable-next-line
      var HREF = 'javascript:function(){ alert("Hello World"); };'
      var TITLE = 'Link'
      var TEXT = 'link'
      var ttyRender = new TTYRender({emoji:false})

      var expected = ''
      var actual = ttyRender.link( HREF, TITLE, TEXT )

      expect( expected ).toEqual( actual )
    })

  })

  describe( 'list', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should render an unordered list of items', function() {
      var IS_ORDERED = false
      var LIST_BODY = '\n * First'
        + '\n * Second'
        + '\n * Third'

      var ttyRender = new TTYRender({ listitem: colors.reset })

      var expected = colors.reset( LIST_BODY )
      expected = '\n' + expected
        .split('\n')
        .map( function( line ) {
          return '    ' + line.trim()
        })
        .reduce( function( acc, line ) {
          return acc + line + '\n'
        }).trim() + '\n'
      var actual = ttyRender.list( LIST_BODY, IS_ORDERED )

      expect( expected ).toEqual( actual )
    })

    it( 'should render an ordered list of items', function() {
      var IS_ORDERED = true
      var LIST_BODY = '\n * First'
        + '\n * Second'
        + '\n * Third'
      var counter = 0
        , expected = ''

      var ttyRender = new TTYRender({ listitem: colors.reset })

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
      var actual = ttyRender.list( LIST_BODY, IS_ORDERED )

      expect( expected ).toEqual( actual )
    })

    it( 'should convert a single list item', function() {
      var LIST_ITEM = 'Item'

      var ttyRender = new TTYRender({ listitem: colors.reset })

      var expected = '\n * ' + LIST_ITEM
      var actual = ttyRender.listitem( LIST_ITEM )

      expect( expected ).toEqual( actual )
    })

  })

  describe( 'table', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should format a tablecell', function() {
      var TABLE_CELL_SPLIT = '^*||*^'
      var CELL_TEXT = 'test'

      var ttyRender = new TTYRender({})

      var expected = CELL_TEXT + TABLE_CELL_SPLIT
      var actual = ttyRender.tablecell( CELL_TEXT )

      expect( expected ).toEqual( actual )
    })

    it( 'should format a tablerow', function() {
      var TABLE_ROW_WRAP = '*|*|*|*'
      var CELL_TEXT = 'test'
      var ttyRender = new TTYRender({})

      var expected = TABLE_ROW_WRAP + CELL_TEXT + TABLE_ROW_WRAP + '\n'
      var actual = ttyRender.tablerow( CELL_TEXT )

      expect( expected ).toEqual( actual )
    })

    it( 'should convert markdown table to cli-table', function() {
      var TABLE_CELL_SPLIT = '^*||*^'
      var TABLE_ROW_WRAP = '*|*|*|*'
      var HEADER = TABLE_ROW_WRAP + 'command' + TABLE_CELL_SPLIT
        + 'description' + TABLE_CELL_SPLIT + TABLE_ROW_WRAP + '\n'
      var BODY = TABLE_ROW_WRAP + 'ls -l' + TABLE_CELL_SPLIT
        + 'List all files' + TABLE_CELL_SPLIT + TABLE_ROW_WRAP + '\n'
      var ttyRender = new TTYRender({})
      var expected = '\n\u001b[0m\u001b[90m┌─────────┬────────────────┐\u001b[39m'
        + '\n\u001b[90m│\u001b[39m\u001b[31m command \u001b[39m\u001b[90m│'
        + '\u001b[39m\u001b[31m description    \u001b[39m\u001b[90m│\u001b[39m'
        + '\n\u001b[90m├─────────┼────────────────┤\u001b[39m\n\u001b[90m│'
        + '\u001b[39m ls -l   \u001b[90m│\u001b[39m List all files \u001b[90m│'
        + '\u001b[39m\n\u001b[90m└─────────┴────────────────┘\u001b[39m\u001b[0m'
        + '\n'
      var actual = ttyRender.table( HEADER, BODY )
      expect( expected ).toEqual( actual )
    })

  })

  describe( 'paragraph', function () {

    beforeEach( function () {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should wrap paragraphs to given columns', function() {
      var COLUMNS = 80
      var ttyRender = new TTYRender( { columns: COLUMNS } )
      var longText = 'Lorem Ipsum is simply dummy text of the printing and '
        + 'typesetting industry. Lorem Ipsum has been the industry\'s standard '
        + 'dummy text ever since the 1500s, when an unknown printer took a '
        + 'galley of type and scrambled it to make a type specimen book. It has '
        + 'survived not only five centuries, but also the leap into electronic '
        + 'typesetting, remaining essentially unchanged. It was popularised in '
        + 'the 1960s with the release of Letraset sheets containing Lorem Ipsum '
        + 'passages, and more recently with desktop publishing software like '
        + 'Aldus PageMaker including versions of Lorem Ipsum.'
      ttyRender.paragraph( longText )
        .split('\n').forEach( function( item ) {
          expect( item.length <= COLUMNS ).toBeTruthy()
        })
    })

  })
})
