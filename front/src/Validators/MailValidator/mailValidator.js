/**
 * Valide une adresse e-mail.
 *
 * @param {string} mail - La chaîne de caractères représentant l'adresse e-mail à valider.
 * @returns {boolean} - `true` si l'adresse e-mail est valide, `false` sinon.
 */
export function mailValidator(mail) {
    if (typeof mail !== 'string') {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(mail);
}