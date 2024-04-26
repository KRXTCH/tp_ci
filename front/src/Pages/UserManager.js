import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import ReactModal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import Form from "../Components/Form/Form";

function UserManager({port}) {
  let [userCount, setUserCount] = useState(0);
  let [userList, setUserList] = useState([]);
  let [showModal, setShowModal] = useState(false);
  let [deletePswd, setDeletePswd] = useState("");
  let [selectedUserId, setSelectedUserId] = useState();

  const api = axios.create({
    baseURL: `http://localhost:${port}`,
  });

  useEffect(() => {
    async function getUsers() {
      try {
        api.get(`/users`).then((response) => {
          setUserList(response.data);
          setUserCount(response.data.length);
        });
      } catch (error) {
        console.log("Error : ", error);
      }
    }
    getUsers();
  }, [showModal]);

  const handleOpenModal = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUserId("");
    setShowModal(false);
  };

  const handleDeletePswd = (e) => {
    setDeletePswd(e.target.value);
  };

  const onDelete = function () {
    try {
      api
        .delete(`/users/${selectedUserId}`, {
          data: { delete_pswd: deletePswd },
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            toast.success(response.data);
          } else {
            toast.error(response.data);
          }
        });

      handleCloseModal();
    } catch (error) {
      console.log("Une erreur est survenue lors de la suppression : ", error);
    }
  };

  return (
    <div>
      <h1>User manager</h1>
      <p>{userCount} user(s) already registered</p>
      <div>
        <h2>Manage users</h2>
        <p>{userCount} user(s) already registered</p>
        <table>
          <thead>
            <tr>
              <th>Surname</th>
              <th>Name</th>
              <th>Email</th>
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
                <td>{user.city}</td>
                <td>{user.postalCode}</td>
                <td>
                  <button
                    type="button"
                    style={{ color: "red" }}
                    onClick={() => handleOpenModal(user._id  ?? user.id)}
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
          type="password"
          placeholder="password"
          value={deletePswd}
          onChange={handleDeletePswd}
        ></input>
        <button onClick={onDelete}>Delete</button>
        <button onClick={handleCloseModal}>Cancel</button>
      </ReactModal>
      <ToastContainer />
    </div>
  );
}

export default UserManager;
