import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import UserManager from "./UserManager";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

const users = [
  {
    id: 0,
    birthDate: "1990-01-01",
    email: "john.doe@example.com",
    name: "Doe",
    surname: "John",
    city: "Nice",
    postalCode: "12345",
  },
  {
    id: 1,
    birthDate: "1985-05-20",
    email: "jane.smith@example.com",
    name: "Smith",
    surname: "Jane",
    city: "Paris",
    postalCode: "54321",
  },
];

const port = 1234;

describe("UserManager component", () => {
  test("renders user manager title and user count", async () => {
    mock.onGet(`/users`).reply(200, JSON.stringify(users));
        
    render(<UserManager port={port} />);

    expect(screen.getByText("User manager")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("2 user(s) already registered")
      ).toBeInTheDocument();

      users.forEach((user) => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
        expect(screen.getByText(user.surname)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
        expect(screen.getByText(user.birthDate)).toBeInTheDocument();
        expect(screen.getByText(user.city)).toBeInTheDocument();
        expect(screen.getByText(user.postalCode)).toBeInTheDocument();
      })
    });
  });

  test("renders user manager failed should display toats error", async () => {
    mock.onGet(`/users`).reply(500);
        
    render(<UserManager port={port} />);

    await waitFor(() => {
      expect(screen.getByText("Une erreur est survenue lors de la récupération des utilisateurs.")).toBeInTheDocument();
    });
  });

  test("opens modal when delete button is clicked", async () => {
    mock.onGet(`/users`).reply(200, JSON.stringify(users));
    mock.onDelete(`/users/1`).reply(200, "User deleted successfully");
  
    render(<UserManager port={port} />);
  
    await waitFor(() => {
      let deleteButton = screen.getAllByText("Delete").pop();
      expect(deleteButton).toBeInTheDocument();
  
      fireEvent.click(deleteButton);
    });
  
    await waitFor(() => {
      expect(screen.getByText("Delete user")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
  });
  

  test("display succeeded toast when delete button in modal is clicked", async () => {
    mock.onGet(`/users`).reply(200, JSON.stringify(users));
    mock.onDelete(`/users/1`).reply(200, "User deleted successfully");

    render(<UserManager port={port} />);

    await waitFor(() => {
      let deleteButton = screen.getAllByText("Delete").pop();
      expect(deleteButton).toBeInTheDocument();
  
      fireEvent.click(deleteButton);
    });

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "test123" },
    });

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(screen.getByText("User deleted successfully")).toBeInTheDocument();
    })
  });

  test("display error toast when delete button in modal is clicked with error response", async () => {
    mock.onGet(`/users`).reply(200, JSON.stringify(users));
    mock.onDelete(`/users/1`).reply(500);

    render(<UserManager port={port} />);

    await waitFor(() => {
      let deleteButton = screen.getAllByText("Delete").pop();
      expect(deleteButton).toBeInTheDocument();
  
      fireEvent.click(deleteButton);
    });

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "delete" },
    });

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(screen.getByText("Une erreur est survenue lors de la suppression.")).toBeInTheDocument();
    });
  });

  test("display error toast when delete button in modal is clicked with unauthorized response", async () => {
    mock.onGet(`/users`).reply(200, JSON.stringify(users));
    mock.onDelete(`/users/1`).reply(401);

    render(<UserManager port={port} />);

    await waitFor(() => {
      let deleteButton = screen.getAllByText("Delete").pop();
      expect(deleteButton).toBeInTheDocument();
  
      fireEvent.click(deleteButton);
    });

    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "test123" },
    });

    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(screen.getByText("Le mot de passe que vous avez saisi(e) est incorrect.")).toBeInTheDocument();
    });
  });
});
