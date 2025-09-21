import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // 👈 IMPORTANTE
import "./index.css";
import App from "./App.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/app" element={<App />} />
    <Route path="register" element={<Register />} />
  </Routes>
</BrowserRouter>
  </StrictMode>
);