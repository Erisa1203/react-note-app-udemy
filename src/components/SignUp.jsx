import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, provider } from '../firebase';
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);
  const navigate = useNavigate();

  
  const handleEmailPasswordLogin = () => {
    const loginMethod = isNewUser ? createUserWithEmailAndPassword : signInWithEmailAndPassword;
  
    loginMethod(auth, email, password)
      .then((userCredential) => {
        // Save user profile to Firestore
        if (isNewUser) {
          const userDocRef = doc(db, 'users', userCredential.user.uid);
          const userDocData = { username: username };
          setDoc(userDocRef, userDocData);
        }
  
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  }


  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const userDocRef = doc(db, 'users', result.user.uid);
        const userDocSnap = await getDoc(userDocRef);
  
        // ユーザー情報がFirestoreに存在しない場合のみ情報を保存する
        if (!userDocSnap.exists()) {
          const userDocData = { username: result.user.displayName };
          await setDoc(userDocRef, userDocData);
        }
  
        navigate("/");
      }).catch((error) => {
        console.error(error);
      });
  }

  const setUserDisplayName = (user, username) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocData = { username: username };

    setDoc(userDocRef, userDocData, { merge: true }) // If you want to merge the data with existing data
      .then(() => {
        console.log("ユーザープロフィールがFirestoreに保存されました。");
      })
      .catch((error) => {
        console.error("ユーザープロフィールの保存中にエラーが発生しました:", error);
      });
  }

  return (
    <div className='login'>
      <h2 className='login__title'>アカウント作成</h2>
      <div className="login-with-email">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {isNewUser && (
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        )}
        <button className='btn btn--login' onClick={handleEmailPasswordLogin}>アカウントを作成する</button>
      </div>
      <div className="login-with-other-method">
        <h2 className='login__title--small'>別の方法でサインイン</h2>
        <button className='btn btn--google' onClick={handleGoogleLogin}>Googleでサインイン</button>
      </div>
      <p className='no-account'>既にアカウントをお持ちの方は<Link to="/login" className='btn btn--newaccount' onClick={() => setIsNewUser(true)}>こちら</Link></p>
    </div>
  )
}

export default SignUp;
