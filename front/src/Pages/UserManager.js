import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import Form from "../Components/Form/Form";

/**
 * Functional component representing a user manager.
 * @param {Object} props - Props for the component.
 * @param {number} props.port - The port number for the API endpoint.
 * @returns {JSX.Element} JSX representing the user manager.
 */
function UserManager({ port }) {
  /**
   * State hook to manage the number of users.
   * @type {[number, function]} Array containing the user count and its updater function.
   */
  let [userCount, setUserCount] = useState(0);

  /**
   * State hook to manage the list of users.
   * @type {[Array, function]} Array containing the user list and its updater function.
   */
  let [userList, setUserList] = useState([]);

  /**
   * State hook to manage the modal visibility.
   * @type {[boolean, function]} Array containing the modal visibility state and its updater function.
   */
  let [showModal, setShowModal] = useState(false);

  /**
   * State hook to manage the password for user deletion.
   * @type {[string, function]} Array containing the delete password and its updater function.
   */
  let [deletePswd, setDeletePswd] = useState("");

  /**
   * State hook to manage the selected user ID for deletion.
   * @type {[string, function]} Array containing the selected user ID and its updater function.
   */
  let [selectedUserId, setSelectedUserId] = useState();

   /**
   * State hook to manage the current port.
   * @type {[number, function]} Array containing the current port and its updater function.
   */
  let [currentPort, setCurrentPort] = useState(0);

   /**
   * Axios instance for API calls.
   * @type {Object}
   */
  const api = axios.create({
    baseURL: `http://localhost:${port}`,
  });

  /**
   * Effect hook to fetch users data from the backend.
   */
  useEffect(() => {
    /**
     * Function to fetch users data.
     */
    const getUsers = () => {
      api
        .get(`/users`)
        .then((response) => {
          setUserList(response.data);
          setUserCount(response.data.length);
        })
        .catch((error) => {
          toast.error(
            "Une erreur est survenue lors de la récupération des utilisateurs."
          );
          console.error(error);
        });
    };

    if (currentPort !== port) {
      setCurrentPort(port);
      getUsers();
    }
  }, [currentPort, port, api]);

  /**
   * Function to open the delete user modal.
   * @param {string} userId - The ID of the user to delete.
   */
  const handleOpenModal = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  /**
   * Function to close the delete user modal.
   */
  const handleCloseModal = () => {
    setSelectedUserId("");
    setShowModal(false);
  };

  /**
   * Handler function for the delete password input change event.
   * @param {Object} e - The event object.
   */
  const handleDeletePswd = (e) => {
    setDeletePswd(e.target.value);
  };

  /**
   * Function to handle user deletion.
   */
  const onDelete = function () {
    api
      .delete(`/users/${selectedUserId}`, {
        data: { delete_pswd: deletePswd },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        toast.success(response.data);
      })
      .catch((error) => {
        let errorMsg = "Une erreur est survenue lors de la suppression.";

        if (error.response.status === 401) {
          errorMsg = "Le mot de passe que vous avez saisi(e) est incorrect.";
        }
        toast.error(errorMsg);
        console.error(error);
      });

    handleCloseModal();
  };

  return (
    <div>
      <h1>User manager</h1>
      <p>{userCount} user(s) already registered</p>
      <div>
        <h2>Manage users</h2>
        <table>
          <thead>
            <tr>
              <th>Surname</th>
              <th>Name</th>
              <th>Email</th>
              <th>Birthdate</th>
              <th>City</th>
              <th>Postal Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user._id ?? user.id}>
                <td>{user.surname}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.birthDate}</td>
                <td>{user.city}</td>
                <td>{user.postalCode}</td>
                <td>
                  <button
                    type="button"
                    style={{ color: "red" }}
                    onClick={() => handleOpenModal(user._id ?? user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Form port={port} />
      <ReactModal isOpen={showModal} className="modal">
        <h1>Delete user</h1>
        <input
          id="delete-password"
          type="password"
          placeholder="password"
          value={deletePswd}
          onChange={handleDeletePswd}
        ></input>
        <button onClick={onDelete}>Confirm</button>
        <button onClick={handleCloseModal}>Cancel</button>
      </ReactModal>
    </div>
  );
}

export default UserManager;
