/* eslint no-undef: 'off' */
jest.unmock( 'path' )
jest.unmock( 'fs' )
jest.unmock( 'js-yaml' )
jest.unmock( '../lib/defaults' )
jest.unmock( '../lib/syserrors' )

var path = require( 'path' )
var syserrors

describe( 'lib/syserrors', function() {
  beforeEach( function() {
    syserrors = require( '../lib/syserrors' )
  })

  it( 'should get options', function() {
    var expected = [ 'lang', 'langDir', 'includes' ].sort()
    var actual = syserrors.getOptions()

    expect( actual ).toBeDefined()
    expect( expected ).toEqual( Object.keys( actual ).sort() )
  })

  it( 'should set options', function() {
    syserrors.setOptions( { lang: 'it' } )
    expect( syserrors.getOptions().lang === 'it' )
  })

  it( 'should get laguage directory', function() {
    var LANG = 'it'
    syserrors.setOptions( { lang: LANG } )

    var expected = path.join( __dirname, '../lang/' + LANG )
    var actual = syserrors.getOptions().langDir

    expect( syserrors.getOptions().lang === 'it' )
    expect( expected ).toEqual( actual )
  })

  it( 'should have error defined as inner props', function() {
    var testError = new Error( 'test error' )
    var props = syserrors.prettyProps( testError )

    expect( props.hasOwnProperty('inner') ).toBeTruthy()
    expect( props.inner ).toBeDefined()
    expect( props.inner ).toEqual( testError )
  })

  it( 'should return a pretty Error', function() {
    var testError = new Error()

    var expected = {
      code: 'ERR',
      errno: -100,
      name: 'Error',
      errname: 'Error',
      message: 'Error',
      describe: 'An Error occurred.',
      inner: testError
    }
    var expectedKeys = Object.keys( expected ).sort()

    var actual = syserrors.prettyProps( testError )
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

  it( 'should return a pretty Error with custom message', function() {
    var TEXT = 'Custom test message'
    var testError = new Error( TEXT )
    var expected = {
      code: 'ERR',
      errno: -100,
      name: 'Error',
      errname: 'Error',
      message: 'Error',
      describe: TEXT,
      inner: testError
    }
    var expectedKeys = Object.keys( expected ).sort()

    var actual = syserrors.prettyProps( testError )
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

  it( 'should return a pretty Error with custom name', function() {
    var ERROR_NAME = 'TestError'
    var testError = new Error()
    testError.name = ERROR_NAME
    var expected = {
      code: 'ERR',
      errno: -100,
      name: ERROR_NAME,
      errname: 'Test',
      message: 'Test Error',
      describe: 'A Test Error occurred.',
      inner: testError
    }
    var expectedKeys = Object.keys( expected ).sort()

    var actual = syserrors.prettyProps( testError )
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

  it( 'should return a pretty RangeError', function() {
    var ERR_CODE = 'ERNG'
    var rangeError = new RangeError( 'number should be between 0 and 10' )
    var props = syserrors.prettyProps( rangeError )
    expect( props.code ).toEqual( ERR_CODE )
  })

})
