jest.unmock( 'path' )
jest.unmock( 'fs' )
jest.unmock( 'js-yaml' )
jest.unmock( 'chalk' )
jest.unmock( 'marked' )
jest.unmock( 'cli-table' )
jest.unmock( 'cardinal' )
jest.unmock( 'node-emoji' )
jest.unmock( '../dist/lib/solidtext' )
jest.unmock( '../dist/lib/ttyrender' )
jest.unmock( '../dist/lib/solidrender' )
jest.unmock( '../dist/lib/solidapi' )
jest.unmock( '../dist/lib/exterror' )
jest.unmock( '../dist/lib/syserrors' )
jest.unmock( '../dist/lib/soliderror' )

let SolidError

describe( 'lib/soliderror', () => {

  describe( 'constructor', () => {

    beforeEach( () => {
      SolidError = require( '../dist/lib/soliderror' )
    })

    it( 'should initialize solid error', () => {
      const solidError = new SolidError()
      expect( solidError.props ).toBeDefined()
    })

    it( 'should initialize with message', () => {
      const MESSAGE = 'A test error occurred'
      const solidError = new SolidError( MESSAGE )
      expect( solidError.message ).toEqual( MESSAGE )
      expect( solidError.props.message ).toEqual( MESSAGE )
      expect( solidError.props ).toBeDefined()
    })

    it( 'should initialize with message and props', () => {
      const MESSAGE = 'A test error occurred'
      const testProps = {
        code: 'ETST',
        errno: -100,
        name: 'TestError',
        readableName: 'Test Error',
        message: MESSAGE,
        explain: 'Test Error explanation',
        hints: 'Test Error hints'
      }
      const solidError = new SolidError( MESSAGE, testProps )

      expect( solidError.message ).toEqual( MESSAGE )
      expect( solidError.props.message ).toEqual( MESSAGE )
      expect( solidError.props ).toEqual( testProps )
    })

    it( 'should initialize with props only', () => {
      const MESSAGE = 'A test error occurred'
      const testProps = {
        code: 'ETST',
        errno: -100,
        name: 'TestError',
        readableName: 'Test Error',
        message: MESSAGE,
        explain: 'Test Error explanation',
        hints: 'Test Error hints'
      }
      const solidError = new SolidError( testProps )

      expect( solidError.message ).toEqual( MESSAGE )
      expect( solidError.props.message ).toEqual( MESSAGE )
      expect( solidError.props ).toEqual( testProps )
    })

    it( 'should initialize with Error', () => {
      const MESSAGE = 'A test error occurred'
      const ERROR = new Error( MESSAGE )
      const solidError = new SolidError( ERROR )

      expect( MESSAGE ).toEqual( solidError.message )
      expect( MESSAGE ).toEqual( solidError.props.message )
    })

  })

})
