import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ files = [], onChange }) => {
  const [data, setData] = useState(files);

  const onDelete = (path) => {
    const newFilesArr = data.filter((item) => item.path !== path);
    setData(newFilesArr);
  };

  const onDrop = useCallback((acceptedFiles) => {
    setData(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    onChange(data);
  }, [data]);

  useEffect(() => {
    setData(files);
  }, [files]);

  return (
    <>
      <div
        {...getRootProps({
          style: {
            cursor: "pointer",
            height: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderStyle: "dashed !important",
            borderWidth: "2px !important",
          },
          className: "border rounded mb-3",
        })}
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <span>Upuść pliki tutaj</span>
        ) : (
          <span>Upuśc pliki lub kliknij by dodac</span>
        )}
      </div>

      <div>
        {data.map((file, index) => (
          <div
            key={index}
            className="alert alert-warning alert-dismissible"
            role="alert"
          >
            <strong>{file.path}</strong>

            <button
              type="button"
              className="close"
              onClick={() => {
                onDelete(file.path);
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dropzone;
