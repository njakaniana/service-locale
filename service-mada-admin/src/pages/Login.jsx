import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useLanguage } from "../context/LanguageContext";

function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, mot_de_passe: password, role: "admin" }),
      });
      const user = response.user || response;
      if (user.role !== "admin") throw new Error(t.adminOnly);
      localStorage.setItem("utilisateur", JSON.stringify(user));
      navigate("/admin", { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h1>{t.adminLogin}</h1>
        <label>{t.email}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>{t.password}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        {error && <p className="login-error">{error}</p>}
        <button className="btn-primary" type="submit" disabled={loading}>{loading ? t.loggingIn : t.login}</button>
      </form>
    </main>
  );
}

export default Login;
