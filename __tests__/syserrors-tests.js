jest.unmock( 'path' )
jest.unmock( 'fs' )
jest.unmock( 'js-yaml' )
jest.unmock( '../dist/lib/solidtext' )
jest.unmock( '../dist/lib/syserrors' )

var path = require( 'path' )
var SysErrors

describe( 'lib/syserrors', function () {
  describe( 'constructor', function () {
    beforeEach( function () {
      SysErrors = require( '../dist/lib/syserrors')
    })

    it( 'should initialize SysErrors', function () {
      var testProps = {
        lang: 'it',
        includes: [ '/path/to/custom/errdef' ]
      }
      var sysErrors = new SysErrors( testProps )

      expect( testProps.lang ).toEqual( sysErrors.props.lang )
      expect( testProps.includes ).toEqual( sysErrors.props.includes )
    })

    it( 'should change properties after initialization', function () {
      var sysErrors = new SysErrors()
      var testProps = {
        lang: 'pl',
        includes: [ '/path/to/custom/syserrors' ]
      }
      sysErrors.setProps( testProps )

      expect( testProps.lang ).toEqual( sysErrors.props.lang )
      expect( testProps.includes ).toEqual( sysErrors.props.includes )
    })

    it( 'should convert single include string to string[]', function () {
      var sysErrors = new SysErrors()
      var testProps = {
        includes: '/path/to/custom/syserrors'
      }
      
      sysErrors.setProps( testProps )

      var expected = [ '/path/to/custom/syserrors' ]
      var actual = sysErrors.props.includes

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'definitionsDir', function () {
    beforeEach( function () {
      SysErrors = require( '../dist/lib/syserrors')
    })

    it( 'should get error definitions dir', function () {
      var LANG = 'it'
      var sysErrors = new SysErrors({ lang: LANG })
      var expected = path.join( __dirname, '../errdef/' + LANG )
      var actual = sysErrors.definitionsDir()
      expect( expected ).toEqual( actual )
    })
  })

  describe( 'includeDirs', function () {
    beforeEach( function () {
      SysErrors = require( '../dist/lib/syserrors')
    })

    it( 'should get error included dir', function () {
      var LANG = 'it'
      var INCLUDES = [ '/path/to/include' ]
      var sysErrors = new SysErrors({ lang: LANG, includes: INCLUDES })
      
      var expected = [ path.join( '/path/to/include', LANG ) ]
      var actual = sysErrors.includeDirs()

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'getSolidErrorProps', function () {
    beforeEach( function () {
      SysErrors = require( '../dist/lib/syserrors')
    })

    it( 'should have error defined as inner props', function() {
      var sysErrors = new SysErrors()
      var testError = new Error( 'test error' )      
      var props = sysErrors.getSolidErrorProps( testError )

      expect( props.hasOwnProperty('inner') ).toBeTruthy()
      expect( props.inner ).toBeDefined()
      expect( props.inner ).toEqual( testError )
    })

    it( 'should return a Solid Error', function() {
      var testError = new Error()
      var sysErrors = new SysErrors()

      var expected = {
        code: 'EERR',
        errno: -100,
        name: 'Error',
        readableName: 'Error',
        message: 'An Error occurred.',
        inner: testError
      }
      var expectedKeys = Object.keys( expected ).sort()

      var actual = sysErrors.getSolidErrorProps( testError )
      var actualKeys = Object.keys( actual ).sort()

      var expectedValues = expectedKeys.map( function( key ) {
        return expected[ key ]
      })

      var actualValues = actualKeys.map( function( key ) {
        return actual[ key ]
      })

      expect( expectedKeys ).toEqual( actualKeys )
      expect( expectedValues ).toEqual( actualValues )
    })

    it( 'should return a Solid Error with custom message', function() {
      var sysErrors = new SysErrors()
      var TEXT = 'Custom test message'
      var testError = new Error( TEXT )
      var expected = {
        code: 'EERR',
        errno: -100,
        name: 'Error',
        readableName: 'Error',
        message: TEXT,
        inner: testError
      }
      var expectedKeys = Object.keys( expected ).sort()

      var actual = sysErrors.getSolidErrorProps( testError )
      var actualKeys = Object.keys( actual ).sort()

      var expectedValues = expectedKeys.map( function ( key ) {
        return expected[ key ]
      })

      var actualValues = actualKeys.map( function ( key ) {
        return actual[ key ]
      })

      expect( expectedKeys ).toEqual( actualKeys )
      expect( expectedValues ).toEqual( actualValues )
    })

    it( 'should return a Solid Error with custom name', function () {
      var sysErrors = new SysErrors()
      var ERROR_NAME = 'TestError'
      var testError = new Error()
      testError.name = ERROR_NAME
      var expected = {
        code: 'EERR',
        errno: -100,
        name: ERROR_NAME,
        message: 'A Test Error occurred.',
        readableName: 'Test Error',
        inner: testError
      }
      var actual = sysErrors.getSolidErrorProps( testError )

      expect( expected ).toEqual( actual )
    })

    it( 'should give precedence to user defined error', function () {
      var sysErrors = new SysErrors()
      var testError = new RangeError()
      var expected = {
        code: 'TRNG',
        errno: -201,
        name: 'RangeError',
        readableName: 'Range Error',
        message: 'A Range Error occurred.',
        explain: 'This message should show up only during tests.',
        inner: testError
      }
      var expectedKeys = Object.keys( expected ).sort()

      sysErrors.setProps({
        lang: 'en',
        includes: path.join( __dirname, './support/errorDefinitions' )
      })

      var actual = sysErrors.getSolidErrorProps( testError )
      var actualKeys = Object.keys( actual ).sort()

      var expectedValues = expectedKeys.map( function ( key ) {
        return expected[ key ]
      })

      var actualValues = actualKeys.map( function ( key ) {
        return actual[ key ]
      })

      expect( expectedKeys ).toEqual( actualKeys )
      expect( expectedValues ).toEqual( actualValues )
    })
  })
})
