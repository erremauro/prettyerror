jest.unmock( '../dist/lib/solidapi' )

var SolidApi

describe( 'lib/solidapi', function () {

  describe( 'getOptions', function () {
    beforeEach( function () {
      SolidApi = require( '../dist/lib/solidapi' )
    })

    it( 'should get options', function () {
      var actual = SolidApi.getOptions()
      expect( actual.renderer ).toBeNull()
      expect( actual.lang ).toBeDefined()
      expect( actual.includes ).toBeDefined()
    })
  })

  describe( 'setOptions', function () {
    beforeEach( function () {
      SolidApi = require( '../dist/lib/solidapi' )
    })

    it( 'should set options', function () {
      var testProps = { lang: 'it' }
      SolidApi.setOptions( testProps )
      var expected = SolidApi.getOptions()
      expect( expected.lang ).toEqual( 'it' )
    })
  })

  describe( 'setStyles', function () {
    beforeEach( function () {
      SolidApi = require( '../dist/lib/solidapi' )
    })

    it( 'should set styles on SolidRender', function () {
      var mockRender = {
        constructor: { name: 'SolidRender' }, 
        setProps: jest.fn()
      }
      var testProps = {
        headerColors: 'cyan'
      }
      SolidApi.setOptions({ renderer: mockRender })
      SolidApi.setStyles( testProps )
      expect( mockRender.setProps.mock.calls.length ).toBe( 1 )
      expect( mockRender.setProps.mock.calls[0][0] ).toBe( testProps )
    })
  })
})