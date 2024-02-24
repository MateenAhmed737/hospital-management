import React from "react";
import ReactQuill from "react-quill";
import EditorToolbar, {
  formats,
  redoChange,
  undoChange,
} from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";

export const Editor = ({
  state,
  handleChange,
  id,
  styles = "",
  readOnly = false,
}) => {
  return (
    <div className={`${styles}`}>
      <EditorToolbar id={id} />
      <ReactQuill
        theme="snow"
        value={state}
        onChange={handleChange}
        placeholder={"Write here..."}
        modules={Editor.modules(id)}
        formats={formats}
        readOnly={readOnly}
      />
    </div>
  );
};

// Modules object for setting up the Quill editor
Editor.modules = (id) => ({
  toolbar: {
    container: "#toolbar" + id,
    handlers: {
      undo: undoChange,
      redo: redoChange,
    },
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
});

export default Editor;
