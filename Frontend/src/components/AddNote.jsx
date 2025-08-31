import React, { useContext, useState } from 'react';
import noteContext from "../context/notes/noteContext";
import './AddNote.css';

const AddNote = ({ showAlert }) => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({ title: "", description: "", tag: "" });

  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
    showAlert("Added Successfully", "success");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div className="addnote-container">
      <h2>Add a Note</h2>
      <form className="addnote-form" onSubmit={handleClick}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={note.title}
            onChange={onChange}
            minLength={5}
            required
            placeholder="Enter title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={note.description}
            onChange={onChange}
            minLength={5}
            required
            placeholder="Enter description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tag">Tag</label>
          <input
            type="text"
            id="tag"
            name="tag"
            value={note.tag}
            onChange={onChange}
            placeholder="Enter tag"
          />
        </div>

        <button
          type="submit"
          disabled={note.title.length < 5 || note.description.length < 5}
          className="addnote-btn"
        >
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;
