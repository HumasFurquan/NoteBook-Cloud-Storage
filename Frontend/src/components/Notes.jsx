import React, { useContext, useEffect, useState } from 'react';
import noteContext from "../context/notes/noteContext";
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';
import './Notes.css';

const Notes = ({ showAlert }) => {
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  const navigate = useNavigate();

  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getNotes();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const updateNote = (note) => {
    setEditingNote({ ...note });
  };

  const handleChange = (e) => {
    setEditingNote({ ...editingNote, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    editNote(editingNote._id, editingNote.title, editingNote.description, editingNote.tag);
    showAlert("Updated Successfully", "success");
    setEditingNote(null); // close modal
  };

  const closeModal = () => {
    setEditingNote(null);
  };

  return (
    <div className="notes-container">
      <AddNote showAlert={showAlert} />

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Note</h3>
            <form className="notes-form" onSubmit={(e) => e.preventDefault()}>
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={editingNote.title}
                onChange={handleChange}
                minLength={5}
                required
              />

              <label>Description</label>
              <input
                type="text"
                name="description"
                value={editingNote.description}
                onChange={handleChange}
                minLength={5}
                required
              />

              <label>Tag</label>
              <input
                type="text"
                name="tag"
                value={editingNote.tag}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button type="button" className="close-btn" onClick={closeModal}>Close</button>
                <button
                  type="button"
                  className="save-btn"
                  disabled={editingNote.title.length < 5 || editingNote.description.length < 5}
                  onClick={handleUpdate}
                >
                  Update Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="notes-list">
        <h2>Your Notes</h2>
        {Array.isArray(notes) && notes.length === 0 && (
          <p className="no-notes">No notes to display</p>
        )}
        <div className="notes-grid">
          {Array.isArray(notes) && notes.map((note) => (
            <Noteitem
              key={note._id}
              note={note}
              updateNote={updateNote}
              showAlert={showAlert}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;
