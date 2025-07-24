// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";

function AppRoutes() {
  const [nickname, setNickname] = useState(() => localStorage.getItem("nickname") || "");
  const navigate = useNavigate();

  // 닉네임 변화에 따라 진입 경로 자동 이동
  useEffect(() => {
    if (!nickname) {
      navigate("/");
    } else {
      navigate("/game");
    }
  }, [nickname, navigate]);

  // Home/Game에 nickname과 setter를 props로 넘김
  return (
    <Routes>
      <Route path="/" element={<Home setNickname={setNickname} />} />
      <Route path="/game" element={<Game nickname={nickname} />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
