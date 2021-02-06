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
    buttonText: "Create",
  });

  const [content, setContent] = useState("");

  const { name, error, success, files, buttonText } = state;

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

    setState({ ...state, buttonText: "Creating..." });

    const readFileAsDataURL = async (file) => {
      if (file) {
        return await new Promise((resolve) => {
          const reader = new FileReader();

          reader.onloadend = (e) => resolve(reader.result);

          reader.readAsDataURL(file);
        });
      }
    };

    const base64Files = [];

    for await (const base64 of files.map(readFileAsDataURL)) {
      base64Files.push(base64);
    }

    try {
      const response = await axios.post(
        `${process.env.API}/article`,
        { name, content, files: base64Files },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setState({
        ...state,
        name: "",
        files: [],
        buttonText: "Created",
        success: `${response.data.name} is created`,
        imageUploadText: "Upload image",
      });

      setContent("");
    } catch (error) {
      setState({
        ...state,
        buttonText: "Create",
        error: error.response.data.error,
      });
    }
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange("name")}
          value={name}
          required
        />
      </div>

      <div>
        <Editor onChange={handleContent} value={content} label="Content" />
      </div>

      <div>
        <Dropzone onChange={handleFiles} files={files} />
      </div>

      <div>
        <button type="submit" className="btn btn-outline-warning">
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Create category</h1>

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
