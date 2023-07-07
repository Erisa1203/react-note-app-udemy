import React from 'react'
import "./Main.css"
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { auth, db } from '../firebase'
import { doc, updateDoc } from 'firebase/firestore'

const Main = ({activeNote, onUpdateNote}) => {



  const onEditNote = async (key, value) => {
    const updatedNote = {
      ...activeNote,
      [key]: value,
      modDate: Date.now()
    }
    onUpdateNote(updatedNote)
    
    const noteRef = doc(db, "notes", activeNote.id);
    try {
      await updateDoc(noteRef, updatedNote);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }

  if(!activeNote) {
    return <div className='no-active-note'>ノートが選択されていません。</div>
  }
  
  return (
    <div className='app-main'>
      <div className="app-main-note-edit">
        <input 
          id='title' 
          type="text" 
          value={activeNote.title} 
          onChange={(e) => onEditNote("title", e.target.value)}
        />
        <textarea 
          name="" 
          id="content" 
          placeholder='ノート内容を記入' 
          value={activeNote.content}
          onChange={(e) => onEditNote("content", e.target.value)}
        ></textarea>
      </div>
      <div className="app-main-note-preview">
        <h1 className="prevoew-title">{activeNote.title}</h1>
        <ReactMarkdown className="markdown-preview">{activeNote.content}</ReactMarkdown>
      </div>
      
    </div>
  )
}

export default Main
