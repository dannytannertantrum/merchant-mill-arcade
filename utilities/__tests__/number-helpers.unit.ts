import { sanitizeScore } from "../../utilities/number-helpers"

describe('sanitizeScore', () => {
    test('should return undefined if passing null or undefined', () => {
        expect(sanitizeScore(undefined)).toBeUndefined()
    })

    test('should return undefined if input is not a number', () => {
        // @ts-ignore comment
        expect(sanitizeScore('string')).toBeUndefined()
    })

    test('should return undefined if input is less than zero', () => {
        expect(sanitizeScore(-10)).toBeUndefined()
    })

    test('should return whole positive numbers', () => {
        expect(sanitizeScore(199)).toEqual(199)
        expect(sanitizeScore(1)).toEqual(1)
    })

    test('should take floats and return whole numbers rounded to nearest 10', () => {
        expect(sanitizeScore(3.5)).toEqual(4)
        expect(sanitizeScore(3.8)).toEqual(4)
        expect(sanitizeScore(3.1)).toEqual(3)
        expect(sanitizeScore(3.4999)).toEqual(3)
    })
})
