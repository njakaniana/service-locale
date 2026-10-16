import React from "react";
import { useLanguage } from "../../context/LanguageContext";

function Revenus() {
  const { t } = useLanguage();
  return (
    <div className="page-container">
      <h1>{t.myRevenue}</h1>
      <p>{t.revenueHelp}</p>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>{t.monthlyRevenue}</h3>
          <strong>250 000 Ar</strong>
        </div>

        <div className="stat-card">
          <h3>{t.totalRevenue}</h3>
          <strong>1 250 000 Ar</strong>
        </div>

        <div className="stat-card">
          <h3>{t.completedServices}</h3>
          <strong>25</strong>
        </div>

      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t.date}</th>
              <th>{t.services}</th>
              <th>{t.amount}</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>16/09/2026</td>
              <td>Création site web</td>
              <td>150 000 Ar</td>
            </tr>

            <tr>
              <td>15/09/2026</td>
              <td>Réparation ordinateur</td>
              <td>50 000 Ar</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Revenus;