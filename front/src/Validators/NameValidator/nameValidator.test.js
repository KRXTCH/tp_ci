import { nameValidator } from "./nameValidator";

/**
* @function nameValidator
*/
describe('nameValidator', () => {
    test('returns true for valid names with alphabets and hyphens', () => {
      const validNames = ['John Doe', 'Alice-Wonder', 'Jean-Pierre'];
  
      validNames.forEach((name) => {
        expect(nameValidator(name)).toBe(true);
      });
    });
  
    test('returns false for names with special characters', () => {
      const invalidNames = ['John@Doe', 'Alice!', '123', 'Name123'];
  
      invalidNames.forEach((name) => {
        expect(nameValidator(name)).toBe(false);
      });
    });
  
    test('returns false for non-string inputs', () => {
      const nonStringInputs = [123, true, null, undefined, {}];
  
      nonStringInputs.forEach((input) => {
        expect(nameValidator(input)).toBe(false);
      });
    });
  });