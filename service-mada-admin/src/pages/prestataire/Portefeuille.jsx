import React from "react";
import { useLanguage } from "../../context/LanguageContext";

function Portefeuille() {
  const { t } = useLanguage();
  return (
    <div className="page-container">
      <h1>{t.wallet}</h1>

      <div className="wallet-card">
        <p>{t.wallet}</p>
        <h2>150 000 Ar</h2>
      </div>

      <h2>{t.latestTransactions}</h2>

      <div className="transaction-list">
        <div>
          <span>{t.clientPayment}</span>
          <strong>+150 000 Ar</strong>
        </div>

        <div>
          <span>{t.serviceCommission}</span>
          <strong>-15 000 Ar</strong>
        </div>

        <div>
          <span>{t.clientPayment}</span>
          <strong>+50 000 Ar</strong>
        </div>
      </div>
    </div>
  );
}

export default Portefeuille;