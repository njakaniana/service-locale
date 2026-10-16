import { useEffect, useState } from "react";
import { api, date, money } from "../../api";
import { useLanguage } from "../../context/LanguageContext";

function PortefeuilleAdmin() {
  const { t } = useLanguage();
  const [data, setData] = useState({ wallet: null, transactions: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/wallet")
      .then(setData)
      .catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <div className="page-stack">
      <div className="wallet-card">
        <p>{t.adminWallet}</p>
        <h2>{money(data.wallet?.solde)}</h2>
        <span>{t.commissionKept}</span>
      </div>
      <section className="panel">
        <div className="panel-header"><h2>{t.commissionHistory}</h2></div>
        {error && <p>{error}</p>}
        <div className="table-container">
          <table>
            <thead><tr><th>{t.date}</th><th>{t.description}</th><th>{t.amount}</th><th>{t.balanceAfter}</th></tr></thead>
            <tbody>
              {data.transactions.length === 0 ? <tr><td colSpan="4">{t.noCommission}</td></tr> : data.transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{date(transaction.date_creation)}</td>
                  <td>{transaction.description}</td>
                  <td>{money(transaction.montant)}</td>
                  <td>{money(transaction.solde_apres)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default PortefeuilleAdmin;
