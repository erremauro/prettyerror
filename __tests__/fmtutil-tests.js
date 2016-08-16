/* eslint no-undef: 'off' */
jest.unmock( 'chalk' )
jest.unmock( 'marked' )
jest.unmock( 'cli-table')
jest.unmock( 'cardinal' )
jest.unmock( 'node-emoji')
jest.unmock( '../lib/defaults' )
jest.unmock( '../lib/wordwrap' )
jest.unmock( '../lib/renderer' )
jest.unmock( '../lib/fmtutil' )

var fmtutil
var colors = require( 'chalk' )
var FormatOptionsKeys = [
  'colors',
  'columns',
  'describe',
  'example',
  'exampleStyle',
  'exampleTitle',
  'explain',
  'footer',
  'footerStyle',
  'header',
  'highlight',
  'headerStyle',
  'headerTitle',
  'inner',
  'innerTitle',
  'innerStyle',
  'markdown',
  'wordwrap',
]

describe( 'lib/fmtutil', function() {
  beforeEach( function() {
    fmtutil = require( '../lib/fmtutil' )
    fmtutil.setOptions( fmtutil.defaultOptions )
  })

  describe( 'Options', function() {
    it( 'should set options', function() {
      var currentOptions = fmtutil.getOptions()

      fmtutil.setOptions({
        wordwrap: false,
        colors: false
      })

      var newOptions = fmtutil.getOptions()

      expect( currentOptions.wordwrap !== newOptions.wordwrap ).toBeTruthy()
      expect( currentOptions.colors !== newOptions.colors ).toBeTruthy()
      expect( newOptions.wordwrap ).toBeFalsy()
      expect( newOptions.colors ).toBeFalsy()
    })

    it( 'should get options', function() {
      var options = fmtutil.getOptions()

      var expectedKeys = FormatOptionsKeys.sort()
      var actualKeys = Object.keys( options ).sort()

      expect( options ).toBeDefined()
      expect( typeof options === 'object' ).toBeTruthy()
      expect( expectedKeys ).toEqual( actualKeys )
    })
  })

  describe( 'Header Section', function() {
    it( 'should format "header" section', function() {
      var TEXT = 'Test'
      fmtutil.setOptions({
        columns: 21,
        header: colors.cyan,
        wordwrap: true
      })
      var expected = colors.cyan( '\n==== ERROR: Test =====\n' )
      var actual = fmtutil.format.header( TEXT )
      expect( expected ).toEqual( actual )
    })
  })

  describe( 'Describe Section', function() {
    it( 'should format "describe" section', function() {
      var TEXT = 'test'

      fmtutil.setOptions({
        describe: colors.reset,
        wordwrap: false
      })

      var actual = fmtutil.format.describe( TEXT )
      var expected = colors.reset( '\n' + TEXT + '\n' )

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'Explain Section', function() {
    it( 'should format "explain" section', function() {
      var TEXT = 'test'

      fmtutil.setOptions({
        explain: colors.reset,
        wordwrap: true,
        markdown: false,
      })

      var expected = colors.reset( '\n' + TEXT )
      var actual = fmtutil.format.explain( TEXT )

      expect( expected ).toEqual( actual )
    })

    it( 'should format markdown in "explain" section', function() {
      fmtutil.setOptions({
        markdown: true,
        wordwrap: false,
      })
      var TEXT = 'bold text'
      var MD_TEXT = '**' + TEXT + '**'
      var expected = '\n' + colors.bold( TEXT ) + '\n'
      var actual = fmtutil.format.explain( MD_TEXT )
      expect( expected ).toEqual( actual )
    })
  })

  describe( 'Example Section', function() {
    it( 'should format "example" section', function() {
      fmtutil.setOptions({
        columns: 20,
        example: colors.reset,
        exampleTitle: 'HINTS',
        markdown: false,
        wordwrap: false,
      })
      var TEXT = 'example text'
      var expected = colors.reset( '\n---- HINTS ----------\n\n' + TEXT + '\n' )
      var actual = fmtutil.format.example( TEXT )
      expect( expected ).toEqual( actual )
    })

    it( 'should format markdown in "example" section', function() {
      fmtutil.setOptions({
        columns: 20,
        example: colors.reset,
        exampleTitle: 'HINTS',
        markdown: true,
        wordwrap: false,
      })
      var TEXT = 'example text'
      var MD_TEXT = '_' + TEXT + '_'
      var expected = '\n---- HINTS ----------\n'
        + '\n' + colors.italic( TEXT ) + '\n'
      var actual = fmtutil.format.example( MD_TEXT )
      expect( expected ).toEqual( actual )
    })
  })

  describe( 'Trace Section', function() {
    it( 'should format "stack trace" section', function() {
      var TEXT = 'Test'

      fmtutil.setOptions({
        columns: 20,
        example: colors.reset,
        innerTitle: 'STACKTRACE',
        wordwrap: false,
      })

      var expected = colors.reset( '\n---- STACKTRACE -----\n\n' + TEXT + '\n')
      var actual = fmtutil.format.trace( TEXT )

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'Footer Section', function() {
    it( 'should format "footer" section', function() {
      var ECODE = 'ETEST'
      var EPATH = '/path/to/test'
      fmtutil.setOptions({
        columns: 20,
        footer: colors.blue,
        markdown: false,
        wordwrap: true,
      })
      var DIVIDER = '\n---------------------\n'
      var expected = colors.blue(
        DIVIDER
        + 'Code: ' + ECODE + '\n'
        + 'Path: ' + EPATH
        + DIVIDER
      )
      var actual = fmtutil.format.footer( ECODE, EPATH )
      expect( expected ).toEqual( actual )
    })

    it( 'should format "footer" section without Path', function() {
      var ECODE = 'ETEST'
      fmtutil.setOptions({
        columns: 20,
        footer: colors.blue,
        markdown: false,
        wordwrap: true,
      })
      var DIVIDER = '\n---------------------\n'
      var expected = colors.blue(
        DIVIDER
        + 'Code: ' + ECODE
        + DIVIDER
      )
      var actual = fmtutil.format.footer( ECODE, null )
      expect( expected ).toEqual( actual )
    })

    it( 'should format "footer" section wihout code', function() {
      var EPATH = '/path/to/test'
      fmtutil.setOptions({
        columns: 20,
        footer: colors.blue,
        markdown: false,
        wordwrap: true,
      })
      var DIVIDER = '\n---------------------\n'
      var expected = colors.blue(
        DIVIDER
        + 'Path: ' + EPATH
        + DIVIDER
      )
      var actual = fmtutil.format.footer( null, EPATH )
      expect( expected ).toEqual( actual )
    })
  })

  describe( 'Truncate', function() {
    it( 'should truncate long string and add ellipsis', function() {
      var longString = 'A very long string that should be truncated.'
      var MAX_LEN = 14
      var expected = 'A very long...'
      var actual = fmtutil.truncate( longString, MAX_LEN )
      expect( expected ).toEqual( actual )
    })
  })
})
