import { useState, useEffect } from "react";
import axios from "axios";
import Router, { withRouter } from "next/router";
import Layout from "../../../../components/Layout";
import {
  showSuccessMessage,
  showErrorMessage,
} from "../../../../helpers/alert";
import jwt from "jsonwebtoken";

const Reset = ({ router }) => {
  const [state, setState] = useState({
    name: "",
    newPassword: "",
    token: "",
    buttonText: "Reset password",
    success: "",
    error: "",
  });

  const { newPassword, name, token, buttonText, success, error } = state;

  useEffect(() => {
    const routerId = router.query.id;
    const decoded = jwt.decode(routerId);
    console.log(decoded);

    if (decoded) {
      setState({ ...state, name: decoded.name, token: routerId });
    }
  }, [router]);

  const handleChange = (e) => {
    // e.preventDefault();
    setState({ ...state, newPassword: e.target.value, error: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Changing" });

    try {
      const response = await axios.put(`${process.env.API}/reset-password`, {
        resetPasswordLink: token,
        newPassword,
      });
      setState({
        ...state,
        newPassword: "",
        buttonText: "Changed",
        success: response.data.message,
      });
    } catch (error) {
      console.log(error);
      setState({
        ...state,
        buttonText: "Reset password",
        error: error.response.data.error,
      });
    }
  };

  const passwordResetForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            onChange={handleChange}
            value={newPassword}
            placeholder="New password"
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
          <h1>Hello {name}! Ready to reset your password?</h1>
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          <br />
          {passwordResetForm()}
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(Reset);
