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

let SolidApi

describe( 'shared/SolidApi', () => {

  describe( 'getOptions', () => {
    beforeEach( () => {
      SolidApi = require( '../dist/shared/SolidApi' )
    })

    it( 'should get options', () => {
      const actual = SolidApi.getOptions()
      expect( actual.renderer ).toBeDefined()
      expect( actual.lang ).toBeDefined()
      expect( actual.includes ).toBeDefined()
    })
  })

  describe( 'setOptions', () => {
    beforeEach( () => {
      SolidApi = require( '../dist/shared/SolidApi' )
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
      SolidApi = require( '../dist/shared/SolidApi' )
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
