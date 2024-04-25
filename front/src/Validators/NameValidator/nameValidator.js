/**
 * Valide un nom en s'assurant qu'il contient uniquement des lettres alphabétiques et des espaces.
 *
 * @param {string} name - La chaîne de caractères représentant le nom à valider.
 * @returns {boolean} - `true` si le nom est valide, `false` sinon.
 */
export function nameValidator(name) {
    if (typeof name !== 'string') {
        return false;
    }

    const validNameRegex = /^[ A-Za-zÀ-ÖØ-öø-ÿ-]+$/;

    return validNameRegex.test(name);
}