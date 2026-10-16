import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/logo service.jpg";
import ispmLogo from "../assets/logo ispm.jpg";

export default function ClientNav() {
  const { t, locale, setLocale } = useLanguage();
  return (
    <nav className="client-topbar">
      <div className="brand-logos"><img className="ispm-logo" src={ispmLogo} alt="ISPM" /><img className="client-brand-logo" src={logo} alt="Service Local Madagascar" /></div>
      <div className="client-top-links">
        <Link to="/accueil">{t.home}</Link>
        <Link to="/client/services">{t.services}</Link>
        <Link to="/client/profil">{t.profil}</Link>
        <Link to="/client/demandes">{t.demandes}</Link>
        <Link to="/client/notifications">{t.notifications}</Link>
        <Link to="/client/porteFeuille">{t.portefeuille}</Link>
        <div className="language-switcher" aria-label={t.language}>
          {["fr", "mg", "en"].map((key) => (
            <button key={key} type="button" className={`lang-btn ${locale === key ? "active" : ""}`} onClick={() => setLocale(key)}>
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
