import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getServices } from "../../api/api";
import { useLanguage } from "../../context/LanguageContext";
import { translateCategory } from "../../i18n";
import ClientNav from "../../components/ClientNav";
import "../../styles/services.css";

function Services() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [recherche, setRecherche] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((response) => setServices(response.data || []))
      .catch((error) => {
        console.error("Erreur chargement services :", error);
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const servicesFiltres = services.filter((service) =>
    service.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    (service.categorie || "").toLowerCase().includes(recherche.toLowerCase()) ||
    (service.ville || "").toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="client-page">
      <ClientNav />

      <div className="page-container">

      <h1>{t.findService}</h1>
      <p>{t.discoverProvider}</p>

      <div className="search-box">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />

        <button className="btn-primary">
          {t.search}
        </button>
      </div>

      <div className="service-grid">

        {loading ? (
          <p>Chargement des services...</p>
        ) : servicesFiltres.length === 0 ? (
          <p className="no-result">{t.noResult}</p>
        ) : (
          servicesFiltres.map((service) => (
            <div className="service-card" key={service.id}>
              <h2>{service.nom}</h2>

              <p>
                <strong>{t.provider}</strong>{" "}
                {service.prestataire}
              </p>

              <p>
                <strong>{t.category}</strong>{" "}
                {translateCategory(service.categorie, t)}
              </p>

              <p>
                📍 {service.ville}
              </p>

              <h3>{service.prix}</h3>

              <button
                className="btn-primary"
                onClick={() => navigate(`/client/service/${service.id}`)}
              >
                Voir le service
              </button>
            </div>
          ))
        )}

      </div>

      </div>
    </div>
  );
}

export default Services;
