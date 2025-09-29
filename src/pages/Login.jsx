import { useState } from "react";
import { login as loginWithFirebase } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginWithFirebase(form.email, form.password);
      navigate("/app"); 
    } catch (err) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Bem-vindo 👋</h2>
        <p className="login-subtitle">Entre com sua conta</p>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            aria-label="E-mail"
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            required
            aria-label="Senha"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

        <p className="register-text">
          Não tem conta? <Link to="/register">Registrar</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
