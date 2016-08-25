jest.unmock( 'chalk' )
jest.unmock( 'marked' )
jest.unmock( 'cli-table' )
jest.unmock( 'cardinal' )
jest.unmock( 'node-emoji' )
jest.unmock( '../dist/class/SolidObject' )
jest.unmock( '../dist/lib/SolidText' )
jest.unmock( '../dist/class/TTYRender' )
jest.unmock( '../dist/class/SolidRender' )

const colors = require( 'chalk' )
let SolidRender

describe( 'lib/solidrender', () => {
  describe( 'constructor', () => {
    beforeEach( () => {
      SolidRender = require( '../dist/class/SolidRender' )
    })

    it( 'should initialize props', () => {
      const solidRender = new SolidRender()
      expect( solidRender.props ).toBeDefined()
    })

    it( 'should update props after initialization', () => {
      const solidRender = new SolidRender()
      const testProps = {
        columns: 60,
        wordwrap: false
      }
      solidRender.setProps( testProps )
      expect( solidRender.props ).toBeDefined()
      expect( solidRender.props.columns ).toEqual( testProps.columns )
      expect( solidRender.props.wordwrap ).toEqual( testProps.wordwrap )
    })

  })

  describe( 'header', () => {
    beforeEach( () => {
      SolidRender = require( '../dist/class/SolidRender' )
    })

    it( 'should render header', () => {
      const solidRender = new SolidRender()
      const TEXT = 'Test'
      solidRender.setProps({
        columns: 23,
        headerColor: 'cyan',
        wordwrap: true
      })
      const expected = '\n' + colors.cyan( '==== ERROR: Test =====' ) + '\n'
      const actual = solidRender.header( TEXT )
      expect( expected ).toEqual( actual )
    })

    it( 'should render header without readableName', () => {
      const solidRender = new SolidRender()
      solidRender.setProps({
        columns: 23,
        headerColor: 'cyan',
        wordwrap: true
      })
      const expected = '\n' + colors.cyan( '==== ERROR ===========' ) + '\n'
      const actual = solidRender.header( )
      expect( expected ).toEqual( actual )
    })
  })

  describe( 'message', () => {
    beforeEach( () => {
      SolidRender = require( '../dist/class/SolidRender' )
    })

    it( 'should render message', () => {
      const renderProps = { messageColor: 'reset', wordwrap: false }
      const solidRender = new SolidRender( renderProps )
      const TEXT = 'test'

      const actual = solidRender.message( TEXT )
      const expected = '\n' + colors.reset( TEXT ) + '\n'

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'explain', () => {
    beforeEach( () => {
      SolidRender = require( '../dist/class/SolidRender' )
    })

    it( 'should render explain', () => {
      const renderProps = {
        explain: 'reset',
        wordwrap: true,
        markdown: false
      }
      const solidRender = new SolidRender( renderProps )
      const TEXT = 'test'

      const expected = '\n' + colors.reset( TEXT )
      const actual = solidRender.explain( TEXT )

      expect( expected ).toEqual( actual )
    })

    it( 'should format markdown in explain section', () => {
      const renderProps = { markdown: true }
      const solidRender = new SolidRender( renderProps )
      const TEXT = 'bold text'
      const MD_TEXT = '**' + TEXT + '**'

      const expected = '\n' + colors.bold( TEXT ) + '\n'
      const actual = solidRender.explain( MD_TEXT )

      expect( expected).toEqual( actual )
    })
  })

  describe( 'trace', () => {
    beforeEach( () => {
      SolidRender = require( '../dist/class/SolidRender' )
    })

    it( 'should format trace', () => {
      const TEXT = 'Test'

      const renderProps = {
        columns: 22,
        traceColor: 'reset',
        traceTitle: 'STACKTRACE',
        wordwrap: false,
      }
      const solidRender = new SolidRender( renderProps )

      const expected = '\n' + colors.reset( '---- STACKTRACE -----' )
        + '\n\n' + TEXT
      const actual = solidRender.trace( TEXT )

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'hints', () => {
    beforeEach( () => {
      SolidRender = require( '../dist/class/SolidRender' )
    })

    it( 'should render hints', () => {
      const renderProps = {
        columns: 22,
        hintsColor: 'reset',
        hintsTitle: 'HINTS',
        markdown: false,
        wordwrap: false,
      }
      const solidRender = new SolidRender( renderProps )
      const TEXT = 'example text'
      const expected =
        '\n' + colors.reset( '---- HINTS ----------' ) + '\n\n' + TEXT + '\n'
      const actual = solidRender.hints( TEXT )
      expect( expected ).toEqual( actual )
    })

    it( 'should format markdown in hints section', () => {
      const renderProps = {
        columns: 22,
        hintsColor: 'reset',
        hintsTitle: 'HINTS',
        markdown: true,
        wordwrap: false,
      }
      const solidRender = new SolidRender( renderProps )

      const TEXT = 'example text'
      const MD_TEXT = '_' + TEXT + '_'

      const coloredDivider = colors.reset( '---- HINTS ----------' )
      const markdownContent = colors.italic( TEXT )
      const expected = `\n${coloredDivider}\n\n${markdownContent}\n`
      const actual = solidRender.hints( MD_TEXT )

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'footer', () => {
    beforeEach( () => {
      SolidRender = require( '../dist/class/SolidRender' )
    })

    it( 'should render footer', () => {
      const ECODE = 'ETEST'
      const EPATH = '/path/to/test'
      const renderProps = {
        columns: 22,
        footerColor: 'blue',
        markdown: false,
        wordwrap: true,
      }
      const solidRender = new SolidRender( renderProps )

      const DIVIDER = '---------------------'
      const expected = '\n' + colors.blue(
        DIVIDER + '\n'
        + 'Code: ' + ECODE + '\n'
        + 'Path: ' + EPATH
        + '\n' + DIVIDER
      ) + '\n'
      const actual = solidRender.footer( ECODE, EPATH )

      expect( expected ).toEqual( actual )
    })

    it( 'should format "footer" section without Path', () => {
      const ECODE = 'ETEST'
      const renderProps = {
        columns: 22,
        footerColor: 'blue',
        markdown: false,
        wordwrap: true,
      }
      const solidRender = new SolidRender( renderProps )

      const DIVIDER = '---------------------'
      const expected = '\n' + colors.blue(
        DIVIDER + '\n'
        + 'Code: ' + ECODE
        + '\n' + DIVIDER
      ) + '\n'

      const actual = solidRender.footer( ECODE, null )

      expect( expected ).toEqual( actual )
    })

    it( 'should render footer section wihout code', () => {
      const EPATH = '/path/to/test'
      const renderProps = {
        columns: 22,
        footerColor: 'blue',
        markdown: false,
        wordwrap: true,
      }
      const solidRender = new SolidRender( renderProps )

      const DIVIDER = '---------------------'
      const expected = '\n' + colors.blue(
        DIVIDER + '\n'
        + 'Path: ' + EPATH
        + '\n' + DIVIDER
      ) + '\n'

      const actual = solidRender.footer( null, EPATH )
      expect( expected ).toEqual( actual )
    })

    it( 'should return nothing if parameters are missing', () => {
      const renderProps = {
        columns: 22,
        footerColor: 'blue',
        markdown: false,
        wordwrap: true,
      }
      const solidRender = new SolidRender( renderProps )

      const actual = solidRender.footer( null, null )
      expect( '' ).toEqual( actual )
    })
  })
})
