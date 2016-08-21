jest.unmock( 'path' )
jest.unmock( 'fs' )
jest.unmock( 'js-yaml' )
jest.unmock( 'chalk' )
jest.unmock( '../dist/lib/solidtext' )
jest.unmock( '../dist/lib/syserrors' )

const path = require( 'path' )
let SysErrors

describe( 'lib/syserrors', () => {
  describe( 'constructor', () => {
    beforeEach( () => {
      SysErrors = require( '../dist/lib/syserrors')
    })

    it( 'should initialize SysErrors', () => {
      const testProps = {
        lang: 'it',
        includes: [ '/path/to/custom/errdef' ]
      }
      const sysErrors = new SysErrors( testProps )

      expect( testProps.lang ).toEqual( sysErrors.props.lang )
      expect( testProps.includes ).toEqual( sysErrors.props.includes )
    })

    it( 'should change properties after initialization', () => {
      const sysErrors = new SysErrors()
      const testProps = {
        lang: 'pl',
        includes: [ '/path/to/custom/syserrors' ]
      }
      sysErrors.setProps( testProps )

      expect( testProps.lang ).toEqual( sysErrors.props.lang )
      expect( testProps.includes ).toEqual( sysErrors.props.includes )
    })

    it( 'should convert single include string to string[]', () => {
      const sysErrors = new SysErrors()
      const testProps = {
        includes: '/path/to/custom/syserrors'
      }

      sysErrors.setProps( testProps )

      const expected = [ '/path/to/custom/syserrors' ]
      const actual = sysErrors.props.includes

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'definitionsDir', () => {
    beforeEach( () => {
      SysErrors = require( '../dist/lib/syserrors')
    })

    it( 'should get error definitions dir', () => {
      const LANG = 'it'
      const sysErrors = new SysErrors({ lang: LANG })
      const expected = path.join( __dirname, '../errdef/' + LANG )
      const actual = sysErrors.definitionsDir()
      expect( expected ).toEqual( actual )
    })
  })

  describe( 'includeDirs', () => {
    beforeEach( () => {
      SysErrors = require( '../dist/lib/syserrors')
    })

    it( 'should get error included dir', () => {
      const LANG = 'it'
      const INCLUDES = [ '/path/to/include' ]
      const sysErrors = new SysErrors({ lang: LANG, includes: INCLUDES })

      const expected = [ path.join( '/path/to/include', LANG ) ]
      const actual = sysErrors.includeDirs()

      expect( expected ).toEqual( actual )
    })
  })

  describe( 'getSolidErrorProps', () => {
    beforeEach( () => {
      SysErrors = require( '../dist/lib/syserrors')
    })

    it( 'should have error defined as inner props', () => {
      const sysErrors = new SysErrors()
      const testError = new Error( 'test error' )
      const props = sysErrors.getSolidErrorProps( testError )

      expect( props.hasOwnProperty('inner') ).toBeTruthy()
      expect( props.inner ).toBeDefined()
      expect( props.inner ).toEqual( testError )
    })

    it( 'should return a Solid Error', () => {
      const testError = new Error()
      const sysErrors = new SysErrors()

      const expected = {
        code: 'EERR',
        errno: -100,
        name: 'Error',
        readableName: 'Error',
        message: 'An Error occurred.',
        inner: testError
      }
      const expectedKeys = Object.keys( expected ).sort()

      const actual = sysErrors.getSolidErrorProps( testError )
      const actualKeys = Object.keys( actual ).sort()

      const expectedValues = expectedKeys.map( key => expected[ key ] )
      const actualValues = actualKeys.map( key => actual[ key ] )

      expect( expectedKeys ).toEqual( actualKeys )
      expect( expectedValues ).toEqual( actualValues )
    })

    it( 'should return a Solid Error with custom message', () => {
      const sysErrors = new SysErrors()
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

      const actual = sysErrors.getSolidErrorProps( testError )
      const actualKeys = Object.keys( actual ).sort()

      const expectedValues = expectedKeys.map( key => expected[ key ] )
      const actualValues = actualKeys.map( key => actual[ key ] )

      expect( expectedKeys ).toEqual( actualKeys )
      expect( expectedValues ).toEqual( actualValues )
    })

    it( 'should return a Solid Error with custom name', () => {
      const sysErrors = new SysErrors()
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
      const actual = sysErrors.getSolidErrorProps( testError )

      expect( expected ).toEqual( actual )
    })

    it( 'should give precedence to user defined error', () => {
      const sysErrors = new SysErrors()
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

      sysErrors.setProps({
        lang: 'en',
        includes: path.join( __dirname, './support/errorDefinitions' )
      })

      const actual = sysErrors.getSolidErrorProps( testError )
      const actualKeys = Object.keys( actual ).sort()

      const expectedValues = expectedKeys.map( key => expected[ key ] )

      const actualValues = actualKeys.map( key => actual[ key ] )

      expect( expectedKeys ).toEqual( actualKeys )
      expect( expectedValues ).toEqual( actualValues )
    })
  })
})
