import { useState } from "react";
import NoteContext from "./noteContext";

export default function NoteState({ children }) {
  const [notes, setNotes] = useState([]);

  // mock functions (no backend yet)
  const getNotes = () => {};
  const addNote = () => {};
  const editNote = () => {};
  const deleteNote = () => {};

  return (
    <NoteContext.Provider value={{ notes, getNotes, addNote, editNote, deleteNote }}>
      {children}
    </NoteContext.Provider>
  );
}
