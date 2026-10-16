import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

function MesServices() {
  const { t } = useLanguage();
  const services = [
    {
      id: 1,
      nom: "Création de site web",
      categorie: "Informatique",
      prix: "150 000 Ar",
      statut: "Disponible"
    },
    {
      id: 2,
      nom: "Réparation ordinateur",
      categorie: "Informatique",
      prix: "50 000 Ar",
      statut: "Disponible"
    },
    {
      id: 3,
      nom: "Installation Windows",
      categorie: "Informatique",
      prix: "30 000 Ar",
      statut: "Indisponible"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>{t.myServices}</h1>
          <p>{t.manageServices}</p>
        </div>

        <Link to="/prestataire/services/ajouter" className="btn-primary">
          + {t.addService}
        </Link>
      </div>

      <div className="service-grid">
        {services.map((service) => (
          <div className="service-card" key={service.id}>
            <h2>{service.nom}</h2>

            <p>
              <strong>{t.categories} :</strong> {service.categorie}
            </p>

            <p>
              <strong>{t.price} :</strong> {service.prix}
            </p>

            <p>
              <strong>{t.status} :</strong> {service.statut}
            </p>

            <div className="card-actions">
              <Link
                to={`/prestataire/services/modifier/${service.id}`}
                className="btn-secondary"
              >
                {t.edit}
              </Link>

              <button className="btn-danger">
                {t.delete}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MesServices;