import { useState } from "react";
import axios from "axios";

import Layout from "../../../components/Layout";
import Editor from "../../../components/Editor";
import Dropzone from "../../../components/Dropzone";
import withAdmin from "../../withAdmin";

import { showSuccessMessage, showErrorMessage } from "../../../helpers/alert";

const Create = ({ token }) => {
  const [state, setState] = useState({
    name: "",
    error: "",
    success: "",
    files: [],
    buttonText: "Stwórz",
    isDisabled: false,
  });

  const [content, setContent] = useState("");

  const { name, error, success, files, buttonText, isDisabled } = state;

  const handleFiles = (files) => {
    setState({ ...state, files });
  };

  const handleChange = (name) => (e) => {
    setState({
      ...state,
      [name]: e.target.value,
      error: "",
      success: "",
    });
  };

  const handleContent = (e) => {
    setContent(e);
    setState({ ...state, success: "", error: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setState({ ...state, buttonText: "Tworze...", isDisabled: true });
    const data = new FormData();

    data.append("name", name);
    data.append("content", content);

    if (files) {
      files.forEach((file, index) => {
        data.append("files", files[index], files[index].name);
      });
    }

    try {
      const response = await axios.post(`${process.env.API}/article`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setState({
        ...state,
        name: "",
        files: [],
        buttonText: "Stwórz",
        success: `Stworzono ogłoszenie ${response.data.name}`,
        isdisabled: false,
      });

      setContent("");
    } catch (error) {
      setState({
        ...state,
        buttonText: "Stwórz",
        isDisabled: false,
        error: error.response.data.error,
      });
    }
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          onChange={handleChange("name")}
          value={name}
          placeholder="Tytuł"
          required
        />
      </div>

      <div>
        <Editor onChange={handleContent} value={content} label="Treść" />
      </div>

      <div>
        <Dropzone onChange={handleFiles} files={files} />
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

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Dodaj ogłoszenie</h1>

          <br />

          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}

          {createCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

export default Create;

export const getServerSideProps = withAdmin();
