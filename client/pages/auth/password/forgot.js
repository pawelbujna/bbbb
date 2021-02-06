import { useState } from "react";
import axios from "axios";
import Layout from "../../../components/Layout";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alert";

const Forgot = () => {
  const [state, setState] = useState({
    email: "",
    buttonText: "Forgot password",
    success: "",
    error: "",
  });

  const { email, buttonText, success, error } = state;

  const handleChange = (e) => {
    // e.preventDefault();
    setState({ ...state, email: e.target.value, error: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${process.env.API}/forgot-password`, {
        email,
      });
      setState({
        ...state,
        email: "",
        buttonText: "Done",
        success: response.data.message,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Forgot password",
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
          <button className="btn btn-outline-warning" type="submit">
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
          <h1>Forgot Password</h1>
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
