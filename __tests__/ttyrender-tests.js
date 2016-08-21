jest.unmock( 'chalk' )
jest.unmock( 'marked' )
jest.unmock( 'cli-table' )
jest.unmock( 'cardinal' )
jest.unmock( 'node-emoji' )
jest.unmock( '../dist/lib/solidtext' )
jest.unmock( '../dist/lib/ttyrender' )

const colors = require( 'chalk' )
let TTYRender = null

describe( 'lib/ttyrender', () => {

  describe( 'constructor', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should initialize with props', () => {
      const testProps = {
        tables: false,
        columns: 70,
        wordwrap: false,
      }

      const ttyRender = new TTYRender( testProps )

      expect( testProps.tables ).toEqual( ttyRender.props.tables )
      expect( testProps.columns ).toEqual( ttyRender.props.columns )
      expect( testProps.wordwrap ).toEqual( ttyRender.props.wordwrap )
    })
  })

  describe( 'setProps', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'it should set props', () => {
      const ttyRender = new TTYRender()

      const testProps = {
        tables: false,
        columns: 70,
      }

      ttyRender.setProps( testProps )

      expect( testProps.tables ).toEqual( ttyRender.props.tables )
      expect( testProps.columns ).toEqual( ttyRender.props.columns )
    })

  })

  describe( 'transform', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should compose function arguments', () => {
      const ttyRender = new TTYRender()
      const argText = 'TEST'
      const fn1 = jest.fn()
      const fn2 = jest.fn()

      const composeFn = ttyRender.compose( fn1, fn2 )
      expect( typeof composeFn ).toEqual( 'function' )

      composeFn( argText )

      expect( fn1.mock.calls.length ).toBe( 1 )
      expect( fn2.mock.calls.length ).toBe( 1 )
    })

    it( 'should have emojis function', () => {
      const ttyRender = new TTYRender()
      expect( typeof ttyRender.emojis ).toEqual( 'function' )
    })

    it( 'should restore colon from placeholder', () => {
      const ttyRender = new TTYRender()
      const TEXT = 'TEST*#COLON|*'
      const expected = 'TEST:'
      const actual = ttyRender.undoColon( TEXT )
      expect( expected ).toEqual( actual )

    })

    it( 'should unescape entities', () => {
      const ttyRender = new TTYRender()
      const TEXT = '&quot;result&quot;: i &amp; j &lt;&gt; &#39;a&#39;'
      const expected = '"result": i & j <> \'a\''
      const actual = ttyRender.unescapeEntities( TEXT )
      expect( expected ).toEqual( actual )
    })

    it( 'it should apply default transformation to text', () => {
      const ttyRender = new TTYRender()
      const TEXT = '&quot;result&quot;*#COLON|* :heart:'
      const expected = '"result": '
      const expectedEmojiCode = 10084 // unicode entity decimal
      const actual = ttyRender.transform( TEXT )
      const actualEmojiCode = actual.codePointAt(10)

      const actualTextOnly = actual.substr( 0, actual.length -3 )

      expect( expected ).toEqual( actualTextOnly )
      expect( expectedEmojiCode ).toEqual( actualEmojiCode )
    })

  })

  describe( 'blockquote', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'it should convert ""> blockquote" to markdown', () => {
      const blockquote = colors.gray.italic
      const ttyRender = new TTYRender({ blockquote })
      const TEXT = 'Blockquote text'

      const expected = '\n' + blockquote( '   Blockquote text' ) + '\n'
      const actual = ttyRender.blockquote( TEXT )

      expect( expected ).toEqual( actual )
    })

  })

  describe( 'br', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should return an hard return (wordwrap: true)', () => {
      const ttyRender = new TTYRender({ wordwrap: true })
      const expected = '\r'
      const actual = ttyRender.br()
      expect( expected ).toEqual( actual )
    })

    it( 'should return an soft return (wordwrap: false)', () => {
      const ttyRender = new TTYRender({ wordwrap: false })
      const expected = '\n'
      const actual = ttyRender.br()
      expect( expected ).toEqual( actual )
    })

  })

  describe( 'code', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should highlight javascript `code` blocks', () => {
      const ttyRender = new TTYRender()
      const code = 'function sayHello() {\n'
        + '    console.log( "Hello World!" );\n'
        + '};\n'
      const expected = '\n   \u001b[94mfunction\u001b[39m '
        + '\u001b[37msayHello\u001b[39m\u001b[90m(\u001b[39m\u001b[90m)'
        + '\u001b[39m \u001b[33m{\u001b[39m\n       \u001b[34mconsole\u001b[39m'
        + '\u001b[32m.\u001b[39m\u001b[34mlog\u001b[39m\u001b[90m(\u001b[39m '
        + '\u001b[92m"Hello World!"\u001b[39m \u001b[90m)\u001b[39m\u001b[90m;'
        + '\u001b[39m\n   \u001b[33m}\u001b[39m\u001b[90m;\u001b[39m\n   \n'
      const actual = ttyRender.code( code, 'javascript' )
      expect( expected ).toEqual( actual )
    })
  })

  describe( 'codespan', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should convert non javascript `code` blocks to yellow text', () => {
      const codespan = colors.yellow
      const ttyRender = new TTYRender( { codespan } )
      const text = 'def say_hello:\n'
        + '  put "Hello World"\n'
        + 'end\n'
      // takes colon substitution into account
      const expected = codespan( 'def say_hello*#COLON|*\n'
        + '  put "Hello World"\n'
        + 'end\n' )
      const actual = ttyRender.codespan( text )
      expect( expected ).toEqual( actual )
    })

    it( 'should convert `codespan` to yellow text', () => {
      const codespan = colors.yellow
      const ttyRender = new TTYRender( { codespan } )
      const text = 'Test'
      const expected = codespan( text )
      const actual = ttyRender.codespan( text )
      expect( expected ).toEqual( actual )
    })
  })

  describe( 'del', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should convert ~~del~~ to strikethrough text', () => {
      const strikethrough = colors.dim.gray.strikethrough
      const ttyRender = new TTYRender( { strikethrough } )
      const TEXT = 'Test'
      const expected = strikethrough( TEXT )
      const actual = ttyRender.del( TEXT )
      expect( expected ).toEqual( actual )
    })

  })

  describe( 'em', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should convert _em_ to italic', () => {
      const em = colors.italic
      const ttyRender = new TTYRender( { em } )
      const text = 'Test'
      const expected = em( text )
      const actual = ttyRender.em( text )
      expect( expected ).toEqual( actual )
    })

  })

  describe( 'heading', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should convert first heading to blue bold text', () => {
      const firstHeading = colors.blue.bold
      const ttyRender = new TTYRender( { firstHeading } )
      const LEVEL = 1
      const TEXT = 'Test'
      const RAW = '# ' + TEXT
      const expected = '\n' + firstHeading( RAW ) + '\n'
      const actual = ttyRender.heading( TEXT, LEVEL )
      expect( expected ).toEqual( actual )
    })

    it( 'should convert other headings to green text', () => {
      const heading = colors.green
      const ttyRender = new TTYRender( { heading } )
      const TEXT = 'Test'
      let prefix = '#'
      for ( let level = 2; level < 6; level++ ) {
        prefix += '#'
        const raw = prefix + ' ' + TEXT
        const expected = '\n' + heading( raw ) + '\n'
        const actual = ttyRender.heading( TEXT, level, raw )
        expect( expected ).toEqual( actual )
      }
    })

    it( 'should not wordwrap heading if specified', () => {
      const ttyRender = new TTYRender( { wordwrap: false } )
      const HEADING_LENGTH = 120
      // create a TEXT of HEADING_LENGTH chars
      const TEXT = ( () => {
        const text = []
        for ( let i = 0; i < HEADING_LENGTH; i++ ) {
          text.push( 'a' )
        }
        return text.join('')
      })()
      const prefix = '#'
      const level = 1
      const raw = prefix + ' ' + TEXT

      const expected = '\n' + colors.blue.bold( raw ) + '\n'
      const expectedLength = raw.length

      const actual = ttyRender.heading( TEXT, level, raw )
      const actualLength = actual.split('\n')[1]
        .replace( /\u001b\[(?:\d{1,3})(?:;\d{1,3})*m/g, '' ).length

      expect( expected ).toEqual( actual )
      expect( expectedLength ).toEqual( actualLength )
    })
  })

  describe( 'hr', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should convert --- and *** to an horizontal line', () => {
      const COLUMNS = 80
      const LINE_CHAR = '-'
      const ttyRender = new TTYRender( { columns: COLUMNS, hr: colors.reset } )
      const BRS = [ '---', '***' ]

      const expected = '\n' + colors.reset(
        new Array( COLUMNS ).join( LINE_CHAR ) ) + '\n'

      BRS.forEach( line => {
        const actual = ttyRender.hr( line )
        expect( expected ).toEqual( actual )
      })
    })

  })

  describe( 'html', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should convert html to stylized text', () => {
      const TEXT = '<div id="app"><h1># Welcome to App</h1></div>'
      const ttyRender = new TTYRender( { html: colors.gray } )

      const expected = colors.gray( TEXT )
      const actual = ttyRender.html( TEXT )

      expect( expected ).toEqual( actual )
    })

  })

  describe( 'image', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should convert ![img](...) to blue text with title', () => {
      const HREF = 'http://www.example.com/image.png'
      const ALT_TEXT = 'alt-text'
      const TITLE = 'image title'
      const ttyRender = new TTYRender( { link: colors.blue } )

      const expected = '\n' + colors.blue(
        '![' + ALT_TEXT + ' - ' + TITLE + '](' + HREF + ')' ) + '\n'
      const actual = ttyRender.image( HREF, TITLE, ALT_TEXT )

      expect( expected.length ).toEqual( actual.length )
    })

    it( 'should convert ![img](...) to blue text (no title)', () => {
      const HREF = 'http://www.example.com/image.png'
      const TITLE = null
      const ALT_TEXT = 'alt-text'
      const ttyRender = new TTYRender( { link: colors.blue } )

      const expected = '\n' + colors.blue(
        '![' + ALT_TEXT + '](' + HREF + ')' ) + '\n'
      const actual = ttyRender.image( HREF, TITLE, ALT_TEXT )

      expect( expected.length ).toEqual( actual.length )
    })

  })

  describe( 'link', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should render [link] to blue underlined text', () => {
      const HREF = 'http://www.google.com'
      const TITLE = 'Link'
      const TEXT = 'link'
      const ttyRender = new TTYRender({ emoji:false })

      const expected = colors.blue(
        TEXT + ' (' + colors.blue.underline( HREF ) + ')'
      )
      const actual = ttyRender.link( HREF, TITLE, TEXT )

      expect( expected ).toEqual( actual )
    })

    it( 'should remove javascript from link', () => {
      // eslint-disable-next-line
      const HREF = 'javascript:() =>{ alert("Hello World"); };'
      const TITLE = 'Link'
      const TEXT = 'link'
      const ttyRender = new TTYRender({emoji:false})

      const expected = ''
      const actual = ttyRender.link( HREF, TITLE, TEXT )

      expect( expected ).toEqual( actual )
    })

  })

  describe( 'list', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should render an unordered list of items', () => {
      const IS_ORDERED = false
      const LIST_BODY = '\n * First'
        + '\n * Second'
        + '\n * Third'

      const ttyRender = new TTYRender({ listitem: colors.reset })

      let expected = colors.reset( LIST_BODY )
      expected = '\n' + expected
        .split('\n')
        .map( line => '    ' + line.trim() )
        .reduce( ( acc, line ) => acc + line + '\n' )
        .trim() + '\n'
      const actual = ttyRender.list( LIST_BODY, IS_ORDERED )

      expect( expected ).toEqual( actual )
    })

    it( 'should render an ordered list of items', () => {
      const IS_ORDERED = true
      const LIST_BODY = '\n * First'
        + '\n * Second'
        + '\n * Third'
      let counter = 0
        , expected = ''

      const ttyRender = new TTYRender({ listitem: colors.reset })

      expected = colors.reset( LIST_BODY )
      expected = '\n' + expected
        .split('\n')
        .map( line => {
          if ( line.match( /\s\*\s/g ) ) { counter++ }
          return '    ' + line.replace( '*', counter + '.' ).trim()
        })
        .reduce( ( acc, line ) => acc + line + '\n' )
        .trim() + '\n'
      const actual = ttyRender.list( LIST_BODY, IS_ORDERED )

      expect( expected ).toEqual( actual )
    })

    it( 'should convert a single list item', () => {
      const LIST_ITEM = 'Item'

      const ttyRender = new TTYRender({ listitem: colors.reset })

      const expected = '\n * ' + LIST_ITEM
      const actual = ttyRender.listitem( LIST_ITEM )

      expect( expected ).toEqual( actual )
    })

  })

  describe( 'table', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should format a tablecell', () => {
      const TABLE_CELL_SPLIT = '^*||*^'
      const CELL_TEXT = 'test'

      const ttyRender = new TTYRender({})

      const expected = CELL_TEXT + TABLE_CELL_SPLIT
      const actual = ttyRender.tablecell( CELL_TEXT )

      expect( expected ).toEqual( actual )
    })

    it( 'should format a tablerow', () => {
      const TABLE_ROW_WRAP = '*|*|*|*'
      const CELL_TEXT = 'test'
      const ttyRender = new TTYRender({})

      const expected = TABLE_ROW_WRAP + CELL_TEXT + TABLE_ROW_WRAP + '\n'
      const actual = ttyRender.tablerow( CELL_TEXT )

      expect( expected ).toEqual( actual )
    })

    it( 'should convert markdown table to cli-table', () => {
      const TABLE_CELL_SPLIT = '^*||*^'
      const TABLE_ROW_WRAP = '*|*|*|*'
      const HEADER = TABLE_ROW_WRAP + 'command' + TABLE_CELL_SPLIT
        + 'description' + TABLE_CELL_SPLIT + TABLE_ROW_WRAP + '\n'
      const BODY = TABLE_ROW_WRAP + 'ls -l' + TABLE_CELL_SPLIT
        + 'List all files' + TABLE_CELL_SPLIT + TABLE_ROW_WRAP + '\n'
      const ttyRender = new TTYRender({})
      const expected = '\n\u001b[0m\u001b[90m┌─────────┬────────────────┐\u001b[39m'
        + '\n\u001b[90m│\u001b[39m\u001b[31m command \u001b[39m\u001b[90m│'
        + '\u001b[39m\u001b[31m description    \u001b[39m\u001b[90m│\u001b[39m'
        + '\n\u001b[90m├─────────┼────────────────┤\u001b[39m\n\u001b[90m│'
        + '\u001b[39m ls -l   \u001b[90m│\u001b[39m List all files \u001b[90m│'
        + '\u001b[39m\n\u001b[90m└─────────┴────────────────┘\u001b[39m\u001b[0m'
        + '\n'
      const actual = ttyRender.table( HEADER, BODY )
      expect( expected ).toEqual( actual )
    })

  })

  describe( 'paragraph', () => {

    beforeEach( () => {
      TTYRender = require( '../dist/lib/ttyrender' )
    })

    it( 'should wrap paragraphs to given columns', () => {
      const COLUMNS = 80
      const ttyRender = new TTYRender( { columns: COLUMNS } )
      const longText = 'Lorem Ipsum is simply dummy text of the printing and '
        + 'typesetting industry. Lorem Ipsum has been the industry\'s standard '
        + 'dummy text ever since the 1500s, when an unknown printer took a '
        + 'galley of type and scrambled it to make a type specimen book. It has '
        + 'survived not only five centuries, but also the leap into electronic '
        + 'typesetting, remaining essentially unchanged. It was popularised in '
        + 'the 1960s with the release of Letraset sheets containing Lorem Ipsum '
        + 'passages, and more recently with desktop publishing software like '
        + 'Aldus PageMaker including versions of Lorem Ipsum.'
      ttyRender.paragraph( longText )
        .split('\n').forEach( item => {
          expect( item.length <= COLUMNS ).toBeTruthy()
        })
    })

  })
})
