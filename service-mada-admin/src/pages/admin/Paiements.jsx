import { useEffect, useState } from "react";
import { api, date, money } from "../../api";
import { useLanguage } from "../../context/LanguageContext";

function Paiements() {
  const { t } = useLanguage();
  const [paiements, setPaiements] = useState([]);
  useEffect(() => { api("/admin/payments").then(setPaiements); }, []);

  return (
    <div className="page-stack">
      <div className="panel">
        <div className="panel-header">
          <h2>{t.payments}</h2>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t.reference}</th>
                <th>{t.user}</th>
                <th>{t.amount}</th>
                <th>{t.commissionRate}</th>
                <th>{t.date}</th>
                <th>{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {paiements.map((item) => (
                <tr key={item.id}>
                  <td>PAY-{item.id}</td>
                  <td>{item.client}</td>
                  <td>{money(item.montant)}</td>
                  <td>{money(item.commission_admin)}</td>
                  <td>{date(item.date_creation)}</td>
                  <td>
                    <span className="status success">{item.status === "payé" ? t.paid : item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Paiements;