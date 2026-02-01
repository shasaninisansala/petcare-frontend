import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RegisterPage from "./pages/Register";
import RegisterPageStep2 from "./pages/Register2";
import LoginPage from "./pages/Login";
import { Toaster } from "react-hot-toast";
import AboutUsPage from "./pages/AboutUs";
import DonatePage from "./pages/Donation";


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
        <Route path="/about" element={<AboutUsPage />}/>
        <Route path="/donate" element={<DonatePage/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
