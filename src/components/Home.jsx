import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import EditUser from "./EditUser";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const Home = () => {
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    street: "",
    city: "",
    company: "",
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (users.length === 0) {
      axios
        .get("https://jsonplaceholder.typicode.com/users")
        .then((response) => {
          setUsers(response.data);
          localStorage.setItem("users", JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("There was an error fetching the users!", error);
        });
    }
  }, [users]);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate username based on name
    if (name === "name" && value.length >= 3) {
      setFormData((prev) => ({
        ...prev,
        username: `USER-${value}`,
      }));
    }
  };

  const validateForm = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (formData.name.length < 3)
      return "Name must be at least 3 characters long.";
    if (!emailPattern.test(formData.email)) return "Invalid email format.";
    if (!phonePattern.test(formData.phone)) return "Phone must be 10 digits.";
    if (!formData.street) return "Street is required.";
    if (!formData.city) return "City is required.";
    if (formData.company && formData.company.length < 3)
      return "Company name must be at least 3 characters.";

    return null;
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError); 
      return;
    }

    const userData = {
      ...formData,
      address: {
        street: formData.street,
        city: formData.city,
      },
      company: {
        name: formData.company,
      },
      id: Date.now(),
    };

    // Add user to local state and storage
    setUsers((prevUsers) => [...prevUsers, userData]);
    toast.success("User created successfully!"); 
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      username: "",
      street: "",
      city: "",
      company: "",
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      toast.error("User deleted successfully!"); 
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      street: user.address?.street || "",
      city: user.address?.city || "",
      company: user.company?.name || "",
      username: `USER-${user.name}`,
    });
    setIsEditing(true);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setIsEditing(false);
    toast.success("User updated successfully!"); 
  };

  const handleViewDetails = (id) => {
    navigate(`/user/${id}`);
  };

  return (
    <div className="container">
      <h1>Users List</h1>
      <button
        className="btn-create"
        onClick={() => {
          resetForm();
          setIsCreating(true);
        }}
      >
        Add New User
      </button>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
                <button onClick={() => handleViewDetails(user.id)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Modal */}
      {isCreating && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New User</h2>
            <form onSubmit={handleCreateSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={3}
                />
              </label>
              <label>
                Username (auto-generated):
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  readOnly
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Phone:
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Street:
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                City:
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Company:
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                />
              </label>

              <button type="submit">Create User</button>
              <button type="button" onClick={() => setIsCreating(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && currentUser && (
        <EditUser
          user={currentUser}
          onUpdate={handleUpdateUser}
          onCancel={() => setIsEditing(false)}
        />
      )}

      <ToastContainer /> 
    </div>
  );
};

export default Home;
