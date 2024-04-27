import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Form from './Form';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

const users = [
    {
      birthDate: '1990-01-01',
      email: 'john.doe@example.com',
      name: 'Doe',
      surname: 'John',
      city: 'Nice',
      postalCode: '12345'
    },
    {
      birthDate: '1985-05-20',
      email: 'jane.smith@example.com',
      name: 'Smith',
      surname: 'Jane',
      city: 'Paris',
      postalCode: '54321'
    },
  ];

const port = 1234;
  

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

    expect(screen.getByText('Submit')).toBeEnabled();
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

    expect(screen.getByText('Submit')).toBeDisabled();
  });

  test('renders the form with input fields', () => {
    render(<Form />);

    expect(screen.getByLabelText('Date de naissance:')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse e-mail:')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom:')).toBeInTheDocument();
    expect(screen.getByLabelText('Prenom:')).toBeInTheDocument();
    expect(screen.getByLabelText('Ville:')).toBeInTheDocument();
    expect(screen.getByLabelText('Code postal:')).toBeInTheDocument();

    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('submits the form with valid data', async () => {
    render(<Form port={port}/>);

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

    mock.onPost(`http://localhost:${port}/users`).reply(201, JSON.stringify(users));

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    expect(screen.getByText('Formulaire soumis avec succès !')).toBeInTheDocument();

    expect(screen.getByLabelText('Date de naissance:')).toHaveValue('');
    expect(screen.getByLabelText('Adresse e-mail:')).toHaveValue('');
    expect(screen.getByLabelText('Nom:')).toHaveValue('');
    expect(screen.getByLabelText('Prenom:')).toHaveValue('');
    expect(screen.getByLabelText('Ville:')).toHaveValue('');
    expect(screen.getByLabelText('Code postal:')).toHaveValue('');
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
      fireEvent.click(screen.getByText('Submit'));
    });

    expect(screen.getByText('Date de naissance invalide')).toBeInTheDocument();
    expect(screen.getByText('Adresse e-mail invalide')).toBeInTheDocument();
    expect(screen.getByText('Nom invalide')).toBeInTheDocument();
    expect(screen.getByText('Prenom invalide')).toBeInTheDocument();
    expect(screen.getByText('Ville invalide')).toBeInTheDocument();
    expect(screen.getByText('Code postal invalide')).toBeInTheDocument();

    expect(screen.queryByText('Formulaire soumis avec succès !')).not.toBeInTheDocument();
    expect(screen.getByText('Veuillez remplir correctement tous les champs du formulaire.')).toBeInTheDocument();
  });

  test('displays error toats when api error', async () => {
    render(<Form port={port} />);

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

    mock.onPost(`http://localhost:${port}/users`).reply(500, "error");

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
        expect(screen.queryByText("Erreur lors de l'envoie du formulaire.")).toBeInTheDocument();
    })
  });
});
