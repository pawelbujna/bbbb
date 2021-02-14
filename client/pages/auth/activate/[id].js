import { withRouter } from "next/router";

import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";

import { showSuccessMessage, showErrorMessage } from "../../../helpers/alert";
import Layout from "../../../components/Layout";

const ActivateAccount = ({ router }) => {
  const [state, setState] = useState({
    name: "",
    token: "",
    buttonText: "Aktywuj",
    success: "",
    error: "",
    isDisabled: false,
  });

  const { name, token, buttonText, success, error, isDisabled } = state;

  useEffect(() => {
    let token = router.query.id;

    if (token) {
      const { name } = jwt.decode(token);

      setState({ ...state, name, token });
    }
  }, [router]);

  const clickSubmit = async (e) => {
    e.preventDefault();

    setState({
      ...state,
      buttonText: "Aktywuje...",
    });

    try {
      const response = await axios.post(
        `${process.env.API}/register/activate`,
        {
          token,
        }
      );

      setState({
        ...state,
        token: "",
        buttonText: "Aktywuj",
        success: response.data.message,
      });
    } catch (error) {
      setState({
        ...state,
        buttonText: "Aktywuj",
        success: "",
        error: error.response.data.error,
      });
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Hej {name}. Aktywuj swoje konto.</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}

          <button
            disabled={isDisabled}
            className="btn btn-outline-warning btn-block"
            onClick={clickSubmit}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
