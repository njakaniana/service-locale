import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/authApi";
import { useLanguage } from "../context/LanguageContext";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const { t, locale, setLocale } = useLanguage();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [selectedRole, setSelectedRole] = useState("client");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login({
        email,
        mot_de_passe: motDePasse,
        password: motDePasse,
        role: selectedRole
      });

      const user = response.data.user ?? response.data;
      if (user.role !== selectedRole && selectedRole !== "admin") {
        alert(`Ce compte est enregistré comme ${user.role}. Sélectionnez le bon rôle.`);
        return;
      }

      localStorage.setItem("utilisateur", JSON.stringify(user));

      if (user.role === "admin") {
        window.location.href = `${import.meta.env.VITE_ADMIN_URL || "http://localhost:5174"}/admin`;
      } else if (user.role === "prestataire") {
        navigate("/prestataire");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Erreur connexion :", error);

      alert(
        error.response?.data?.message ||
        t.loginError
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t.welcome}</h1>
        <p>{t.connectToMada}</p>

        <div className="language-switcher">{["fr","mg","en"].map(k=><button key={k} type="button" className={`lang-btn ${locale===k?"active":""}`} onClick={()=>setLocale(k)}>{k.toUpperCase()}</button>)}</div>

        <div className="role-selector">
          <button
            type="button"
            className={selectedRole === "client" ? "role-btn active" : "role-btn"}
            onClick={() => setSelectedRole("client")}
          >
            Client
          </button>
          <button
            type="button"
            className={selectedRole === "prestataire" ? "role-btn active" : "role-btn"}
            onClick={() => setSelectedRole("prestataire")}
          >
            Prestataire
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <label>{t.email}</label>
          <input
            type="email"
            placeholder={t.yourEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>{t.password}</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t.yourPassword}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit" className="btn-primary">
            {t.login}
          </button>
        </form>

        <p>
          {t.noAccount}
          <Link to="/register"> {t.createAccount}</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;