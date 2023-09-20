import React, { useEffect, useState } from "react"
import './App.css'
import 'react-mde/lib/styles/css/react-mde-all.css';
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { nanoid } from "nanoid"

export default function App() {
  const [notes, setNotes] = useState(
    JSON.parse(localStorage.getItem("notes")) || []
  )
  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0]?.id) || ""
  )

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  const currentNote =
    notes.find(note => note.id === currentNoteId)
    || notes[0]

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }

  function deleteNote(event, noteId) {
    event.stopPropagation()
    setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
  }

  function updateNote(text) {
    setNotes(oldNotes => {
      const noteArray = []
      for (let i = 0; i < oldNotes.length; i++) {
        const oldNote = oldNotes[i]
        if (oldNote.id === currentNoteId) {
          noteArray.unshift({ ...oldNote, body: text })
        } else {
          noteArray.push(oldNote)
        }
      }
      return noteArray
    })
  }

  return (
    <main className="container">
      {
        notes.length > 0
          ?
          <Split
            sizes={[30, 70]}
            direction="horizontal"
            className="split"
          >
            <Sidebar
              notes={notes}
              currentNote={currentNote}
              setCurrentNoteId={setCurrentNoteId}
              newNote={createNewNote}
              deleteNote={deleteNote}
            />
            {
              currentNoteId &&
              notes.length > 0 &&
              <Editor
                currentNote={currentNote}
                updateNote={updateNote}
              />
            }
          </Split>
          :
          <div className="no-notes">
            <h1>You have no notes</h1>
            <button
              className="first-note"
              onClick={createNewNote}
            >
              Create one now
            </button>
          </div>

      }
    </main>
  )
}
