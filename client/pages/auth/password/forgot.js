import { useState } from "react";
import axios from "axios";
import Layout from "../../../components/Layout";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alert";

const Forgot = () => {
  const [state, setState] = useState({
    email: "",
    buttonText: "Wyślij",
    success: "",
    error: "",
    isDisabled: false,
  });

  const { email, buttonText, success, error, isDisabled } = state;

  const handleChange = (e) => {
    setState({ ...state, email: e.target.value, error: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Wysyłanie...", isDisabled: true });

    try {
      const response = await axios.put(`${process.env.API}/forgot-password`, {
        email,
      });
      setState({
        ...state,
        email: "",
        buttonText: "Wyślij",
        isDisabled: false,
        success: response.data.message,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Wyślij",
        isDisabled: false,
        error: error.response.data.error,
      });
    }
  };

  const passwordForgotForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            onChange={handleChange}
            value={email}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <button
            disabled={isDisabled}
            className="btn btn-outline-warning"
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
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Zresetuj hasło</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}

          {passwordForgotForm()}
        </div>
      </div>
    </Layout>
  );
};

export default Forgot;
