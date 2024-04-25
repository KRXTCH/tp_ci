import { mailValidator } from "./mailValidator";

/**
* @function mailValidator
*/
describe('mailValidator function', () => {
    test('Valid email should return true', () => {
        const validEmail = 'john.doe@example.com';
        expect(mailValidator(validEmail)).toBe(true);
    });

    test('Invalid email without @ should return false', () => {
        const invalidEmail = 'johndoeexample.com';
        expect(mailValidator(invalidEmail)).toBe(false);
    });

    test('Invalid email without dot (.) should return false', () => {
        const invalidEmail = 'john.doe@examplecom';
        expect(mailValidator(invalidEmail)).toBe(false);
    });

    test('Invalid email with spaces should return false', () => {
        const invalidEmail = 'john doe@example.com';
        expect(mailValidator(invalidEmail)).toBe(false);
    });

    test('Invalid email with leading or trailing spaces should return false', () => {
        const invalidEmail = ' john.doe@example.com ';
        expect(mailValidator(invalidEmail)).toBe(false);
    });

    test('Empty string should return false', () => {
        const emptyEmail = '';
        expect(mailValidator(emptyEmail)).toBe(false);
    });

    test('Non-string input should return false', () => {
        const nonStringInput = 123;
        expect(mailValidator(nonStringInput)).toBe(false);
    });
});