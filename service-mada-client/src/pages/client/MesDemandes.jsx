import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClientDemandes } from "../../api/api";
import { useLanguage } from "../../context/LanguageContext";
import ClientNav from "../../components/ClientNav";
import "../../styles/demandes.css";

function MesDemandes() {
  const { t } = useLanguage();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const utilisateur = JSON.parse(localStorage.getItem("utilisateur") || "null");

    if (!utilisateur?.id) {
      setLoading(false);
      return;
    }

    getClientDemandes(utilisateur.id)
      .then((response) => setDemandes(response.data || []))
      .catch((error) => {
        console.error("Erreur demandes :", error);
        setDemandes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="client-page">
      <ClientNav />

      <div className="page-container">

      <h1>{t.myRequests}</h1>

      <p>
        {t.findRequest}
      </p>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>{t.service}</th>
              <th>{t.provider.replace(" :","")}</th>
              <th>{t.date}</th>
              <th>{t.price}</th>
              <th>{t.status}</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr><td colSpan="5">Chargement...</td></tr>
            ) : demandes.length === 0 ? (
              <tr><td colSpan="5">Aucune demande pour le moment.</td></tr>
            ) : (
              demandes.map((demande, index) => (
                <tr key={demande.id || index}>
                  <td>{demande.service}</td>
                  <td>{demande.prestataire}</td>
                  <td>{demande.date}</td>
                  <td>{demande.prix}</td>
                  <td>
                    <span className="status">{demande.statut}</span>
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      </div>
    </div>
  );
}

export default MesDemandes;