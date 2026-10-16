import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClientNotifications } from "../../api/api";
import { useLanguage } from "../../context/LanguageContext";
import ClientNav from "../../components/ClientNav";
import "../../styles/notifications.css";

function Notifications() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const utilisateur = JSON.parse(localStorage.getItem("utilisateur") || "null");

    if (!utilisateur?.id) {
      setLoading(false);
      return;
    }

    getClientNotifications(utilisateur.id)
      .then((response) => setNotifications(response.data || []))
      .catch((error) => {
        console.error("Erreur notifications :", error);
        setNotifications([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="client-page">
      <ClientNav />

      <div className="page-container">

      <h1>{t.notificationsTitle} 🔔</h1>

      <p>
        {t.notificationsSubtitle}
      </p>

      <div className="notifications-list">

        {loading ? (
          <p>Chargement...</p>
        ) : notifications.length === 0 ? (
          <p>Aucune notification pour le moment.</p>
        ) : (
          notifications.map((notification, index) => (
            <div className="notification-card" key={notification.id || index}>
              <div>
                <h3>{notification.titre}</h3>
                <p>{notification.message}</p>
                <small>{notification.date}</small>
              </div>
            </div>
          ))
        )}

      </div>

      </div>
    </div>
  );
}

export default Notifications;