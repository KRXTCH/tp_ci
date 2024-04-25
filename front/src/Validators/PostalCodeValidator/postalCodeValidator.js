/**
 * Valide un code postal en s'assurant qu'il est composé exactement de cinq chiffres.
 *
 * @param {string} pc - La chaîne de caractères représentant le code postal à valider.
 * @returns {boolean} - `true` si le code postal est valide, `false` sinon.
 */
export function postalCodeValidator(pc) {
    if (typeof pc !== 'string') {
        return false;
    }

    const postalCodeRegex = /^\d{5}$/;
    return postalCodeRegex.test(pc);
}
