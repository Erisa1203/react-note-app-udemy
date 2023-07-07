import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import "./Login.css"
import { Link, useNavigate } from "react-router-dom";

function Login({setIsAuth}) {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
        localStorage.setItem("isAuth", true);
        setIsAuth(true);
        navigate("/");
      }).catch((error) => {
        console.error(error);
      });
    
  }

  const handleEmailPasswordLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user);
        localStorage.setItem("isAuth", true);
        setIsAuth(true);
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className='login'>
      <h2 className='login__title'>ログイン</h2>
      <div className="login-with-email">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className='btn btn--login' onClick={handleEmailPasswordLogin}>ログイン</button>
      </div>
      <div className="login-with-other-method">
      <h2 className='login__title--small'>別の方法でログイン</h2>
        <button className='btn btn--google' onClick={handleGoogleLogin}>Googleでサインイン</button>
      </div>
      <p className='no-account'>アカウントをお持ちでないですか？<Link to="/signup" className='btn btn--newaccount'>新規アカウントを作成する</Link></p>
    </div>
  );
}

export default Login;
