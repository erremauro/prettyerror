jest.unmock( 'path' )
jest.unmock( 'fs' )
jest.unmock( 'js-yaml' )
jest.unmock( 'chalk' )
jest.unmock( '../dist/class/SolidObject' )
jest.unmock( '../dist/lib/SolidText' )
jest.unmock( '../dist/lib/SysErrors' )

var path = require( 'path' )
var SysErrors = void 0

describe( 'lib/SysErrors', function () {
  describe( 'constructor', function () {
    beforeEach( function () {
      SysErrors = require( '../dist/lib/SysErrors')
    })

    it( 'should initialize SysErrors', function () {
      var testProps = {
        lang: 'it',
        includes: [ '/path/to/custom/errdef' ]
      }

      SysErrors.setOptions( testProps )

      var options = SysErrors.getOptions()

      expect( testProps.lang ).toEqual( options.lang )
      expect( testProps.includes ).toEqual( options.includes )
    })

    it( 'should change properties after initialization', function () {
      var testProps = {
        lang: 'pl',
        includes: [ '/path/to/custom/SysErrors' ]
      }
      SysErrors.setOptions( testProps )
      var options = SysErrors.getOptions()
      expect( testProps.lang ).toEqual( options.lang )
      expect( testProps.includes ).toEqual( options.includes )
    })

    it( 'should convert single include string to string[]', function () {
      var testProps = {
        includes: '/path/to/custom/SysErrors'
      }

      SysErrors.setOptions( testProps )
      var options = SysErrors.getOptions()
      var expected = [ '/path/to/custom/SysErrors' ]
      var actual = options.includes

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'definitionsDir', function () {
    beforeEach( function () {
      SysErrors = require( '../dist/lib/SysErrors')
    })

    it( 'should get error definitions dir', function () {
      var LANG = 'it'
      SysErrors.setOptions({ lang: LANG })
      var expected = path.join( __dirname, '../dist/definitions/' + LANG )
      var actual = SysErrors.definitionsDir()
      expect( expected ).toEqual( actual )
    })
  })

  describe( 'includeDirs', function () {
    beforeEach( function () {
      SysErrors = require( '../dist/lib/SysErrors')
    })

    it( 'should get error included dir', function () {
      var LANG = 'it'
      var INCLUDES = [ '/path/to/include' ]
      SysErrors.setOptions({ lang: LANG, includes: INCLUDES })

      var expected = [ path.join( '/path/to/include', LANG ) ]
      var actual = SysErrors.includeDirs()

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'createPropsFrom', function () {
    beforeEach( function () {
      SysErrors = require( '../dist/lib/SysErrors')
    })

    it( 'should have error defined as inner props', function () {
      var testError = new Error( 'test error' )
      var props = SysErrors.createPropsFrom( testError )

      expect( props.hasOwnProperty('inner') ).toBeTruthy()
      expect( props.inner ).toBeDefined()
      expect( props.inner ).toEqual( testError )
    })

    it( 'should return a Solid Error', function () {
      var testError = new Error()

      var expected = {
        code: 'EERR',
        errno: -100,
        name: 'Error',
        readableName: 'Error',
        message: 'An Error occurred.',
        inner: testError
      }
      var expectedKeys = Object.keys( expected ).sort()

      var actual = SysErrors.createPropsFrom( testError )
      var actualKeys = Object.keys( actual ).sort()

      var expectedValues = expectedKeys.map( function (key) {
        return expected[ key ]
      })
      var actualValues = actualKeys.map( function (key) {
        return actual[ key ]
      })

      expect( expectedKeys ).toEqual( actualKeys )
      expect( expectedValues ).toEqual( actualValues )
    })

    it( 'should return a Solid Error with custom message', function () {
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

      var actual = SysErrors.createPropsFrom( testError )
      var actualKeys = Object.keys( actual ).sort()

      var expectedValues = expectedKeys.map( function (key) {
        return expected[ key ]
      })
      var actualValues = actualKeys.map( function (key) {
        return actual[ key ]
      })

      expect( expectedKeys ).toEqual( actualKeys )
      expect( expectedValues ).toEqual( actualValues )
    })

    it( 'should return a Solid Error with custom name', function () {
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
      var actual = SysErrors.createPropsFrom( testError )

      expect( expected ).toEqual( actual )
    })

    it( 'should give precedence to user defined error', function () {
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

      SysErrors.setOptions({
        lang: 'en',
        includes: path.join( __dirname, './support/errorDefinitions' )
      })

      var actual = SysErrors.createPropsFrom( testError )
      var actualKeys = Object.keys( actual ).sort()

      var expectedValues = expectedKeys.map( function (key) {
        return expected[ key ]
      })

      var actualValues = actualKeys.map( function (key) {
        return actual[ key ]
      })

      expect( expectedKeys ).toEqual( actualKeys )
      expect( expectedValues ).toEqual( actualValues )
    })
  })
})
