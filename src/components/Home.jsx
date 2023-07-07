import React from 'react'
import './Home.css';
import Sidebar from './Sidebar';
import Main from './Main';
import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import uuid from 'react-uuid';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

const Home = ({isAuth, setIsAuth}) => {
  const [notes, setNotes] = useState([])
  const [activeNote, setActiveNote] = useState(false)
  const postsCollectionRef = collection(db, "notes");
  const navigate = useNavigate();

  if(!isAuth) {
    navigate("/login");
  }

  const onAddNote = async () => {
    const newNote = {
      id: uuid(),
      title: "新しいノート",
      content: "新しいノートの内容",
      modDate: Date.now(),
      userId: auth.currentUser.uid 
    }
    setNotes([...notes, newNote])
    try {
      await setDoc(doc(postsCollectionRef, newNote.id), newNote);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
    
  const handleDelete = async (id) => {
    const newNotes = notes.filter((note) => note.id !== id)
    setNotes(newNotes)
    await deleteDoc(doc(db, "notes", id))
  }

  const getActiveNote = () => {
    return notes.find((note) => note.id === activeNote)
  }

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArray = notes.map((note) => {
      if(note.id === updatedNote.id) {
        return updatedNote
      } else {
        return note
      }
    })
    setNotes(updatedNotesArray)
  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getPosts(user.uid);
      } else {
        navigate("/login");
      }
    });

    return unsubscribe;  // コンポーネントがアンマウントされた時にリスナーを解除します
  }, []);

  const getPosts = async (uid) => {
    const data = await getDocs(query(collection(db, "notes"), where("userId", "==", uid)));
    const notesData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    notesData.sort((a, b) => b.modDate - a.modDate);
    setNotes(notesData);
    if (notesData.length > 0) {
      setActiveNote(notesData[0].id);
    }
  };


  return (
    <div className="Home">
      <Sidebar
        onAddNote={onAddNote} 
        setNotes={setNotes} 
        notes={notes} 
        handleDelete={handleDelete} 
        activeNote={activeNote}
        setActiveNote={setActiveNote}
        setIsAuth={setIsAuth}
      />
      <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote}/>
    </div>
  )
}

export default Home
