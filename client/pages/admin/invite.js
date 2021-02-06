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
    buttonText: "Send",
  });

  const { email, error, success, buttonText } = state;

  const handleChange = (name) => (e) => {
    setState({ ...state, [name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setState({ ...state, buttonText: "Creating" });

    try {
      const response = await axios.post(`${process.env.API}/invite`, { email });

      setState({
        ...state,
        email: "",
        error: "",
        success: `Invitation for ${response.data.name} has been sent`,
      });
    } catch (error) {
      setState({
        ...state,
        success: "",
        buttonText: "Create",
        error: error.response.data.error,
      });
    }
  };

  const inviteForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            type="email"
            className="form-control"
            onChange={handleChange("email")}
            value={email}
            required
          />
        </div>

        <div>
          <button type="submit" className="btn btn-outline-warning">
            {buttonText}
          </button>
        </div>
      </form>
    );
  };

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <h1>Send invitation</h1>

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
