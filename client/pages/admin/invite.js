import { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import withAdmin from "../withAdmin";

import { showSuccessMessage, showErrorMessage } from "../../helpers/alert";

const Invite = ({ admin, token }) => {
  const [state, setState] = useState({
    email: "",
    error: "",
    success: "",
    buttonText: "Wyślij",
    isDisabled: false,
  });

  const { email, error, success, buttonText, isDisabled } = state;

  const handleChange = (name) => (e) => {
    setState({ ...state, [name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setState({ ...state, buttonText: "Wysyłanie...", isDisabled: true });

    try {
      await axios.post(`${process.env.API}/invite`, { email });

      setState({
        ...state,
        email: "",
        error: "",
        success: `Wysłaliśmy zaproszenie na: ${email}.`,
        isDisabled: false,
      });
    } catch (error) {
      setState({
        ...state,
        success: "",
        buttonText: "Wyślij",
        error: error.response.data.error,
        isDisabled: false,
      });
    }
  };

  const inviteForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            onChange={handleChange("email")}
            value={email}
            placeholder="Email"
            required
          />
        </div>

        <div>
          <button
            disabled={isDisabled}
            type="submit"
            className="btn btn-outline-warning"
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
        <h1>Wyślij zaproszenie</h1>

        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}

        {inviteForm()}
      </div>
    </Layout>
  );
};

export default Invite;

export const getServerSideProps = withAdmin();
