jest.unmock( 'path' )
jest.unmock( 'fs' )
jest.unmock( 'js-yaml' )
jest.unmock( 'chalk' )
jest.unmock( 'cli-table' )
jest.unmock( 'cardinal' )
jest.unmock( 'marked' )
jest.unmock( 'node-emoji' )
jest.unmock( '../dist/lib/solidtext' )
jest.unmock( '../dist/lib/ttyrender' )
jest.unmock( '../dist/lib/solidrender' )
jest.unmock( '../dist/lib/options' )
jest.unmock( '../dist/lib/exterror' )
jest.unmock( '../dist/lib/syserrors' )
jest.unmock( '../dist/lib/soliderror' )

var SolidError

describe( 'lib/soliderror', function () {

  describe( 'constructor', function() {

    beforeEach( function () {
      SolidError = require( '../dist/lib/soliderror' )
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
