import React, { useContext } from 'react';
import noteContext from "../context/notes/noteContext";
import './Noteitem.css';

const Noteitem = ({ note, updateNote, showAlert }) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;

  const handleDelete = () => {
    deleteNote(note._id);
    showAlert("Deleted Successfully", "success");
  };

  return (
    <div className="note-card">
      <div className="note-header">
        <h5 className="note-title">{note.title}</h5>
        <div className="note-actions">
          <i
            className="fa-regular fa-trash-can"
            onClick={handleDelete}
            title="Delete Note"
          ></i>
          <i
            className="fa-solid fa-pen-to-square"
            onClick={() => updateNote(note)}
            title="Edit Note"
          ></i>
        </div>
      </div>
      <p className="note-description">{note.description}</p>
    </div>
  );
};

export default Noteitem;
