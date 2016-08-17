/* eslint no-undef: 'off' */
jest.unmock( 'chalk' )
jest.unmock( '../lib/wordwrap' )
jest.unmock( '../lib/renderer' )
jest.unmock( 'cli-table' )
jest.unmock( '../lib/fmtutil' )
jest.unmock( '../lib/syserrors' )
jest.unmock('../index')

var SolidError, createError

describe( 'SolidError', function() {
  beforeEach( function(){
    SolidError = require( '../index' ).SolidError
  })

  it( 'should create a SolidError object', function() {
    var errorDetails = {
      name: 'Test',
      describe: 'This is an error message defined during unit test.',
      explain: 'Should be inspected by a test.',
      example: 'expect( error ).toBeDefined()'
    }
    var error = new SolidError( 'Test error message', errorDetails )

    var expectedProps = [
      'code',
      'name',
      'errname',
      'message',
      'describe',
      'explain',
      'example',
      'inner',
      'path',
      'pretty'
    ].sort()

    var actualProps = Object.keys( error ).sort()
    expect( expectedProps ).toEqual( actualProps )
    expect( error.pretty ).toBeTruthy()
  })

  it( 'should have "Error" appended to name in `name` prop.', function() {
    var error = new SolidError( 'No Message', { name: 'Test' } )
    expect( error.name ).toEqual( 'TestError' )
  })

  it( 'should have standard name in `errname` prop.', function() {
    var error = new SolidError( 'No Message', { name: 'Test' } )
    expect( error.errname ).toEqual( 'Test' )
  })

  it( 'should have error stack informations', function() {
    var error = new SolidError( 'No Message', { name: 'Test' } )
    expect( error.stack ).toBeDefined()
  })

  it( 'should print message to the console', function() {
    var errorProps = {
      code: 0,
      name: 'Test',
      message: 'A test message',
      describe: 'A test description',
      explain: 'A test explanation',
      example: 'A test example'
    }
    var allProps = ( function( errorProps ) { // eslint-disable-line
      var values = []
      for ( var prop in errorProps ) {
        values.push( errorProps[ prop ] )
      }
      return values
    })( errorProps )

    var error = new SolidError( errorProps.message, errorProps )
    var printedError = error.toString()

    expect( printedError ).toBeDefined()
    expect( contains( printedError, allProps ) ).toBeTruthy()
  })
})

describe( 'create', function() {
  beforeEach( function(){
    createError = require( '../index' ).createError
  })

  it( 'should create a SolidError instance from function', function() {
    var error = createError( 'No Message', { name: 'Test' })
    expect( error ).toBeDefined()
    expect( error.errname ).toEqual( 'Test' )
  })
})

describe( 'log', function() {
  beforeEach( function(){
    log = require( '../index' ).log
  })

  xit( 'should log a SolidError instance', function() {})
})


/**
 * Check if `testArr` is contained in `srcArr`
 * @param  {Array} srcArr  Source array
 * @param  {Array} testArr Array to test against source.
 * @return {boolean}       True if `srcArr` contains `testArr`, or false.
 */
function contains( srcArr, testArr ) {
  var found = []
  for ( var i = 0; i < testArr.length; i++ ) {
    if ( srcArr.indexOf( testArr[ i ] !== -1 ) ) {
      found.push( testArr[ i ] )
    }
  }
  return found.length === testArr.length
}
