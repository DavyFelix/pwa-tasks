import { useState } from "react";
import { register as registerWithFirebase } from "./utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // pode reaproveitar o mesmo CSS do login

function Register() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      await registerWithFirebase(form.email, form.password);
      navigate("/app"); // redireciona depois do cadastro
    } catch (err) {
      setError(err.message || "Erro ao registrar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Criar Conta ✨</h2>
        <p className="login-subtitle">Preencha os dados abaixo</p>

        <form onSubmit={handleRegister} className="login-form">
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

          <input
            type="password"
            name="confirm"
            placeholder="Confirmar senha"
            value={form.confirm}
            onChange={handleChange}
            required
            aria-label="Confirmar senha"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

        <p className="register-text">
          Já tem conta? <Link to="/">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
