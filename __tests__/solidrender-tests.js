jest.unmock( 'chalk' )
jest.unmock( 'marked' )
jest.unmock( 'cli-table' )
jest.unmock( 'cardinal' )
jest.unmock( 'node-emoji' )
jest.unmock( '../dist/class/SolidObject' )
jest.unmock( '../dist/lib/SolidText' )
jest.unmock( '../dist/class/TTYRender' )
jest.unmock( '../dist/class/SolidRender' )

var colors = require( 'chalk' )
var SolidRender = void 0

describe( 'lib/solidrender', function () {
  describe( 'constructor', function () {
    beforeEach( function () {
      SolidRender = require( '../dist/class/SolidRender' )
    })

    it( 'should initialize props', function () {
      var solidRender = new SolidRender()
      expect( solidRender.props ).toBeDefined()
    })

    it( 'should update props after initialization', function () {
      var solidRender = new SolidRender()
      var testProps = {
        columns: 60,
        wordwrap: false
      }
      solidRender.setProps( testProps )
      expect( solidRender.props ).toBeDefined()
      expect( solidRender.props.columns ).toEqual( testProps.columns )
      expect( solidRender.props.wordwrap ).toEqual( testProps.wordwrap )
    })

  })

  describe( 'header', function () {
    beforeEach( function () {
      SolidRender = require( '../dist/class/SolidRender' )
    })

    it( 'should render header', function () {
      var solidRender = new SolidRender()
      var TEXT = 'Test'
      solidRender.setProps({
        columns: 23,
        headerColor: 'cyan',
        wordwrap: true
      })
      var expected = '\n' + colors.cyan( '==== ERROR: Test =====' ) + '\n'
      var actual = solidRender.header( TEXT )
      expect( expected ).toEqual( actual )
    })

    it( 'should render header without readableName', function () {
      var solidRender = new SolidRender()
      solidRender.setProps({
        columns: 23,
        headerColor: 'cyan',
        wordwrap: true
      })
      var expected = '\n' + colors.cyan( '==== ERROR ===========' ) + '\n'
      var actual = solidRender.header( )
      expect( expected ).toEqual( actual )
    })
  })

  describe( 'message', function () {
    beforeEach( function () {
      SolidRender = require( '../dist/class/SolidRender' )
    })

    it( 'should render message', function () {
      var renderProps = { messageColor: 'reset', wordwrap: false }
      var solidRender = new SolidRender( renderProps )
      var TEXT = 'test'
      var EXPECTED_TEXT = 'Test'

      var actual = solidRender.message( TEXT )
      var expected = '\n' + colors.reset( EXPECTED_TEXT ) + '\n'

      expect( expected ).toEqual( actual )
    })

    it( 'should strip error codes from message', function () {
      var renderProps = { messageColor: 'reset', wordwrap: true }
      var solidRender = new SolidRender( renderProps )
      var TEXT = 'Error: ENOENT: no such file or directory.'
      var EXPECTED_TEXT = 'No such file or directory.'


      var actual = solidRender.message( TEXT )
      var expected = '\n' + colors.reset( EXPECTED_TEXT ) + '\n'

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'explain', function () {
    beforeEach( function () {
      SolidRender = require( '../dist/class/SolidRender' )
    })

    it( 'should render explain', function () {
      var renderProps = {
        explain: 'reset',
        wordwrap: true,
        markdown: false
      }
      var solidRender = new SolidRender( renderProps )
      var TEXT = 'test'
      var EXPECTED_TEXT = 'Test'

      var expected = '\n' + colors.reset( EXPECTED_TEXT )
      var actual = solidRender.explain( TEXT )

      expect( expected ).toEqual( actual )
    })

    it( 'should format markdown in explain section', function () {
      var renderProps = { markdown: true }
      var solidRender = new SolidRender( renderProps )
      var TEXT = 'bold text'
      var MD_TEXT = '**' + TEXT + '**'

      var expected = '\n' + colors.bold( TEXT ) + '\n'
      var actual = solidRender.explain( MD_TEXT )

      expect( expected).toEqual( actual )
    })
  })

  describe( 'trace', function () {
    beforeEach( function () {
      SolidRender = require( '../dist/class/SolidRender' )
    })

    it( 'should format trace', function () {
      var TEXT = 'Test'

      var renderProps = {
        columns: 22,
        traceColor: 'reset',
        traceTitle: 'STACKTRACE',
        wordwrap: false,
      }
      var solidRender = new SolidRender( renderProps )

      var expected = '\n' + colors.reset( '---- STACKTRACE -----' )
        + '\n\n' + TEXT
      var actual = solidRender.trace( TEXT )

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'hints', function () {
    beforeEach( function () {
      SolidRender = require( '../dist/class/SolidRender' )
    })

    it( 'should render hints', function () {
      var renderProps = {
        columns: 22,
        hintsColor: 'reset',
        hintsTitle: 'HINTS',
        markdown: false,
        wordwrap: false,
      }
      var solidRender = new SolidRender( renderProps )
      var TEXT = 'example text'
      var EXPECTED_TEXT = 'Example text'
      var expected =
        '\n' + colors.reset( '---- HINTS ----------' ) + '\n\n' + EXPECTED_TEXT + '\n'
      var actual = solidRender.hints( TEXT )
      expect( expected ).toEqual( actual )
    })

    it( 'should format markdown in hints section', function () {
      var renderProps = {
        columns: 22,
        hintsColor: 'reset',
        hintsTitle: 'HINTS',
        markdown: true,
        wordwrap: false,
      }
      var solidRender = new SolidRender( renderProps )

      var TEXT = 'example text'
      var MD_TEXT = '_' + TEXT + '_'

      var coloredDivider = colors.reset( '---- HINTS ----------' )
      var markdownContent = colors.italic( TEXT )
      var expected = `\n${coloredDivider}\n\n${markdownContent}\n`
      var actual = solidRender.hints( MD_TEXT )

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'footer', function () {
    beforeEach( function () {
      SolidRender = require( '../dist/class/SolidRender' )
    })

    it( 'should render footer', function () {
      var ECODE = 'ETEST'
      var EPATH = '/path/to/test'
      var renderProps = {
        columns: 22,
        footerColor: 'blue',
        markdown: false,
        wordwrap: true,
      }
      var solidRender = new SolidRender( renderProps )

      var DIVIDER = '---------------------'
      var expected = '\n' + colors.blue(
        DIVIDER + '\n'
        + 'Code: ' + ECODE + '\n'
        + 'Path: ' + EPATH
        + '\n' + DIVIDER
      ) + '\n'
      var actual = solidRender.footer( ECODE, EPATH )

      expect( expected ).toEqual( actual )
    })

    it( 'should format "footer" section without Path', function () {
      var ECODE = 'ETEST'
      var renderProps = {
        columns: 22,
        footerColor: 'blue',
        markdown: false,
        wordwrap: true,
      }
      var solidRender = new SolidRender( renderProps )

      var DIVIDER = '---------------------'
      var expected = '\n' + colors.blue(
        DIVIDER + '\n'
        + 'Code: ' + ECODE
        + '\n' + DIVIDER
      ) + '\n'

      var actual = solidRender.footer( ECODE, null )

      expect( expected ).toEqual( actual )
    })

    it( 'should render footer section wihout code', function () {
      var EPATH = '/path/to/test'
      var renderProps = {
        columns: 22,
        footerColor: 'blue',
        markdown: false,
        wordwrap: true,
      }
      var solidRender = new SolidRender( renderProps )

      var DIVIDER = '---------------------'
      var expected = '\n' + colors.blue(
        DIVIDER + '\n'
        + 'Path: ' + EPATH
        + '\n' + DIVIDER
      ) + '\n'

      var actual = solidRender.footer( null, EPATH )
      expect( expected ).toEqual( actual )
    })

    it( 'should return nothing if parameters are missing', function () {
      var renderProps = {
        columns: 22,
        footerColor: 'blue',
        markdown: false,
        wordwrap: true,
      }
      var solidRender = new SolidRender( renderProps )

      var actual = solidRender.footer( null, null )
      expect( '' ).toEqual( actual )
    })
  })
})
