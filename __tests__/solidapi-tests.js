jest.unmock( 'path' )
jest.unmock( 'fs' )
jest.unmock( 'js-yaml' )
jest.unmock( 'chalk' )
jest.unmock( 'marked' )
jest.unmock( 'cli-table' )
jest.unmock( 'cardinal' )
jest.unmock( 'node-emoji' )
jest.unmock( '../dist/class/SolidObject' )
jest.unmock( '../dist/class/TTYRender' )
jest.unmock( '../dist/class/SolidRender' )
jest.unmock( '../dist/lib/SolidText' )
jest.unmock( '../dist/lib/SysErrors' )
jest.unmock( '../dist/shared/SolidApi' )

var SolidApi = null

describe( 'shared/SolidApi', function () {

  describe( 'getOptions', function () {
    beforeEach( function () {
      SolidApi = require( '../dist/shared/SolidApi' )
    })

    it( 'should get options', function () {
      var actual = SolidApi.getOptions()
      expect( actual.renderer ).toBeDefined()
      expect( actual.lang ).toBeDefined()
      expect( actual.includes ).toBeDefined()
    })
  })

  describe( 'setOptions', function () {
    beforeEach( function () {
      SolidApi = require( '../dist/shared/SolidApi' )
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
      SolidApi = require( '../dist/shared/SolidApi' )
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

    it( 'should do nothing if no styles are provided', function () {
      var mockRender = {
        constructor: { name: 'SolidRender' },
        setProps: jest.fn()
      }
      SolidApi.setStyles()
      expect( mockRender.setProps.mock.calls.length ).toBe( 0 )
    })
  })
})
