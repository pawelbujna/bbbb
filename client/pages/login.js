import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import Link from "next/link";
import axios from "axios";

import { authenticate, isAuth } from "../helpers/auth";

import { showSuccessMessage, showErrorMessage } from "../helpers/alert";

const Login = () => {
  const [state, setState] = useState({
    email: "pawel.bujna@olx.pl",
    password: "111111",
    error: "",
    success: "",
    buttonText: "Zaloguj",
    isDisabled: false,
  });

  const { email, password, error, success, buttonText, isDisabled } = state;

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
      buttonText: "Zaloguj",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setState({ ...state, buttonText: "Loguje...", isDisabled: true });

    try {
      const response = await axios.post(`${process.env.API}/login`, {
        email,
        password,
      });

      authenticate(response, () => {
        isAuth()?.role === "admin"
          ? Router.push("/admin")
          : Router.push("/articles");
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Zaloguj",
        isDisabled: false,
        error: error.response.data.error,
      });
    }
  };

  const loginForm = () => {
    return (
      <form onSubmit={handleSubmit}>
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
          <button
            disabled={isDisabled}
            className="btn btn-success"
            type="submit"
          >
            {buttonText}
          </button>
        </div>
      </form>
    );
  };

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <h1>Zaloguj</h1>

        <br />

        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}

        {loginForm()}

        <Link href="/auth/password/forgot">
          <a className="text-danger float-right">Zapomniałeś hasła?</a>
        </Link>
      </div>
    </Layout>
  );
};

export default Login;
