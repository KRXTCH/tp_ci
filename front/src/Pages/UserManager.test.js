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

  test("display error toast when delete button in modal is clicked", async () => {
    mock.onGet(`/users`).reply(200, JSON.stringify(users));
    mock.onDelete(`/users/1`).reply(500);

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
      expect(screen.getByText("Une erreur est survenue.")).toBeInTheDocument();
    });
  });

  // test("closes modal when cancel button is clicked", async () => {
  //   mock.onGet(`http://localhost:${port}/users`).reply(200, users);

  //   render(<UserManager port={port} />);

  //   await act(async () => {
  //     fireEvent.click(screen.getByText("Delete"));
  //   });

  //   // Click the cancel button in the modal
  //   fireEvent.click(screen.getByText("Cancel"));

  //   // Check if modal is closed
  //   await waitFor(() => {
  //     expect(screen.queryByText("Delete user")).not.toBeInTheDocument();
  //   });
  // });

  // test("displays error message if user deletion fails", async () => {
  //   mock.onGet(`http://localhost:${port}/users`).reply(200, users);

  //   render(<UserManager port={port} />);

  //   // Mock the delete request to fail
  //   axios.delete.mockRejectedValueOnce(new Error("Failed to delete user"));

  //   await act(async () => {
  //     fireEvent.click(screen.getByText("Delete"));
  //   });

  //   // Enter password in the input field
  //   fireEvent.change(screen.getByPlaceholderText("password"), {
  //     target: { value: "test123" },
  //   });

  //   // Click the delete button in the modal
  //   fireEvent.click(screen.getByText("Delete"));

  //   // Wait for the delete request to complete
  //   await waitFor(() => {
  //     expect(axios.delete).toHaveBeenCalledWith("/users/1", {
  //       data: { delete_pswd: "test123" },
  //     });
  //   });

  //   // Check if error message is displayed
  //   expect(screen.getByText("Failed to delete user")).toBeInTheDocument();
  // });

  // test("opens modal when delete button is clicked for each user", async () => {
  //   mock.onGet(`http://localhost:${port}/users`).reply(200, users);

  //   render(<UserManager port={port} />);

  //   await act(async () => {
  //     fireEvent.click(screen.getByText("Delete"));
  //   });

  //   // Check if modal is opened for the first user
  //   await waitFor(() => {
  //     expect(screen.getByText("Delete user")).toBeInTheDocument();
  //   });

  //   // Close modal
  //   fireEvent.click(screen.getByText("Cancel"));

  //   // Click the delete button for the second user
  //   fireEvent.click(screen.getByText("Delete"));

  //   // Check if modal is opened for the second user
  //   await waitFor(() => {
  //     expect(screen.getByText("Delete user")).toBeInTheDocument();
  //   });
  // });
});
