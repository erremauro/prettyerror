jest.unmock( 'chalk' )
jest.unmock( '../dist/lib/solidapi' )

let SolidApi

describe( 'lib/solidapi', () => {

  describe( 'getOptions', () => {
    beforeEach( () => {
      SolidApi = require( '../dist/lib/solidapi' )
    })

    it( 'should get options', () => {
      const actual = SolidApi.getOptions()
      expect( actual.renderer ).toBeNull()
      expect( actual.lang ).toBeDefined()
      expect( actual.includes ).toBeDefined()
    })
  })

  describe( 'setOptions', () => {
    beforeEach( () => {
      SolidApi = require( '../dist/lib/solidapi' )
    })

    it( 'should set options', () => {
      const testProps = { lang: 'it' }
      SolidApi.setOptions( testProps )
      const expected = SolidApi.getOptions()
      expect( expected.lang ).toEqual( 'it' )
    })
  })

  describe( 'setStyles', () => {
    beforeEach( () => {
      SolidApi = require( '../dist/lib/solidapi' )
    })

    it( 'should set styles on SolidRender', () => {
      const mockRender = {
        constructor: { name: 'SolidRender' },
        setProps: jest.fn()
      }
      const testProps = {
        headerColors: 'cyan'
      }
      SolidApi.setOptions({ renderer: mockRender })
      SolidApi.setStyles( testProps )
      expect( mockRender.setProps.mock.calls.length ).toBe( 1 )
      expect( mockRender.setProps.mock.calls[0][0] ).toBe( testProps )
    })
  })
})
