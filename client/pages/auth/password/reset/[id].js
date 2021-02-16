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
    buttonText: "Zresetuj",
    success: "",
    error: "",
    isDisabled: false,
  });

  const {
    newPassword,
    name,
    token,
    buttonText,
    success,
    error,
    isDisabled,
  } = state;

  useEffect(() => {
    const routerId = router.query.id;
    const decoded = jwt.decode(routerId);

    if (decoded) {
      setState({ ...state, name: decoded.name, token: routerId });
    }
  }, [router]);

  const handleChange = (e) => {
    setState({ ...state, newPassword: e.target.value, error: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Resetuje...", isDisabled: true });

    try {
      const response = await axios.put(`${process.env.API}/reset-password`, {
        resetPasswordLink: token,
        newPassword,
      });
      setState({
        ...state,
        newPassword: "",
        buttonText: "Zresetuj",
        isDisabled: false,
        success: response.data.message,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Zresetuj",
        isDisabled: false,
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
            placeholder="Hasło"
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
          <h1>Cześć {name}! Zresetuj swoje hasło.</h1>
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
