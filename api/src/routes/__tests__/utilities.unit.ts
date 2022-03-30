import { constructSlug } from '../utilities'


describe('Construct Slug', () => {
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
