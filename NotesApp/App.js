import { useState } from "react";
import "./App.css";

import Header from "./component/Header";
import NoteForm from "./component/NoteForm";
import NoteList from "./component/NoteList";


function App() {

  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  // Add Note
  const addNote = () => {

    if (note.trim() === "") return;

    setNotes([...notes, note]);

    setNote("");
  };

  // Delete Note
  const deleteNote = (index) => {

    const updatedNotes = notes.filter((_, i) => i !== index);

    setNotes(updatedNotes);
  };

  return (

    <div className="app">

      <Header />

      <NoteForm
        note={note}
        setNote={setNote}
        addNote={addNote}
      />

      <NoteList
        notes={notes}
        deleteNote={deleteNote}
      />

    </div>
  );
}

export default App;



