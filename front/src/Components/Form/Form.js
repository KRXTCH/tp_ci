import React from "react";
import { birthDateValidator } from "../../Validators/BirthDateValidator/birthDateValidator";
import { mailValidator } from "../../Validators/MailValidator/mailValidator";
import { nameValidator } from "../../Validators/NameValidator/nameValidator";
import { postalCodeValidator } from "../../Validators/PostalCodeValidator/postalCodeValidator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

/**
 * Functional component representing a form to create a user.
 * @param {Object} props - Props for the component.
 * @param {number} props.port - The port number for the API endpoint.
 * @returns {JSX.Element} JSX representing the user creation form.
 */
function Form({ port }) {
   /**
   * State hook to manage form data.
   * @type {Object}
   * @property {string} birthDate - The birth date of the user.
   * @property {string} email - The email of the user.
   * @property {string} name - The name of the user.
   * @property {string} surname - The surname of the user.
   * @property {string} city - The city of the user.
   * @property {string} postalCode - The postal code of the user.
   */
  const [formData, setFormData] = React.useState({
    birthDate: "",
    email: "",
    name: "",
    surname: "",
    city: "",
    postalCode: "",
  });

   /**
   * State hook to manage form validation results.
   * @type {Object}
   * @property {boolean} isBirthDateValid - Indicates if the birth date is valid.
   * @property {boolean} isEmailValid - Indicates if the email is valid.
   * @property {boolean} isNameValid - Indicates if the name is valid.
   * @property {boolean} isSurnameValid - Indicates if the surname is valid.
   * @property {boolean} isCityValid - Indicates if the city is valid.
   * @property {boolean} isPostalCodeValid - Indicates if the postal code is valid.
   */
  const [validationResults, setValidationResults] = React.useState({
    isBirthDateValid: true,
    isEmailValid: true,
    isNameValid: true,
    isSurnameValid: true,
    isCityValid: true,
    isPostalCodeValid: true,
  });

  /**
   * State hook to manage the overall form validity.
   * @type {boolean}
   */
  const [isFormValid, setIsFormValid] = React.useState(false);

  /**
   * Effect hook to check if all form fields are filled and update form validity accordingly.
   */
  React.useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    setIsFormValid(allFieldsFilled);
  }, [formData]);

  /**
   * Function to save form data to the backend.
   */
  const saveFormData = async () => {
    const api = axios.create({
      baseURL: `http://localhost:${port}`,
    });

    api
      .post(`/users`, JSON.stringify(formData), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        toast.success("Formulaire soumis avec succès !");
      })
      .catch((error) => {
        toast.error(`Erreur lors de l'envoie du formulaire.`);
        console.error(error);
      });

    setFormData({
      birthDate: "",
      email: "",
      name: "",
      surname: "",
      city: "",
      postalCode: "",
    });
  };

  /**
   * Handler function for input change events.
   * @param {Object} e - The event object.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (value === "") {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handler function for form submission.
   * @param {Object} e - The event object.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const isBirthDateValid = birthDateValidator(formData.birthDate);
    const isEmailValid = mailValidator(formData.email);
    const isNameValid = nameValidator(formData.name);
    const isSurnameValid = nameValidator(formData.surname);
    const isCityValid = nameValidator(formData.city);
    const isPostalCodeValid = postalCodeValidator(formData.postalCode);

    setValidationResults({
      isBirthDateValid,
      isEmailValid,
      isNameValid,
      isSurnameValid,
      isCityValid,
      isPostalCodeValid,
    });

    const formIsValid =
      isBirthDateValid &&
      isEmailValid &&
      isNameValid &&
      isSurnameValid &&
      isCityValid &&
      isPostalCodeValid;

    if (formIsValid) {
      saveFormData();
    } else {
      toast.error(
        "Veuillez remplir correctement tous les champs du formulaire."
      );
    }
  };

  return (
    <div>
      <h2>Create user</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="birthDate">Date de naissance:</label>
          <input
            id="birthDate"
            type="text"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
          />
          {!validationResults.isBirthDateValid && (
            <span style={{ color: "red" }}>Date de naissance invalide. (Format: YYYY-mm-dd)</span>
          )}
        </div>

        <div>
          <label htmlFor="email">Adresse e-mail:</label>
          <input
            id="email"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {!validationResults.isEmailValid && (
            <span style={{ color: "red" }}>Adresse e-mail invalide</span>
          )}
        </div>

        <div>
          <label htmlFor="name">Nom:</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          {!validationResults.isNameValid && (
            <span style={{ color: "red" }}>Nom invalide</span>
          )}
        </div>

        <div>
          <label htmlFor="surname">Prenom:</label>
          <input
            id="surname"
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
          />
          {!validationResults.isSurnameValid && (
            <span style={{ color: "red" }}>Prenom invalide</span>
          )}
        </div>

        <div>
          <label htmlFor="city">Ville:</label>
          <input
            id="city"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
          {!validationResults.isCityValid && (
            <span style={{ color: "red" }}>Ville invalide</span>
          )}
        </div>

        <div>
          <label htmlFor="postalCode">Code postal:</label>
          <input
            id="postalCode"
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
          />
          {!validationResults.isPostalCodeValid && (
            <span style={{ color: "red" }}>Code postal invalide</span>
          )}
        </div>

        <button type="submit" disabled={!isFormValid}>
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Form;
