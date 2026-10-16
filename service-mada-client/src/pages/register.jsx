import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import { useLanguage } from "../context/LanguageContext";
import "../styles/login.css";

function Register() {
  const navigate = useNavigate();
  const { t, locale, setLocale } = useLanguage();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("client");

  const isValidPhoneNumber = (value) => {
    const cleaned = value.replace(/\s+/g, "");
    return /^(034|038|032|037)\d{7}$/.test(cleaned);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isValidPhoneNumber(telephone)) {
      alert("Le numéro doit contenir 10 chiffres et commencer par 034, 038, 032 ou 037.");
      return;
    }

    try {
      const response = await register({
        nom,
        prenom,
        email,
        telephone,
        mot_de_passe: motDePasse,
        role
      });

      localStorage.setItem("utilisateur", JSON.stringify({
        id: response.data.userId,
        nom,
        prenom,
        email,
        telephone,
        role
      }));

      alert(t.registerSuccess);
      navigate(role === "prestataire" ? "/prestataire" : "/home");

    } catch (error) {
      console.error("Erreur inscription :", error);

      alert(
        error.response?.data?.message ||
        t.registerError
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>{t.createYourAccount}</h1>
        <p>{t.joinMada}</p>

        <div className="language-switcher">{["fr","mg","en"].map(k=><button key={k} type="button" className={`lang-btn ${locale===k?"active":""}`} onClick={()=>setLocale(k)}>{k.toUpperCase()}</button>)}</div>

        <form onSubmit={handleRegister}>

          <label>{t.name}</label>
          <input
            type="text"
            placeholder={t.name}
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />

          <label>{t.firstName}</label>
          <input
            type="text"
            placeholder={t.firstName}
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />

          <label>{t.email}</label>
          <input
            type="email"
            placeholder={t.yourEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>{t.phone}</label>
          <input
            type="text"
            placeholder="034 XX XXX XX"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={10}
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

          <label>{t.im}</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="client">{t.client}</option>
            <option value="prestataire">{t.prestataire}</option>
          </select>

          <button type="submit" className="btn-primary">
            {t.register}
          </button>

        </form>

        <p>
          {t.alreadyAccount}
          <Link to="/login"> {t.login}</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;