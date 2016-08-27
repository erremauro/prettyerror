jest.unmock( 'path' )
jest.unmock( 'fs' )
jest.unmock( 'js-yaml' )
jest.unmock( 'chalk' )
jest.unmock( '../dist/class/SolidObject' )
jest.unmock( '../dist/lib/SolidText' )
jest.unmock( '../dist/lib/SysErrors' )

const path = require( 'path' )
let SysErrors

describe( 'lib/SysErrors', () => {
  describe( 'constructor', () => {
    beforeEach( () => {
      SysErrors = require( '../dist/lib/SysErrors')
    })

    it( 'should initialize SysErrors', () => {
      const testProps = {
        lang: 'it',
        includes: [ '/path/to/custom/errdef' ]
      }

      SysErrors.setOptions( testProps )

      const options = SysErrors.__get__('options')

      expect( testProps.lang ).toEqual( options.lang )
      expect( testProps.includes ).toEqual( options.includes )
    })

    it( 'should change properties after initialization', () => {
      const testProps = {
        lang: 'pl',
        includes: [ '/path/to/custom/SysErrors' ]
      }
      SysErrors.setOptions( testProps )
      const options = SysErrors.__get__('options')
      expect( testProps.lang ).toEqual( options.lang )
      expect( testProps.includes ).toEqual( options.includes )
    })

    it( 'should convert single include string to string[]', () => {
      const testProps = {
        includes: '/path/to/custom/SysErrors'
      }

      SysErrors.setOptions( testProps )
      const options = SysErrors.__get__('options')
      const expected = [ '/path/to/custom/SysErrors' ]
      const actual = options.includes

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'definitionsDir', () => {
    beforeEach( () => {
      SysErrors = require( '../dist/lib/SysErrors')
    })

    it( 'should get error definitions dir', () => {
      const LANG = 'it'
      SysErrors.setOptions({ lang: LANG })
      const expected = path.join( __dirname, '../dist/definitions/' + LANG )
      const actual = SysErrors.__get__( 'definitionsDir' )()
      expect( expected ).toEqual( actual )
    })
  })

  describe( 'includeDirs', () => {
    beforeEach( () => {
      SysErrors = require( '../dist/lib/SysErrors')
    })

    it( 'should get error included dir', () => {
      const LANG = 'it'
      const INCLUDES = [ '/path/to/include' ]
      SysErrors.setOptions({ lang: LANG, includes: INCLUDES })

      const expected = [ path.join( '/path/to/include', LANG ) ]
      const actual = SysErrors.__get__('includeDirs')()

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'createPropsFrom', () => {
    beforeEach( () => {
      SysErrors = require( '../dist/lib/SysErrors')
    })

    it( 'should have error defined as inner props', () => {
      const testError = new Error( 'test error' )
      const props = SysErrors.createPropsFrom( testError )

      expect( props.hasOwnProperty('inner') ).toBeTruthy()
      expect( props.inner ).toBeDefined()
      expect( props.inner ).toEqual( testError )
    })

    it( 'should return a Solid Error', () => {
      const testError = new Error()

      const expected = {
        code: 'EERR',
        errno: -100,
        name: 'Error',
        readableName: 'Error',
        message: 'An Error occurred.',
        inner: testError
      }
      const expectedKeys = Object.keys( expected ).sort()

      const actual = SysErrors.createPropsFrom( testError )
      const actualKeys = Object.keys( actual ).sort()

      const expectedValues = expectedKeys.map( key => expected[ key ] )
      const actualValues = actualKeys.map( key => actual[ key ] )

      expect( expectedKeys ).toEqual( actualKeys )
      expect( expectedValues ).toEqual( actualValues )
    })

    it( 'should return a Solid Error with custom message', () => {
      const TEXT = 'Custom test message'
      const testError = new Error( TEXT )
      const expected = {
        code: 'EERR',
        errno: -100,
        name: 'Error',
        readableName: 'Error',
        message: TEXT,
        inner: testError
      }
      const expectedKeys = Object.keys( expected ).sort()

      const actual = SysErrors.__get__('createPropsFrom')( testError )
      const actualKeys = Object.keys( actual ).sort()

      const expectedValues = expectedKeys.map( key => expected[ key ] )
      const actualValues = actualKeys.map( key => actual[ key ] )

      expect( expectedKeys ).toEqual( actualKeys )
      expect( expectedValues ).toEqual( actualValues )
    })

    it( 'should return a Solid Error with custom name', () => {
      const ERROR_NAME = 'TestError'
      const testError = new Error()
      testError.name = ERROR_NAME
      const expected = {
        code: 'EERR',
        errno: -100,
        name: ERROR_NAME,
        message: 'A Test Error occurred.',
        readableName: 'Test Error',
        inner: testError
      }
      const actual = SysErrors.createPropsFrom( testError )

      expect( expected ).toEqual( actual )
    })

    it( 'should give precedence to user defined error', () => {
      const testError = new RangeError()
      const expected = {
        code: 'TRNG',
        errno: -201,
        name: 'RangeError',
        readableName: 'Range Error',
        message: 'A Range Error occurred.',
        explain: 'This message should show up only during tests.',
        inner: testError
      }
      const expectedKeys = Object.keys( expected ).sort()

      SysErrors.setOptions({
        lang: 'en',
        includes: path.join( __dirname, './support/errorDefinitions' )
      })

      const actual = SysErrors.createPropsFrom( testError )
      const actualKeys = Object.keys( actual ).sort()

      const expectedValues = expectedKeys.map( key => expected[ key ] )

      const actualValues = actualKeys.map( key => actual[ key ] )

      expect( expectedKeys ).toEqual( actualKeys )
      expect( expectedValues ).toEqual( actualValues )
    })
  })
})
