import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProviderDashboard } from "../../api/api";
import { useLanguage } from "../../context/LanguageContext";
import ProviderNav from "../../components/ProviderNav";
import "../../styles/provider.css";

function PrestataireDashboard() {
  const { t } = useLanguage();
  const [dashboard, setDashboard] = useState({ services: 0, notifications: 0, wallet: { solde: 0, devise: "MGA" } });
  const user = JSON.parse(localStorage.getItem("utilisateur") || "null");
  const profile = JSON.parse(localStorage.getItem("prestataireProfil") || "null");
  const providerName = [user?.prenom || profile?.prenom, user?.nom || profile?.nom]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (!user?.id) return;
    getProviderDashboard(user.id)
      .then((response) => setDashboard(response.data))
      .catch(() => setDashboard({ services: 0, notifications: 0, wallet: { solde: 0, devise: "MGA" } }));
  }, [user?.id]);

  const balance = Number(dashboard.wallet?.solde || 0).toLocaleString("fr-FR");

  return (
    <div className="provider-page">
      <ProviderNav />
      <main className="provider-dashboard">
        <section className="provider-welcome"><div><p className="eyebrow">{t.providerSpace}</p><h1>{t.hello}{providerName ? `, ${providerName}` : ""} 👋</h1><p>{t.providerWelcome}</p></div><Link className="provider-primary" to="/prestataire/profil">{t.completeProfile}</Link></section>
        <section className="provider-stats" aria-label={t.activitySummary}>
          <Link className="provider-stat" to="/prestataire/services"><span>{t.publishedServices}</span><strong>{dashboard.services}</strong><small>{t.viewServices} →</small></Link>
          <Link className="provider-stat" to="/prestataire/notifications"><span>{t.newContacts}</span><strong>{dashboard.notifications}</strong><small>{t.viewNotifications} →</small></Link>
          <Link className="provider-stat" to="/prestataire/portefeuille"><span>{t.availableBalance}</span><strong>{balance} {dashboard.wallet?.devise || "MGA"}</strong><small>{t.openWallet} →</small></Link>
        </section>
        <section className="provider-next"><div><p className="eyebrow">{t.doNow}</p><h2>{t.presentActivity}</h2><p>{t.profileValidationText}</p></div><Link className="provider-secondary" to="/prestataire/profil">{t.viewProfileStatus}</Link></section>
      </main>
    </div>
  );
}

export default PrestataireDashboard;
