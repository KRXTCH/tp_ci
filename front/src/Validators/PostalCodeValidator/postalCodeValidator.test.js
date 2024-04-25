import { postalCodeValidator } from "./postalCodeValidator";

/**
* @function postalCodeValidator
*/
describe('postalCodeValidator function', () => {
    test('Valid postal code with exactly 5 digits should return true', () => {
        const validPostalCode = '12345';
        expect(postalCodeValidator(validPostalCode)).toBe(true);
    });

    test('Invalid postal code with less than 5 digits should return false', () => {
        const invalidPostalCode = '1234';
        expect(postalCodeValidator(invalidPostalCode)).toBe(false);
    });

    test('Invalid postal code with more than 5 digits should return false', () => {
        const invalidPostalCode = '123456';
        expect(postalCodeValidator(invalidPostalCode)).toBe(false);
    });

    test('Invalid postal code with non-digit characters should return false', () => {
        const invalidPostalCode = '12A45';
        expect(postalCodeValidator(invalidPostalCode)).toBe(false);
    });

    test('Empty string should return false', () => {
        const emptyPostalCode = '';
        expect(postalCodeValidator(emptyPostalCode)).toBe(false);
    });

    test('Non-string input should return false', () => {
        const nonStringInput = 12345;
        expect(postalCodeValidator(nonStringInput)).toBe(false);
    });
});