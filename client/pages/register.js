import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import Router from "next/router";

import { isAuth } from "../helpers/auth";

import { showSuccessMessage, showErrorMessage } from "../helpers/alert";

const Register = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: "",
    buttonText: "Register",
  });

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Register",
    });
  };

  const { name, email, password, error, success, buttonText } = state;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setState({ ...state, buttonText: "Registering" });

    try {
      const response = await axios.post(`${process.env.API}/register`, {
        name,
        email,
        password,
      });

      setState({
        ...state,
        name: "",
        email: "",
        password: "",
        buttonText: "Submitted",
        success: response.data.message,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Register",
        error: error.response.data.error,
      });
    }
  };

  const registerForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={name}
            type="text"
            className="form-control"
            placeholder="Name"
            onChange={handleChange("name")}
            required
          />
        </div>

        <div className="form-group">
          <input
            value={email}
            type="email"
            className="form-control"
            placeholder="Email"
            onChange={handleChange("email")}
            required
          />
        </div>

        <div className="form-group">
          <input
            value={password}
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={handleChange("password")}
            required
          />
        </div>

        <div className="form-group">
          <button className="btn btn-outline-warning" type="submit">
            {buttonText}
          </button>
        </div>
      </form>
    );
  };

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <h1>Register</h1>

        <br />

        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}

        {registerForm()}
      </div>
    </Layout>
  );
};

export default Register;
