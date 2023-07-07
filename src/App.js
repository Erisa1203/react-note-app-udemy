import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"
import Home from './components/Home';
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { useState } from "react";

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth") === "true");


  return (
    
    <Router>
      {/* <Navbar isAuth={isAuth} /> */}
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} setIsAuth={setIsAuth}/>}></Route>
        <Route path="/login" element={<Login setIsAuth={setIsAuth}/>}></Route>
        <Route path="/signup" element={<SignUp setIsAuth={setIsAuth}/>}></Route>
        {/* <Route path="/login" element={<Login setIsAuth={setIsAuth} />}></Route> */}
        {/* <Route path="/logout" element={<Logout setIsAuth={setIsAuth}/>}></Route> */}
      </Routes>
    </Router>
  );
}

export default App;
