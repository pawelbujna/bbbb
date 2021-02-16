import { useState } from "react";
import axios from "axios";

import Dropzone from "../../../components/Dropzone";
import Editor from "../../../components/Editor";
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";

import { showSuccessMessage, showErrorMessage } from "../../../helpers/alert";

const Edit = ({ token, article }) => {
  const [state, setState] = useState({
    name: article.name,
    error: "",
    success: "",
    files: article?.files || [],
    buttonText: "Create",
  });

  const [content, setContent] = useState(article.content);

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

    try {
      const response = await axios.post(
        `${process.env.API}/article`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setState({
        ...state,
        name: "",
        formData: "",
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

  const articleCategoryForm = () => (
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
          <h1>Edit category</h1>

          <br />

          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}

          {articleCategoryForm()}
        </div>
      </div>
    </Layout>
  );
};

export default Edit;

export const getServerSideProps = withAdmin(async ({ context, token }) => {
  let data;
  const id = context.query.id;

  try {
    const response = await axios.get(`${process.env.API}/article/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    data = response.data;
  } catch (error) {
    throw new Error("Something went wrong when downloading articles.");
  }

  return {
    props: {
      article: data,
    },
  };
});
