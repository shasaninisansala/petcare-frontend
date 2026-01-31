import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RegisterPage from "./pages/Register";
import RegisterPageStep2 from "./pages/Register2";
import LoginPage from "./pages/Login";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
    <Toaster position="top-right" />
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registerlast" element={<RegisterPageStep2/>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
