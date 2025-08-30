import { useState } from "react";
import NoteContext from "./noteContext";

export default function NoteState({ children }) {
  const [notes, setNotes] = useState([]);
  const host = "http://localhost:5000";
  const token = () => localStorage.getItem('token');

  // mock functions (no backend yet) (no backend when we created this project and just put const getNotes = () => {} and others also like this only but now (you can see now on right)) // now we have backend after making backend and now we have connected backend with frontend.
  const getNotes = async () => {
    const res = await fetch(`${host}/api/notes/fetchallnotes`, {
      headers: { 'Content-Type':'application/json', 'auth-token': token() }
    });
    const data = await res.json();
    setNotes(Array.isArray(data) ? data : (Array.isArray(data.notes) ? data.notes : []));
  };

  const addNote = async (title, description, tag) => {
    const res = await fetch(`${host}/api/notes/addnote`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'auth-token': token() },
      body: JSON.stringify({ title, description, tag })
    });
    const note = await res.json();
    setNotes(prev => Array.isArray(prev) ? prev.concat(note) : [note]);
  };

  const deleteNote = async (id) => {
    await fetch(`${host}/api/notes/deletenote/${id}`, {
      method:'DELETE',
      headers:{ 'Content-Type':'application/json', 'auth-token': token() }
    });
    setNotes(prev => prev.filter(n => n._id !== id));
  };

  const editNote = async (id, title, description, tag) => {
    await fetch(`${host}/api/notes/updatenote/${id}`, {
      method:'PUT',
      headers:{ 'Content-Type':'application/json', 'auth-token': token() },
      body: JSON.stringify({ title, description, tag })
    });

    // optimistic update
    setNotes(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const idx = copy.findIndex(n => n._id === id);
      if (idx !== -1) {
        copy[idx].title = title;
        copy[idx].description = description;
        copy[idx].tag = tag;
      }
      return copy;
    });
  };

  return (
    <NoteContext.Provider value={{ notes, getNotes, addNote, editNote, deleteNote }}>
      {children}
    </NoteContext.Provider>
  );
}
