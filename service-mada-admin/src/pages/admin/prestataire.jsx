import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

const API_URL = "http://localhost:5000/api";

function PrestataireAdmin() {
  const { t } = useLanguage();
  const [prestataires, setPrestataires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/users/prestataires/demandes`);
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || `Erreur de chargement (${response.status})`);
      }
      setPrestataires(await response.json());
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/users/prestataires/demandes`)
      .then((response) => {
        if (!response.ok) return response.json().then((body) => { throw new Error(body.message || `Erreur de chargement (${response.status})`); });
        return response.json();
      })
      .then((data) => { if (active) setPrestataires(data); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const validate = async (providerId, status) => {
    const response = await fetch(`${API_URL}/users/prestataires/${providerId}/validation`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) loadRequests();
  };

  return (
    <div className="page-stack">
      <div className="panel">
        <div className="panel-header">
          <h2>{t.providerRequests}</h2>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t.name}</th>
                <th>{t.serviceToOffer}</th>
                <th>{t.fullAddress}</th>
                <th>{t.price}</th>
                <th>{t.status}</th>
                <th>{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="6">{t.loadingOptions}</td></tr> : error ? <tr><td colSpan="6">{error}</td></tr> : prestataires.length === 0 ? <tr><td colSpan="6">{t.noData}</td></tr> : prestataires.map((item) => (
                <tr key={item.id || item.prestataire_id}>
                  <td>{item.prenom} {item.nom}<br /><small>{item.email}</small></td>
                  <td>{item.specialite}</td>
                  <td>{item.adresse || "-"}</td>
                  <td>{item.tarif}</td>
                  <td>{({ pending: t.pending, accepted: t.accepted, rejected: t.refused })[item.validation_status] || item.validation_status}</td>
                  <td>{item.validation_status === "pending" && <><button className="action-button success" type="button" onClick={() => validate(item.id || item.prestataire_id, "accepted")}>{t.accept}</button><button className="action-button danger" type="button" onClick={() => validate(item.id || item.prestataire_id, "rejected")}>{t.refuse}</button></>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PrestataireAdmin;
