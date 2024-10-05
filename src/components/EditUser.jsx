import React, { useState } from "react";
import { toast } from "react-toastify"; 
import axios from "axios";

const EditUser = ({ user, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    street: user.address.street,
    city: user.address.city,
    company: user.company.name,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update user in localStorage
    const updatedUser = {
      ...user,
      ...formData,
      address: {
        street: formData.street,
        city: formData.city,
      },
      company: {
        name: formData.company,
      },
    };

    // Update localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    onUpdate(updatedUser);

    // Simulate API update
    try {
      const response = await axios.put(
        `https://jsonplaceholder.typicode.com/users/${user.id}`,
        updatedUser
      );
      console.log("User updated successfully:", response.data);
      toast.success("User updated successfully!"); 
    } catch (error) {
      console.error("Error updating user:", error);
    //   toast.error("Failed to update user. Please try again."); 
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
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
          <button type="submit">Update User</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
