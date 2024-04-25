import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';

/**
* @function Form
*/
describe('Form component', () => {
  test('enables the submit button if all fields are valid', () => {
    render(<Form />);

    fireEvent.change(screen.getByLabelText('Date de naissance:'), {
      target: { value: '1990-01-01' },
    });
    fireEvent.change(screen.getByLabelText('Adresse e-mail:'), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Nom:'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('Prenom:'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Ville:'), {
      target: { value: 'Nice' },
    });
    fireEvent.change(screen.getByLabelText('Code postal:'), {
      target: { value: '12345' },
    });

    expect(screen.getByText('Soumettre')).toBeEnabled();
  });

  test('disables the submit button if any field is invalid or empty', () => {
    render(<Form />);

    fireEvent.change(screen.getByLabelText('Date de naissance:'), {
      target: { value: '1990-01-01' },
    });
    fireEvent.change(screen.getByLabelText('Adresse e-mail:'), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Nom:'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('Prenom:'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Ville:'), {
      target: { value: 'Nice' },
    });
    fireEvent.change(screen.getByLabelText('Code postal:'), {
      target: { value: '12345' },
    });

    const fields = [
      { label: 'Date de naissance:', value: '' },
      { label: 'Adresse e-mail:', value: '' },
      { label: 'Nom:', value: '' },
      { label: 'Prenom:', value: '' },
      { label: 'Ville:', value: '' },
      { label: 'Code postal:', value: '' },
    ];

    fields.forEach((field) => {
      fireEvent.change(screen.getByLabelText(field.label), {
        target: { value: field.value },
      });
    });

    expect(screen.getByText('Soumettre')).toBeDisabled();
  });

  test('renders the form with input fields', () => {
    render(<Form />);

    expect(screen.getByLabelText('Date de naissance:')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse e-mail:')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom:')).toBeInTheDocument();
    expect(screen.getByLabelText('Prenom:')).toBeInTheDocument();
    expect(screen.getByLabelText('Ville:')).toBeInTheDocument();
    expect(screen.getByLabelText('Code postal:')).toBeInTheDocument();

    expect(screen.getByText('Soumettre')).toBeInTheDocument();
  });

  test('submits the form with valid data', async () => {
    render(<Form />);

    fireEvent.change(screen.getByLabelText('Date de naissance:'), {
      target: { value: '1990-01-01' },
    });
    fireEvent.change(screen.getByLabelText('Adresse e-mail:'), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Nom:'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('Prenom:'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Ville:'), {
      target: { value: 'Nice' },
    });
    fireEvent.change(screen.getByLabelText('Code postal:'), {
      target: { value: '12345' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Soumettre'));
    });

    expect(screen.getByText('Formulaire soumis avec succès !')).toBeInTheDocument();

    expect(screen.getByLabelText('Date de naissance:')).toHaveValue('');
    expect(screen.getByLabelText('Adresse e-mail:')).toHaveValue('');
    expect(screen.getByLabelText('Nom:')).toHaveValue('');
    expect(screen.getByLabelText('Prenom:')).toHaveValue('');
    expect(screen.getByLabelText('Ville:')).toHaveValue('');
    expect(screen.getByLabelText('Code postal:')).toHaveValue('');
    
    expect(localStorage.getItem('formData')).not.toBeNull();
    expect(localStorage.getItem('formData')).toContain('1990-01-01');
    expect(localStorage.getItem('formData')).toContain('john.doe@example.com');
    expect(localStorage.getItem('formData')).toContain('Doe');
    expect(localStorage.getItem('formData')).toContain('John');
    expect(localStorage.getItem('formData')).toContain('Nice');
    expect(localStorage.getItem('formData')).toContain('12345');
  });

  test('displays error messages for invalid data', async () => {
    render(<Form />);

    fireEvent.change(screen.getByLabelText('Date de naissance:'), {
      target: { value: 'invalid-date' },
    });
    fireEvent.change(screen.getByLabelText('Adresse e-mail:'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByLabelText('Nom:'), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByLabelText('Prenom:'), {
      target: { value: '456' },
    });
    fireEvent.change(screen.getByLabelText('Ville:'), {
      target: { value: '789' },
    });
    fireEvent.change(screen.getByLabelText('Code postal:'), {
      target: { value: 'invalid-code' },
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Soumettre'));
    });

    expect(screen.getByText('Date de naissance invalide')).toBeInTheDocument();
    expect(screen.getByText('Adresse e-mail invalide')).toBeInTheDocument();
    expect(screen.getByText('Nom invalide')).toBeInTheDocument();
    expect(screen.getByText('Prenom invalide')).toBeInTheDocument();
    expect(screen.getByText('Ville invalide')).toBeInTheDocument();
    expect(screen.getByText('Code postal invalide')).toBeInTheDocument();

    expect(screen.queryByText('Formulaire soumis avec succès !')).not.toBeInTheDocument();
    expect(screen.getByText('Veuillez remplir correctement tous les champs du formulaire.')).toBeInTheDocument();

    expect(localStorage.getItem('formData')).toBeNull();
  });
});
