import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getServiceById, payService } from "../../api/api";
import { useLanguage } from "../../context/LanguageContext";
import { translateCategory } from "../../i18n";
import "../../styles/details.css";
import logo from "../../assets/logo service.jpg";
import ispmLogo from "../../assets/logo ispm.jpg";

function ServiceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t, locale, setLocale } = useLanguage();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getServiceById(id)
      .then((response) => setService(response.data))
      .catch((error) => { console.error(error); setService(null); })
      .finally(() => setLoading(false));
  }, [id]);

  const demanderService = async () => {
    const utilisateur = JSON.parse(localStorage.getItem("utilisateur") || "null");
    if (!utilisateur?.id) { alert(t.loginRequired); navigate("/login"); return; }
    setIsProcessing(true);
    try {
      const response = await payService({
        client_id: utilisateur.id,
        prestataire_id: service.prestataire_id,
        service_id: service.id,
        montant: service.prix,
        description: `Paiement du service : ${service.nom}`
      });
      const { commission_admin, montant_prestataire } = response.data.data;
      alert(`${t.paymentSuccess}\n${t.price} : ${service.prix.toLocaleString("fr-FR")} Ar\n${t.admin} (20%) : ${Number(commission_admin).toLocaleString("fr-FR")} Ar\n${t.provider} (80%) : ${Number(montant_prestataire).toLocaleString("fr-FR")} Ar`);
      navigate("/client/demandes");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || t.paymentError);
    } finally { setIsProcessing(false); }
  };

  if (loading) return <div className="page-container"><h2>{t.loadingPage}</h2></div>;
  if (!service) return <div className="page-container"><h2>{t.serviceNotFound}</h2></div>;

  return (
    <div className="client-page">
      <nav className="client-topbar">
        <div className="brand-logos"><img className="ispm-logo" src={ispmLogo} alt="ISPM" /><img className="client-brand-logo" src={logo} alt="Service Local Madagascar" /></div>
        <div className="client-top-links">
          <Link to="/accueil">{t.home}</Link><Link to="/client/services">{t.services}</Link><Link to="/client/profil">{t.profil}</Link><Link to="/client/demandes">{t.demandes}</Link><Link to="/client/notifications">{t.notifications}</Link><Link to="/client/porteFeuille">{t.portefeuille}</Link>
          <div className="language-switcher">{["fr","mg","en"].map((key)=><button key={key} type="button" className={`lang-btn ${locale===key?"active":""}`} onClick={()=>setLocale(key)}>{key.toUpperCase()}</button>)}</div>
        </div>
      </nav>
      <div className="details-page"><div className="details-card">
        <h1>{service.nom}</h1>
        <p><strong>{t.provider}</strong> {service.prestataire}</p>
        <p><strong>{t.category}</strong> {translateCategory(service.categorie, t)}</p>
        <p>📍 <strong>{t.city}</strong> {service.ville}</p>
        <hr />
        <h2>{t.serviceDescription}</h2><p>{service.description}</p>
        <h2 className="price">{service.prix.toLocaleString("fr-FR")} Ar</h2>
        <button className="btn-primary" onClick={demanderService} disabled={isProcessing}>{isProcessing ? t.paymentInProgress : t.requestThisService}</button>
      </div></div>
    </div>
  );
}
export default ServiceDetails;
