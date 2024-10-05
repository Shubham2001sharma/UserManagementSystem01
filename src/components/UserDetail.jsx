import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./UserDetail.css"

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate=useNavigate();

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userId = Number(id);

    const foundUser = users.find((user) => user.id === userId);

    if (foundUser) {
      setUser(foundUser);
    } else {
      setError("User not found.");
      toast.error("User not found."); 
    }
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  const Back=()=>{
navigate("/");
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>
        Address: {user.address.street}, {user.address.city}
      </p>
      <p>Company: {user.company.name}</p>

      <button onClick={Back}>Back</button>
    </div>
  );
};

export default UserDetail;
