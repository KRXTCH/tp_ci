import { birthDateValidator } from "./birthDateValidator";
import { calculateAge } from "./birthDateValidator";

/**
* @function birthDateValidator
*/
describe('birthDateValidator function', () => {
    test('Valid birth date format should return true', () => {
        const validBirthDate = '1990-01-01';
        expect(birthDateValidator(validBirthDate)).toBe(true);
    });

    test('Invalid birth date with incorrect format should return false', () => {
        const invalidBirthDate = '01/01/1990';
        expect(birthDateValidator(invalidBirthDate)).toBe(false);
    });

    test('Invalid birth date with non-existent date should return false', () => {
        const invalidBirthDate = '2022-02-48';
        expect(birthDateValidator(invalidBirthDate)).toBe(false);
    });

    test('Invalid birth date with non-string input should return false', () => {
        const nonStringInput = 12345;
        expect(birthDateValidator(nonStringInput)).toBe(false);
    });

    test('Empty string should return false', () => {
        const emptyBirthDate = '';
        expect(birthDateValidator(emptyBirthDate)).toBe(false);
    });

    test('Birth date lower than 18 return false', () => {
        const invalidBirthDate = '2022-02-12';
        expect(birthDateValidator(invalidBirthDate)).toBe(false);
    })
});

/**
* @function calculateAge
*/
describe('calculateAge', () => {
    it('devrait retourner l\'âge correct pour une date valide', () => {
        const age = calculateAge('1990-01-01');
        expect(age).toEqual(expect.any(Number));
    });

    it('devrait retourner null pour une date non valide', () => {
        const age = calculateAge('date_non_valide');
        expect(age).toBeNull();
    });

    it('devrait retourner null pour une date non fournie', () => {
        const age = calculateAge();
        expect(age).toBeNull();
    });

    it('devrait retrouner un age infererieur si sa date de naisance est pas passé', () => {
        const age = calculateAge('2006-11-12');
        expect(age).toEqual(17);
    })
});