import { constructSlug, textInputCleanUpWhitespace } from '../../utilities/string-helpers'


describe('constructSlug', () => {
    test('should trim whitespace and replace with hyphens', () => {
        const trimStringBefore = 'dwayne the rock johnson     '
        const trimStringAfter = 'dwayne-the-rock-johnson'

        expect(constructSlug(trimStringBefore)).toEqual(trimStringAfter)
    })

    test('should collapse extra hyphens', () => {
        const collapseHyphensBefore = 'i am homer-----simpson'
        const collapseHyphensAfter = 'i-am-homer-simpson'

        expect(constructSlug(collapseHyphensBefore)).toEqual(collapseHyphensAfter)
    })

    test('should remove character accents', () => {
        const removeAccentsBefore = 'él va mañana'
        const removeAccentsAfter = 'el-va-manana'

        expect(constructSlug(removeAccentsBefore)).toEqual(removeAccentsAfter)
    })

    test('should remove any characters that are not letters, numbers or hyphens', () => {
        const removeInvalidCharsBefore = '\n\t hello there-number 9!'
        const removeInvalidCharsAfter = 'hello-there-number-9'

        expect(constructSlug(removeInvalidCharsBefore)).toEqual(removeInvalidCharsAfter)
    })

    test('should change letters to lowercase', () => {
        const lowercaseBefore = 'Xentrex-it WORKS'
        const lowercaseAfter = 'xentrex-it-works'

        expect(constructSlug(lowercaseBefore)).toEqual(lowercaseAfter)
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
