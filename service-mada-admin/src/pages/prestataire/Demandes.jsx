import React from "react";
import { useLanguage } from "../../context/LanguageContext";

function Demandes() {
  const { t } = useLanguage();
  const demandes = [
    {
      client: "Jean Rakoto",
      service: "Création de site web",
      date: "16/09/2026",
      statut: "En attente"
    },
    {
      client: "Marie Andria",
      service: "Réparation ordinateur",
      date: "15/09/2026",
      statut: "Acceptée"
    },
    {
      client: "Paul Rabe",
      service: "Installation Windows",
      date: "14/09/2026",
      statut: "Terminée"
    }
  ];

  return (
    <div className="page-container">
      <h1>{t.receivedRequests}</h1>
      <p>{t.clientRequestsHelp}</p>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t.user}</th>
              <th>{t.services}</th>
              <th>{t.date}</th>
              <th>{t.status}</th>
              <th>{t.action}</th>
            </tr>
          </thead>

          <tbody>
            {demandes.map((demande, index) => (
              <tr key={index}>
                <td>{demande.client}</td>
                <td>{demande.service}</td>
                <td>{demande.date}</td>
                <td>{demande.statut}</td>
                <td>
                  {demande.statut === "En attente" && (
                    <>
                      <button className="btn-success">
                        {t.accept}
                      </button>

                      <button className="btn-danger">
                        {t.refuse}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Demandes;
