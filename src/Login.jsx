import { useState } from "react";
import { login as loginWithFirebase } from "./utils/firebase";
import { Link } from "react-router-dom";
import "./Login.css"; // CSS separado

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginWithFirebase(email, password);
      window.location.href = "/app";
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
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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
