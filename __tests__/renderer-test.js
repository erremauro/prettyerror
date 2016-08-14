/* eslint no-undef: 'off' */
jest.unmock( 'fs' )
jest.unmock( 'chalk' )
jest.unmock( 'marked' )
jest.unmock( 'cli-table' )
jest.unmock( 'cardinal' )
jest.unmock( 'node-emoji' )
jest.unmock( '../lib/wordwrap' )
jest.unmock( '../lib/renderer' )

var fs = require( 'fs' )

var markdownText
  , marked
  , PrettyRenderer
  , colors

describe( 'lib/renderer', function() {
  beforeEach( function() {
    colors = require( 'chalk' )
    //markdownText = fs.readFileSync( './__tests__/support/test.md' ).toString()
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
    console.log({e:expected,a:actual})
    expect( expected ).toEqual( actual )
  })

  it( 'should convert _em_ to italic', function() {
    var renderer = new PrettyRenderer({})
    var text = 'Test'
    var expected = colors.italic( text )
    var actual = renderer.em( text )
    expect( expected ).toEqual( actual )
  })

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

  it( 'should not alter standard text', function() {
    var renderer = new PrettyRenderer({})
      , TEXT = 'test'
    var expected = TEXT
    var actual = renderer.text( TEXT )
    expect( expected ).toEqual( actual )
  })

  it( 'should render [link] to blue underlined text', function() {
    var renderer = new PrettyRenderer({emoji:false})
      , HREF = 'http://www.google.com'
      , TITLE = 'Link'
      , TEXT = 'link'
    var expected = colors.blue( TEXT + ' ('
      + colors.blue.underline( HREF ) + ')' )
    var actual = renderer.link( HREF, TITLE, TEXT )
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

