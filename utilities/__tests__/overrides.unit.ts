import { overrideValues } from "../overrides"


describe('OVERRIDES', () => {
    it('should take a base object and overwrite values we pass in', () => {
        interface Person {
            name: string,
            profession: string,
            hilarious: boolean,
            realPerson: boolean
        }

        const baseObject: Person = {
            name: 'Dwayne "The Rock" Johnson',
            profession: 'actor',
            hilarious: true,
            realPerson: true
        }
        const overrideBase: Person = {
            name: 'Homer Simpson',
            profession: 'Nuclear safety technician',
            hilarious: true,
            realPerson: false
        }

        const result = overrideValues<Person>(baseObject, {
            name: 'Homer Simpson',
            profession: 'Nuclear safety technician',
            realPerson: false
        })

        expect(result).toEqual(overrideBase)
    })
})
