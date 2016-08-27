jest.unmock( 'path' )
jest.unmock( 'fs' )
jest.unmock( 'js-yaml' )
jest.unmock( 'chalk' )
jest.unmock( 'marked' )
jest.unmock( 'cli-table' )
jest.unmock( 'cardinal' )
jest.unmock( 'node-emoji' )
jest.unmock( '../dist/class/ExtError' )
jest.unmock( '../dist/class/SolidObject' )
jest.unmock( '../dist/class/SolidObjectError' )
jest.unmock( '../dist/lib/SolidText' )
jest.unmock( '../dist/lib/SysErrors' )
jest.unmock( '../dist/class/TTYRender' )
jest.unmock( '../dist/class/SolidRender' )
jest.unmock( '../dist/shared/SolidApi' )
jest.unmock( '../dist/class/SolidError' )

var SolidError = void 0

describe( 'class/SolidError', function () {

  describe( 'constructor', function () {

    beforeEach( function () {
      SolidError = require( '../dist/class/SolidError' )
    })

    it( 'should initialize solid error', function () {
      var solidError = new SolidError()
      expect( solidError.props ).toBeDefined()
    })

    it( 'should initialize with message', function () {
      var MESSAGE = 'A test error occurred'
      var solidError = new SolidError( MESSAGE )
      expect( solidError.message ).toEqual( MESSAGE )
      expect( solidError.props.message ).toEqual( MESSAGE )
      expect( solidError.props ).toBeDefined()
    })

    it( 'should initialize with message and props', function () {
      var MESSAGE = 'A test error occurred'
      var testProps = {
        code: 'ETST',
        errno: -100,
        name: 'TestError',
        readableName: 'Test Error',
        message: MESSAGE,
        explain: 'Test Error explanation',
        hints: 'Test Error hints'
      }
      var solidError = new SolidError( MESSAGE, testProps )

      expect( solidError.message ).toEqual( MESSAGE )
      expect( solidError.props.message ).toEqual( MESSAGE )
      expect( solidError.props ).toEqual( testProps )
    })

    it( 'should initialize with props only', function () {
      var MESSAGE = 'A test error occurred'
      var testProps = {
        code: 'ETST',
        errno: -100,
        name: 'TestError',
        readableName: 'Test Error',
        message: MESSAGE,
        explain: 'Test Error explanation',
        hints: 'Test Error hints'
      }
      var solidError = new SolidError( testProps )

      expect( solidError.message ).toEqual( MESSAGE )
      expect( solidError.props.message ).toEqual( MESSAGE )
      expect( solidError.props ).toEqual( testProps )
    })

    it( 'should initialize with Error', function () {
      var MESSAGE = 'A test error occurred'
      var ERROR = new Error( MESSAGE )
      var solidError = new SolidError( ERROR )

      expect( MESSAGE ).toEqual( solidError.message )
      expect( MESSAGE ).toEqual( solidError.props.message )
    })

  })

})
