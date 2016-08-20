jest.unmock( '../dist/lib/options' )

var Options

describe( 'lib/options', function () {

  describe( 'getOptions', function () {
    beforeEach( function () {
      Options = require( '../dist/lib/options' )
    })

    it( 'should get options', function () {
      var actual = Options.getOptions()
      expect( actual.renderer ).toBeNull()
      expect( actual.lang ).toBeDefined()
      expect( actual.includes ).toBeDefined()
    })
  })

  describe( 'setOptions', function () {
    beforeEach( function () {
      Options = require( '../dist/lib/options' )
    })

    it( 'should set options', function () {
      var testProps = { lang: 'it' }
      Options.setOptions( testProps )
      var expected = Options.getOptions()
      expect( expected.lang ).toEqual( 'it' )
    })
  })

  describe( 'setStyles', function () {
    beforeEach( function () {
      Options = require( '../dist/lib/options' )
    })

    it( 'should set styles on SolidRender', function () {
      var mockRender = {
        constructor: { name: 'SolidRender' }, 
        setProps: jest.fn()
      }
      var testProps = {
        headerColors: 'cyan'
      }
      Options.setOptions({ renderer: mockRender })
      Options.setStyles( testProps )
      expect( mockRender.setProps.mock.calls.length ).toBe( 1 )
      expect( mockRender.setProps.mock.calls[0][0] ).toBe( testProps )
    })
  })
})