import { useEffect, useState } from "react";
import { api, date, money } from "../../api";
import { useLanguage } from "../../context/LanguageContext";

function Transactions() {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  useEffect(() => { api("/admin/transactions").then(setTransactions); }, []);

  return (
    <div className="page-stack">
      <div className="panel">
        <div className="panel-header">
          <h2>{t.transactions}</h2>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t.transactionId}</th>
                <th>{t.user}</th>
                <th>{t.amount}</th>
                <th>{t.description}</th>
                <th>{t.date}</th>
                <th>{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => (
                <tr key={item.id}>
                  <td>TR-{item.id}</td>
                  <td>{item.utilisateur}</td>
                  <td>{item.type === "debit" ? "-" : "+"}{money(item.montant)}</td>
                  <td>{item.description}</td>
                  <td>{date(item.date_creation)}</td>
                  <td><span className={`status ${item.type === "credit" ? "success" : "warning"}`}>{item.type === "credit" ? t.credit : t.debit}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
