import { constructSlug, textInputCleanUpWhitespace } from '../../utilities/string-helpers'


/*
    Sure, test.each saves some space and it's pretty neat,
    but it's so much easier to read each test individually
*/

describe('constructSlug', () => {
    test.each([
        ['trim whitespace and replace with hyphens', 'trim-whitespace-and-replace-with-hyphens'],
        ['collapse extra---------hyphens', 'collapse-extra-hyphens'],
        ['rémöve chãracter acceñts', 'remove-character-accents'],
        [
            'remove any characters_that are not letters, numbers9! or hyphens\t',
            'remove-any-characters-that-are-not-letters-numbers9-or-hyphens'
        ],
        ['CHANGE leTTers to lowercase', 'change-letters-to-lowercase'],
    ])('should %s', (originalString, postSlugConstruction) => {
        expect(constructSlug(originalString)).toEqual(postSlugConstruction)
    })
})

describe('textInputCleanUpWhitespace', () => {
    test('should return undefined when passing undefined', () => {
        expect(textInputCleanUpWhitespace(undefined)).toBeUndefined()
    })

    test('should return undefined with empty string', () => {
        expect(textInputCleanUpWhitespace('')).toBeUndefined()
    })

    test('should return string as is if no whitespace', () => {
        const str = 'This is a normal string!'

        expect(textInputCleanUpWhitespace(str)).toEqual(str)
    })

    test('should return string with all whitespace removed', () => {
        const str = ' Whitespace should     be removed   '
        const expectedString = 'Whitespace should be removed'

        expect(textInputCleanUpWhitespace(str)).toEqual(expectedString)
    })
})
