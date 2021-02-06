import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.bubble.css";

const Editor = ({ label, onChange, value }) => {
  return (
    <div className="form-group">
      <label className="text-muted">{label}</label>

      <ReactQuill
        value={value}
        onChange={onChange}
        theme="bubble"
        className="pb-5 mb-3 border"
      />
    </div>
  );
};

export default Editor;
