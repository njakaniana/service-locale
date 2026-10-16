import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/logo service.jpg";
import ispmLogo from "../assets/logo ispm.jpg";

export default function ProviderNav() {
  const { t, locale, setLocale } = useLanguage();
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem("utilisateur"); navigate("/login"); };
  return <nav className="provider-nav"><Link className="provider-brand" to="/prestataire"><span className="brand-logos"><img className="ispm-logo" src={ispmLogo} alt="ISPM" /><img src={logo} alt="Service Local Madagascar" /></span><span>{t.providerSpace}</span></Link><div className="provider-links"><Link to="/prestataire">{t.home}</Link><Link to="/prestataire/services">{t.services}</Link><Link to="/prestataire/notifications">{t.notifications}</Link><Link to="/prestataire/portefeuille">{t.portefeuille}</Link><Link to="/prestataire/profil">{t.profil}</Link><div className="language-switcher" aria-label={t.language}>{["fr", "mg", "en"].map((key) => <button key={key} type="button" className={`lang-btn ${locale === key ? "active" : ""}`} onClick={() => setLocale(key)}>{key.toUpperCase()}</button>)}</div><button type="button" className="provider-logout" onClick={logout}>{t.deconnexion}</button></div></nav>;
}