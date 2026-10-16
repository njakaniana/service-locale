import { useEffect, useState } from "react";
import { getClientNotifications } from "../../api/api";
import ProviderNav from "../../components/ProviderNav";
import { useLanguage } from "../../context/LanguageContext";
import "../../styles/provider.css";

const getClientDetails = (message = "") => {
  const match = message.match(/^Client : (.*)\. Email : (.*)\. Téléphone : (.*)\. Service : (.*)\.$/);

  if (!match) return null;

  return {
    name: match[1],
    email: match[2],
    phone: match[3],
    service: match[4]
  };
};

export default function PrestataireNotifications() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { const user = JSON.parse(localStorage.getItem("utilisateur") || "null"); if (!user?.id) { setLoading(false); return; } getClientNotifications(user.id).then((response) => setNotifications(response.data || [])).catch(() => setNotifications([])).finally(() => setLoading(false)); }, []);
  return <div className="provider-page"><ProviderNav /><main className="provider-content"><p className="eyebrow">{t.stayInformed}</p><h1>{t.notifications}</h1><p className="provider-muted">{t.providerNotificationsSubtitle}</p><div className="provider-notifications">{loading ? <p>{t.loading}</p> : notifications.length ? notifications.map((item, index) => { const details = getClientDetails(item.message); return <article key={item.id || index}><span>●</span><div><h2>{item.titre || t.newClientContact}</h2>{details ? <div className="notification-details"><p><strong>{t.name} :</strong> {details.name}</p><p><strong>{t.email} :</strong> <a href={`mailto:${details.email}`}>{details.email}</a></p><p><strong>{t.phone} :</strong> <a href={`tel:${details.phone}`}>{details.phone}</a></p><p><strong>{t.service} :</strong> {details.service}</p></div> : <p>{item.message}</p>}<small>{item.date || t.recently}</small></div></article>; }) : <p className="empty-state">{t.noNewContact}</p>}</div></main></div>;
}