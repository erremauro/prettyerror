jest.unmock( 'chalk' )
jest.unmock( 'cli-table' )
jest.unmock( 'cardinal' )
jest.unmock( 'marked' )
jest.unmock( 'node-emoji' )
jest.unmock( '../dist/lib/solidtext' )
jest.unmock( '../dist/lib/ttyrender' )
jest.unmock( '../dist/lib/solidrender' )

var colors = require( 'chalk' )
var SolidRender

describe( 'lib/solidrender', function () {
  describe( 'constructor', function () {
    beforeEach( function () {
      SolidRender = require( '../dist/lib/solidrender' )
    })

    it( 'should initialize props', function() {
      var solidRender = new SolidRender()
      expect( solidRender.marked ).toBeDefined()
      expect( solidRender.props ).toBeDefined()
    })

    it( 'should update props after initialization', function() {
      var solidRender = new SolidRender()
      var testProps = {
        columns: 60,
        wordwrap: false
      }
      solidRender.setProps( testProps )
      expect( solidRender.marked ).toBeDefined()
      expect( solidRender.props ).toBeDefined()
      expect( solidRender.props.columns ).toEqual( testProps.columns )
      expect( solidRender.props.wordwrap ).toEqual( testProps.wordwrap )
    })

  })

  describe( 'header', function () {
    beforeEach( function () {
      SolidRender = require( '../dist/lib/solidrender' )
    })

    it( 'should render header', function() {
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

    it( 'should render header without readableName', function() {
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
      SolidRender = require( '../dist/lib/solidrender' )
    })

    it( 'should render message', function() {
      var renderProps = { messageColor: 'reset', wordwrap: false }
      var solidRender = new SolidRender( renderProps )
      var TEXT = 'test'

      var actual = solidRender.message( TEXT )
      var expected = '\n' + colors.reset( TEXT ) + '\n'

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'explain', function () {
    beforeEach( function () {
      SolidRender = require( '../dist/lib/solidrender' )
    })

    it( 'should render explain', function() {
      var renderProps = {
        explain: 'reset',
        wordwrap: true,
        markdown: false
      }
      var solidRender = new SolidRender( renderProps )
      var TEXT = 'test'

      var expected = '\n' + colors.reset( TEXT )
      var actual = solidRender.explain( TEXT )

      expect( expected ).toEqual( actual )
    })

    it( 'should format markdown in explain section', function() {
      var renderProps = { markdown: true }
      var solidRender = new SolidRender( renderProps )
      var TEXT = 'bold text'
      var MD_TEXT = '**' + TEXT + '**'

      solidRender.marked = jest.fn()

      var expected = '\n' + colors.bold( TEXT ) + '\n'
      var actual = solidRender.explain( MD_TEXT )

      expect( solidRender.marked.mock.calls.length ).toEqual( 1 )
      expect( solidRender.marked.mock.calls[0][0] ).toEqual( MD_TEXT )
    })
  })

  describe( 'trace', function() {
    beforeEach( function () {
      SolidRender = require( '../dist/lib/solidrender' )
    })

    it( 'should format trace', function() {
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
      SolidRender = require( '../dist/lib/solidrender' )
    })

    it( 'should render hints', function() {
      var renderProps = {
        columns: 22,
        hintsColor: 'reset',
        hintsTitle: 'HINTS',
        markdown: false,
        wordwrap: false,
      }
      var solidRender = new SolidRender( renderProps )
      var TEXT = 'example text'
      var expected = 
        '\n' + colors.reset( '---- HINTS ----------' ) + '\n\n' + TEXT + '\n'
      var actual = solidRender.hints( TEXT )
      expect( expected ).toEqual( actual )
    })

    it( 'should format markdown in hints section', function() {
      var renderProps = {
        columns: 20,
        hintsColor: 'reset',
        hintsTitle: 'HINTS',
        markdown: true,
        wordwrap: false,
      }
      var solidRender = new SolidRender( renderProps )
      solidRender.marked = jest.fn()

      var TEXT = 'example text'
      var MD_TEXT = '_' + TEXT + '_'

      var actual = solidRender.hints( MD_TEXT )

      expect( solidRender.marked.mock.calls.length ).toEqual( 1 )
      expect( solidRender.marked.mock.calls[0][0] ).toEqual( MD_TEXT )
    })
  })

  describe( 'footer', function() {
    beforeEach( function () {
      SolidRender = require( '../dist/lib/solidrender' )
    })

    it( 'should render footer', function() {
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

    it( 'should format "footer" section without Path', function() {
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

    it( 'should render footer section wihout code', function() {
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
