import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

function AjouterService() {
  const { t } = useLanguage();
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState("");
  const [prix, setPrix] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      nom,
      categorie,
      prix,
      description
    });

    alert(t.serviceAdded);
  };

  return (
    <div className="form-page">
      <h1>{t.addService}</h1>

      <form onSubmit={handleSubmit} className="form-card">

        <label>{t.serviceName}</label>
        <input
          type="text"
          placeholder="Ex : Réparation ordinateur"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <label>{t.categories}</label>
        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          required
        >
          <option value="">{t.chooseCategory}</option>
          <option value="Beauté">Beauté</option>
          <option value="Informatique">Informatique</option>
          <option value="Maison">Maison</option>
          <option value="Transport">Transport</option>
          <option value="Restauration">Restauration</option>
        </select>

        <label>{t.priceMGA}</label>
        <input
          type="number"
          placeholder="50000"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
          required
        />

        <label>{t.description}</label>
        <textarea
          placeholder="Décrivez votre service..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
        />

        <button type="submit" className="btn-primary">
          {t.addService}
        </button>

      </form>
    </div>
  );
}

export default AjouterService;