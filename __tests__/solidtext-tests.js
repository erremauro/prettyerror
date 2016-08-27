jest.unmock( 'marked' )
jest.unmock( 'chalk' )
jest.unmock( 'node-emoji' )
jest.unmock( '../dist/lib/SolidText' )

var SolidText = void 0

describe( 'lib/solidtext', function () {

  describe( 'wordwrap', function () {

    beforeEach( function () {
      SolidText = require( '../dist/lib/SolidText' )
    })

    it('should wordwrap at 80 columns', function () {
      var COLUMNS = 80
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

      var wordWrapText = SolidText.wordwrap( longText, COLUMNS, GFM_ACTIVE )
      expect( wordWrapText ).toBeDefined()

      wordWrapText.split('\n').forEach( function (item) {
        expect( item.length <= COLUMNS ).toBeTruthy()
      })
    })

    it( 'should wordwrap at 120 columns (with gfm: false)', function () {
      var COLUMNS = 120
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

      var wordWrapText = SolidText.wordwrap( longText, COLUMNS, GFM_ACTIVE )
      expect( wordWrapText ).toBeDefined()

      wordWrapText.split('\n').forEach(
        function (item) {
          expect( item.length <= COLUMNS ).toBeTruthy()
        }
      )
    })

  })

  describe( 'textLength', function () {

    beforeEach( function () {
      SolidText = require( '../dist/lib/SolidText' )
    })

    it( 'should get textLength without entities', function () {
      var TEXT = '\u001b[31mTEST\u001b[39m'
      var expected = 4
      var actual = SolidText.textLength( TEXT )
      expect( expected ).toEqual( actual )
    })

  })

  describe( 'truncate', function () {

    beforeEach( function () {
      SolidText = require( '../dist/lib/SolidText' )
    })

    it( 'it should trucate text at 60 columns', function () {
      var longText = 'Lorem Ipsum is simply dummy text of the printing and '
        + 'typesetting industry. Lorem Ipsum has been the industry\'s standard '
      var expectedLength = 60
      var expectedEllipsis = '...'

      var truncatedText = SolidText.truncate( longText, expectedLength )
      var actualLength = truncatedText.length
      var actualEllipsis = truncatedText.slice( -3 )

      expect( expectedLength ).toEqual( actualLength )
      expect( expectedEllipsis ).toEqual( actualEllipsis )
    })

  })

  describe( 'capitalizeFirstLetter', function () {

    beforeEach( function () {
      SolidText = require( '../dist/lib/SolidText' )
    })

    it( 'it should capitalize the first letter', function () {
      var TEXT = 'this should be capitalized.'
      var expected = 'This should be capitalized.'
      var actual = SolidText.capitalizeFirstLetter( TEXT )

      expect( expected ).toEqual( actual )
    })

  })

  describe( 'escapeRegExp', function () {

    beforeEach( function () {
      SolidText = require( '../dist/lib/SolidText' )
    })

    it( 'it escape regular expression from text', function () {
      var TEXT = '*|*|*|*'
      var expected = '*|*|*|*'
      var actual = SolidText.capitalizeFirstLetter( TEXT )

      expect( expected ).toEqual( actual )
    })

  })

  describe( 'emojis', function () {

    beforeEach( function () {
      SolidText = require( '../dist/lib/SolidText' )
    })

    it( 'it should have emojis', function () {
      expect( SolidText.emojis ).toBeDefined()
    })

    it( 'it should replace emoji string with actual emoji', function () {
      var TEXT = ':heart:'

      var expected = 10084 // unicode entity decimal
      var actual = SolidText.emojis( TEXT ).codePointAt(0)

      expect( expected ).toEqual( actual )
    })

    it( 'should return same text if no emoji found', function () {
      var TEXT = 'no emoji here'

      var expected = TEXT
      var actual = SolidText.emojis( TEXT )

      expect( expected ).toEqual( actual )
    })

  })

})
