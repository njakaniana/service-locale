import  { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import ClientNav from "../../components/ClientNav";
import "../../styles/profil.css";

const getStoredClientProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("utilisateur") || "null");

  return {
    nom: storedUser?.nom || "",
    prenom: storedUser?.prenom || "",
    email: storedUser?.email || "",
    telephone: storedUser?.telephone || "",
    ville: storedUser?.ville || "Antananarivo"
  };
};

function Profil() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState(getStoredClientProfile);

  const updateField = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("utilisateur") || "null");
    localStorage.setItem("utilisateur", JSON.stringify({
      ...(storedUser || {}),
      ...formData
    }));

    alert(t.profileUpdated);
  };

  return (
    <div className="client-page">
      <ClientNav />

      <div className="form-page">

      <h1>{t.profile} 👤</h1>

      <form
        className="form-card"
        onSubmit={handleSubmit}
      >

        <label>{t.name}</label>

        <input
          value={formData.nom}
          onChange={updateField("nom")}
        />
        <label>{t.firstName}</label>

        <input
          value={formData.prenom}
          onChange={updateField("prenom")}
        />

        <label>{t.email}</label>

        <input
          type="email"
          value={formData.email}
          onChange={updateField("email")}
        />

        <label>{t.phone}</label>

        <input
          value={formData.telephone}
          onChange={updateField("telephone")}
        />

        <label>{t.city}</label>

        <input
          value={formData.ville}
          onChange={updateField("ville")}
        />

        <button className="btn-primary">
          {t.saveProfile}
        </button>

      </form>

      </div>
    </div>
  );
}

export default Profil;