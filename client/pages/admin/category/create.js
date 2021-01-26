import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Resizer from "react-image-file-resizer";

import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";

import { showSuccessMessage, showErrorMessage } from "../../../helpers/alert";

// dynamic import with nextjs
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.bubble.css";

const Create = ({ token }) => {
  const [state, setState] = useState({
    name: "",
    error: "",
    success: "",
    image: "",
    buttonText: "Create",
    imageUploadText: "Upload Image",
  });

  const [imageUploadButtonName, setImageUploadButtonName] = useState(
    "Upload image"
  );

  const [content, setContent] = useState([]);

  const { name, error, success, image, buttonText } = state;

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

  const handleImage = (e) => {
    const file = e.target.files[0];

    setImageUploadButtonName(file.name);

    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        setState({ ...state, image: uri });
      },
      "base64",
      200,
      200
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setState({ ...state, buttonText: "Creating..." });

    try {
      const response = await axios.post(
        `${process.env.API}/category`,
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
        content: "",
        formData: "",
        buttonText: "Created",
        success: `${response.data.name} is created`,
        imageUploadText: "Upload image",
      });

      setImageUploadButtonName("Upload image");

      console.log("CATEGORY CREATE RESPONSE ", response);
    } catch (error) {
      console.log("CATEGORY CREATE ERROR ", error);

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

      <div className="form-group">
        <label className="text-muted">Content</label>
        {/* <textarea
          className="form-control"
          onChange={handleChange("content")}
          value={content}
          required
        /> */}

        <ReactQuill
          value={content}
          onChange={handleContent}
          theme="bubble"
          className="pb-5 mb-3"
          style={{ border: "1px solid #666" }}
        />
      </div>

      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadButtonName}

          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImage}
            required
            hidden
          />
        </label>
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
