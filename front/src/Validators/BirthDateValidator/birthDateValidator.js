/**
 * Valide une date de naissance.
 *
 * @param {string} birthDate - La chaîne de caractères représentant la date de naissance.
 * @returns {boolean} - `true` si la date de naissance est valide, `false` sinon.
 */
export function birthDateValidator(birthDate) {
    if (typeof birthDate !== 'string') {
        return false;
    }

    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!isoDateRegex.test(birthDate)) {
        return false;
    }

    const parsedDate = new Date(birthDate);

    if (isNaN(parsedDate.getTime())) {
        return false;
    }

    if (calculateAge(birthDate) < 18) {
        return false;
    }

    return true;
}

/**
 * Fonction pour calculer l'âge à partir d'une date de naissance.
 * @param {string | Date} date - La date de naissance sous forme de chaîne ou objet Date.
 * @returns {number | null} - L'âge calculé ou null en cas d'erreur.
 */
export function calculateAge(date) {
    if (!date) {
        console.log("La date de naissance doit être fournie.");
        return null;
    }

    const birthDate = new Date(date);

    if (isNaN(birthDate.getTime())) {
        console.log("La date de naissance fournie n'est pas valide.");
        return null;
    }

    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

