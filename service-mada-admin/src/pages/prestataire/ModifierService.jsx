import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

function ModifierService() {
  const { t } = useLanguage();
  const [nom, setNom] = useState("Création de site web");
  const [prix, setPrix] = useState("150000");
  const [description, setDescription] = useState(
    "Création de sites web modernes."
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t.serviceUpdated);
  };

  return (
    <div className="form-page">
      <h1>{t.modifyService}</h1>

      <form onSubmit={handleSubmit} className="form-card">

        <label>{t.serviceName}</label>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <label>{t.priceMGA}</label>
        <input
          type="number"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
        />

        <label>{t.description}</label>
        <textarea
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" className="btn-primary">
          {t.save}
        </button>

      </form>
    </div>
  );
}

export default ModifierService;