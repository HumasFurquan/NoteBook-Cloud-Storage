import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Signup.css';

const Signup = ({ showAlert }) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = credentials;

    if (password !== cpassword) {
      showAlert("Passwords do not match", "danger");
      return;
    }

    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const json = await response.json();
    if (json.success) {
      localStorage.setItem('token', json.authToken);
      showAlert("Account Created Successfully", "success");
      navigate("/");
    } else {
      showAlert("Invalid Details", "danger");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="signup-container">
      <h2>Create an account to use iNotebook</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={credentials.name} onChange={onChange} placeholder="Enter your name" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input type="email" id="email" name="email" value={credentials.email} onChange={onChange} placeholder="Enter your email" required />
          <small className="form-text">We'll never share your email with anyone else.</small>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={credentials.password} onChange={onChange} placeholder="Enter password" minLength={5} required />
        </div>

        <div className="form-group">
          <label htmlFor="cpassword">Confirm Password</label>
          <input type="password" id="cpassword" name="cpassword" value={credentials.cpassword} onChange={onChange} placeholder="Confirm password" minLength={5} required />
        </div>

        <button type="submit" className="signup-btn">Submit</button>
      </form>
    </div>
  );
};

export default Signup;
