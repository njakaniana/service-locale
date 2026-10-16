import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { translateCategory } from "../i18n";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/logo service.jpg";
import ispmLogo from "../assets/logo ispm.jpg";
import { getCategories, getServices } from "../api/api";
import "../styles/home.css";

const iconMap = {
  Beauté: "💇",
  Informatique: "💻",
  Maison: "🏠",
  Transport: "🚗",
  Restauration: "🍴",
};

function Home() {
  const navigate = useNavigate();
  const { locale, setLocale, t } = useLanguage();
  const [recherche, setRecherche] = useState("");
  const [categorieActive, setCategorieActive] = useState(t.all);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [utilisateur, setUtilisateur] = useState(() => {
    const storedUser = localStorage.getItem("utilisateur");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const [categoriesResponse, servicesResponse] = await Promise.all([
          getCategories(),
          getServices()
        ]);

        setCategories(categoriesResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error("Erreur chargement du catalogue :", error);
      }
    };

    fetchCatalog();
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm(t.confirmLogout);

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("utilisateur");
    setUtilisateur(null);
    navigate("/login");
  };

  const resultats = useMemo(() => {
    const terme = recherche.trim().toLowerCase();

    return services.filter((service) => {
      const matchesRecherche =
        !terme ||
        service.nom.toLowerCase().includes(terme) ||
        service.categorie.toLowerCase().includes(terme) ||
        service.ville.toLowerCase().includes(terme);

      const matchesCategorie =
        categorieActive === t.all || service.categorie === categorieActive;

      return matchesRecherche && matchesCategorie;
    });
  }, [recherche, categorieActive, services, t.all]);

  const afficherResultats = recherche.trim().length > 0 || categorieActive !== t.all;

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="brand-logos">
          <img className="ispm-logo" src={ispmLogo} alt="ISPM" />
          <img className="logo-image" src={logo} alt="Service Local Madagascar" />
        </div>

        <div className="nav-links">
          <Link to="/accueil">{t.home}</Link>
          <Link to="/client/services">{t.services}</Link>
          <Link to="/client/profil">{t.profil}</Link>
          <Link to="/client/demandes">{t.demandes}</Link>
          <Link to="/client/notifications">{t.notifications}</Link>
          <Link to="/client/porteFeuille">{t.portefeuille}</Link>

          <div className="language-switcher" aria-label="Choix de langue">
            {[
              ["fr", "FR"],
              ["en", "EN"],
              ["mg", "MG"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`lang-btn ${locale === key ? "active" : ""}`}
                onClick={() => setLocale(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {utilisateur ? (
            <>
              <span className="user-badge">
                {t.connecte} : {utilisateur.prenom || utilisateur.nom || "Client"}
              </span>
              <button type="button" className="btn-primary logout-btn" onClick={handleLogout}>
                {t.deconnexion}
              </button>
            </>
          ) : (
            <button type="button" className="btn-primary logout-btn" onClick={handleLogout}>
              {t.deconnexion}
            </button>
          )}
        </div>
      </nav>

      <section className="hero">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>

        <form
          className="search-box"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Barre de recherche de services"
        >
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />

          <button type="submit" className="btn-primary">
            {t.search}
          </button>
        </form>
      </section>

      <section className="categories-section">
        <h2>{t.categories}</h2>

        <div className="category-list">
          {[
            { id: "all", nom: t.all },
            ...categories
          ].map((categorie) => (
            <button
              type="button"
              key={categorie.id || categorie.nom}
              className={`category ${categorieActive === categorie.nom ? "active" : ""}`}
              onClick={() => setCategorieActive(categorie.nom)}
            >
              <span>{categorie.nom === t.all ? "📌" : iconMap[categorie.nom] || "📦"}</span>
              {translateCategory(categorie.nom, t)}
            </button>
          ))}
        </div>
      </section>

      {afficherResultats && (
        <section className="results-section" aria-live="polite">
          {resultats.length === 0 ? (
            <p className="no-result">
              {t.noResult} <strong>{recherche || categorieActive}</strong>
            </p>
          ) : (
            <div className="result-list">
              {resultats.map((service) => (
                <article
                  className="result-card"
                  key={service.id}
                  onClick={() => navigate(`/client/service/${service.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/client/service/${service.id}`)}
                >
                  <span className="tag">{translateCategory(service.categorie, t)}</span>
                  <h3>{service.nom}</h3>
                  <p>📍 {service.ville}</p>
                  <p>💰 {service.prix}</p>
                  <button type="button" className="btn-primary" onClick={(e) => { e.stopPropagation(); navigate(`/client/service/${service.id}`); }}>
                    {t.viewService}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Home;