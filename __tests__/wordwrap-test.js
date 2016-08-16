/* eslint no-undef: 'off' */
jest.unmock( '../lib/wordwrap' )

var wordwrap

describe( 'wordwrap', function() {
  beforeEach( function() {
    wordwrap = require( '../lib/wordwrap' )
  })

  it('should wordwrap at 80 columns', function() {
    var COLUMNS = 80
    var GFM_ACTIVE = false
    var longText = 'Lorem Ipsum is simply dummy text of the printing and '
      + 'typesetting industry. Lorem Ipsum has been the industry\'s standard '
      + 'dummy text ever since the 1500s, when an unknown printer took a '
      + 'galley of type and scrambled it to make a type specimen book. It has '
      + 'survived not only five centuries, but also the leap into electronic '
      + 'typesetting, remaining essentially unchanged. It was popularised in '
      + 'the 1960s with the release of Letraset sheets containing Lorem Ipsum '
      + 'passages, and more recently with desktop publishing software like '
      + 'Aldus PageMaker including versions of Lorem Ipsum.'

    wordwrap( longText, COLUMNS, GFM_ACTIVE )
      .split('\n').forEach( function( item ) {
        expect( item.length <= COLUMNS ).toBeTruthy()
      })
  })

  it('should wordwrap at 120 columns (with gfm: true)', function() {
    var COLUMNS = 120
    var GFM_ACTIVE = true
    var longText = 'Lorem Ipsum is simply dummy text of the printing and '
      + 'typesetting industry. Lorem Ipsum has been the industry\'s standard '
      + 'dummy text ever since the 1500s, when an unknown printer took a '
      + 'galley of type and scrambled it to make a type specimen book. It has '
      + 'survived not only five centuries, but also the leap into electronic '
      + 'typesetting, remaining essentially unchanged. It was popularised in '
      + 'the 1960s with the release of Letraset sheets containing Lorem Ipsum '
      + 'passages, and more recently with desktop publishing software like '
      + 'Aldus PageMaker including versions of Lorem Ipsum.'

    wordwrap( longText, COLUMNS, GFM_ACTIVE )
      .split('\n').forEach( function( item ) {
        expect( item.length <= COLUMNS ).toBeTruthy()
      })
  })
})