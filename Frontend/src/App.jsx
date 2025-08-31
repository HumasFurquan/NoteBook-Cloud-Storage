import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import NoteState from "./context/notes/NoteState";
import Navbar from "./components/Navbar";
import Alert from "./components/Alert";
import Home from "./components/Home"
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MediaUpload from "./components/Upload";


export default function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 2000);
  };

  return (
    <NoteState>
      <Router>
        <Navbar />
        <Alert alert={alert} />
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home showAlert={showAlert} />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login showAlert={showAlert} />} />
            <Route path="/signup" element={<Signup showAlert={showAlert} />} />
            <Route path="/media" element={<MediaUpload />} />
          </Routes>
        </div>
      </Router>
    </NoteState>
  );
}
