import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

function Profil() {
  const { t } = useLanguage();
  const [nom, setNom] = useState("Rakoto");
  const [prenom, setPrenom] = useState("Jean");
  const [email, setEmail] = useState("jean@email.com");
  const [telephone, setTelephone] = useState("034 00 000 00");
  const [ville, setVille] = useState("Antananarivo");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t.profileUpdated);
  };

  return (
    <div className="form-page">
      <h1>{t.profile}</h1>

      <form className="form-card" onSubmit={handleSubmit}>

        <label>{t.name}</label>
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <label>{t.firstName}</label>
        <input
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />

        <label>{t.email}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>{t.phone}</label>
        <input
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />

        <label>{t.city}</label>
        <input
          value={ville}
          onChange={(e) => setVille(e.target.value)}
        />

        <button className="btn-primary">
          {t.save}
        </button>

      </form>
    </div>
  );
}

export default Profil;
