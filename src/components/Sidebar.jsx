import React, { useEffect, useState } from 'react';
import "./Sidebar.css";
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { collection, doc, getDoc } from "firebase/firestore";

const Sidebar = ({ onAddNote, notes, setNotes, handleDelete, activeNote, setActiveNote, setIsAuth }) => {
  const [username, setUsername] = useState("");

  const newSortedNotes = notes.sort((a, b) => b.modDate - a.modDate);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocSnap = await getDoc(doc(db, 'users', user.uid));
          const userProfileData = userDocSnap.data();
  
          if (userProfileData) {
            setUsername(userProfileData.username);
          } else {
            // Googleのユーザー名を使用
            setUsername(user.displayName);
          }
        } catch (error) {
          console.error("ユーザープロフィールの取得中にエラーが発生しました:", error);
        }
      }
    };
  
    fetchUsername();
  }, [auth.currentUser]);
  
  

  const setUserDisplayName = (user, username) => {
    user.updateProfile({
      displayName: username
    })
      .then(() => {
        console.log("ユーザーの表示名が正常に更新されました。");
        setUsername(username);
      })
      .catch((error) => {
        console.error("ユーザーの表示名の更新中にエラーが発生しました:", error);
      });
  };

  const logout = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      navigate("/login");
    });
  };

  if (username === null) {
    return null;
  }

  return (
    <div className='app-sidebar'>
      <div className="app-sidebar-user">
        <p><span className='user-icon'>{username[0]}</span>{username}</p>
      </div>
      <div className="app-sidebar-header">
        <h1>ノート</h1>
        <button onClick={onAddNote}>追加</button>
      </div>

      <div className="app-sidebar-notes">
        {
          newSortedNotes.map((note) => (
            <div
              className={`app-sidebar-note ${note.id === activeNote && "active"}`} key={note.id} onClick={() => setActiveNote(note.id)}>
              <div className="sidebar-note-title">
                <strong>{note.title}</strong>
                <button onClick={() => handleDelete(note.id)}>削除</button>
              </div>
              <p>{note.content}</p>
              <small>{new Date(note.modDate).toLocaleString('ja-JP', {
                hour: "2-digit",
                minute: "2-digit"
              })}</small>
            </div>
          ))
        }
      </div>
      <button className="btn btn--logout" onClick={logout}>ログアウト</button>
    </div>
  );
};

export default Sidebar;
