jest.unmock( 'marked' )
jest.unmock( 'chalk' )
jest.unmock( 'node-emoji' )
jest.unmock( '../dist/lib/solidtext' )

let SolidText

describe( 'lib/solidtext', () => {

  describe( 'wordwrap', () => {

    beforeEach( () => {
      SolidText = require( '../dist/lib/solidtext' )
    })

    it('should wordwrap at 80 columns', () => {
      const COLUMNS = 80
      const GFM_ACTIVE = true
      const longText = 'Lorem Ipsum is simply dummy text of the printing and '
        + 'typesetting industry. Lorem Ipsum has been the industry\'s standard '
        + 'dummy text ever since the 1500s, when an unknown printer took a '
        + 'galley of type and scrambled it to make a type specimen book. It has '
        + 'survived not only five centuries, but also the leap into electronic '
        + 'typesetting, remaining essentially unchanged. It was popularised in '
        + 'the 1960s with the release of Letraset sheets containing Lorem Ipsum '
        + 'passages, and more recently with desktop publishing software like '
        + 'Aldus PageMaker including versions of Lorem Ipsum.'

      const wordWrapText = SolidText.wordwrap( longText, COLUMNS, GFM_ACTIVE )
      expect( wordWrapText ).toBeDefined()

      wordWrapText.split('\n').forEach( item => {
        expect( item.length <= COLUMNS ).toBeTruthy()
      })
    })

    it( 'should wordwrap at 120 columns (with gfm: false)', () => {
      const COLUMNS = 120
      const GFM_ACTIVE = false
      const longText = 'Lorem Ipsum is simply dummy text of the printing and '
        + 'typesetting industry. Lorem Ipsum has been the industry\'s standard '
        + 'dummy text ever since the 1500s, when an unknown printer took a '
        + 'galley of type and scrambled it to make a type specimen book. It has '
        + 'survived not only five centuries, but also the leap into electronic '
        + 'typesetting, remaining essentially unchanged. It was popularised in '
        + 'the 1960s with the release of Letraset sheets containing Lorem Ipsum '
        + 'passages, and more recently with desktop publishing software like '
        + 'Aldus PageMaker including versions of Lorem Ipsum.'

      const wordWrapText = SolidText.wordwrap( longText, COLUMNS, GFM_ACTIVE )
      expect( wordWrapText ).toBeDefined()

      wordWrapText.split('\n').forEach(
        item => {
          expect( item.length <= COLUMNS ).toBeTruthy()
        }
      )
    })

  })

  describe( 'textLength', () => {

    beforeEach( () => {
      SolidText = require( '../dist/lib/solidtext' )
    })

    it( 'should get textLength without entities', () => {
      const TEXT = '\u001b[31mTEST\u001b[39m'
      const expected = 4
      const actual = SolidText.textLength( TEXT )
      expect( expected ).toEqual( actual )
    })

  })

  describe( 'truncate', () => {

    beforeEach( () => {
      SolidText = require( '../dist/lib/solidtext' )
    })

    it( 'it should trucate text at 60 columns', () => {
      const longText = 'Lorem Ipsum is simply dummy text of the printing and '
        + 'typesetting industry. Lorem Ipsum has been the industry\'s standard '
      const expectedLength = 60
      const expectedEllipsis = '...'

      const truncatedText = SolidText.truncate( longText, expectedLength )
      const actualLength = truncatedText.length
      const actualEllipsis = truncatedText.slice( -3 )

      expect( expectedLength ).toEqual( actualLength )
      expect( expectedEllipsis ).toEqual( actualEllipsis )
    })

  })

  describe( 'capitalizeFirstLetter', () => {

    beforeEach( () => {
      SolidText = require( '../dist/lib/solidtext' )
    })

    it( 'it should capitalize the first letter', () => {
      const TEXT = 'this should be capitalized.'
      const expected = 'This should be capitalized.'
      const actual = SolidText.capitalizeFirstLetter( TEXT )

      expect( expected ).toEqual( actual )
    })

  })

  describe( 'escapeRegExp', () => {

    beforeEach( () => {
      SolidText = require( '../dist/lib/solidtext' )
    })

    it( 'it escape regular expression from text', () => {
      const TEXT = '*|*|*|*'
      const expected = '*|*|*|*'
      const actual = SolidText.capitalizeFirstLetter( TEXT )

      expect( expected ).toEqual( actual )
    })

  })

  describe( 'emojis', () => {

    beforeEach( () => {
      SolidText = require( '../dist/lib/solidtext' )
    })

    it( 'it should replace emoji string with actual emoji', () => {
      const TEXT = ':heart:'

      const expected = 10084 // unicode entity decimal
      const actual = SolidText.emojis( TEXT ).codePointAt(0)

      expect( expected ).toEqual( actual )
    })

    it( 'should return same text if no emoji found', () => {
      const TEXT = 'no emoji here'

      const expected = TEXT
      const actual = SolidText.emojis( TEXT )

      expect( expected ).toEqual( actual )
    })

  })

})
