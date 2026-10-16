import { useEffect, useState } from "react";
import { api, date, money } from "../../api";
import { useLanguage } from "../../context/LanguageContext";

function DemandesAdmin() {
  const { t } = useLanguage();
  const [demandes, setDemandes] = useState([]);
  const [message, setMessage] = useState("");
  const load = () => api("/admin/demandes").then(setDemandes).catch((error) => setMessage(error.message));
  useEffect(() => { load(); }, []);
  const update = async (id, statut) => { try { await api(`/admin/demandes/${id}`, { method: "PATCH", body: JSON.stringify({ statut }) }); load(); } catch (error) { setMessage(error.message); } };

  return (
    <div className="page-stack">
      <div className="panel">
        <div className="panel-header">
          <h2>{t.requests}</h2>
        </div>

        {message && <p>{message}</p>}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t.client}</th>
                <th>{t.services}</th>
                <th>{t.date}</th>
                <th>{t.amount}</th><th>{t.status}</th><th>{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map((item) => (
                <tr key={item.id}>
                  <td>{item.client}</td>
                  <td>{item.service}</td>
                  <td>{date(item.date_creation)}</td>
                  <td>{money(item.prix)}</td>
                  <td><span className={`status ${item.statut === "acceptee" ? "success" : item.statut === "refusee" ? "neutral" : "warning"}`}>{({ en_attente: t.pending, acceptee: t.accepted, refusee: t.refused, terminee: t.finished })[item.statut] || item.statut}</span></td>
                  <td>{item.statut === "en_attente" && <><button className="btn-success" onClick={() => update(item.id, "acceptee")}>{t.accept}</button><button className="btn-danger" onClick={() => update(item.id, "refusee")}>{t.refuse}</button></>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DemandesAdmin;
