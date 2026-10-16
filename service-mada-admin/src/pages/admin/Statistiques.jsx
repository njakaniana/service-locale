import { useEffect, useState } from "react";
import { api, money } from "../../api";
import { useLanguage } from "../../context/LanguageContext";

function Statistiques() {
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/admin/stats").then(setData).catch((requestError) => setError(requestError.message));
  }, []);

  const metrics = [
    { label: t.monthlyRevenue, value: money(data?.monthlyRevenue) },
    { label: t.validatedRequests, value: data?.validatedRequests ?? "..." },
    { label: t.conversion, value: data ? `${Number(data.conversion).toFixed(1)}%` : "..." },
    { label: t.activeClients, value: data?.activeClients ?? "..." },
  ];
  const monthlyCommission = data?.monthlyCommission || [];
  const maximum = Math.max(...monthlyCommission.map((item) => Number(item.commission)), 1);

  return (
    <div className="page-stack">
      {error && <p>{error}</p>}
      <div className="stats-grid">
        {metrics.map((item) => (
          <div className="stat-card" key={item.label}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>{t.evolution}</h2>
        </div>

        <div className="chart-bars" aria-label={t.chartLabel}>
          {monthlyCommission.length === 0 ? <p>{t.noPaymentData}</p> : monthlyCommission.map((item) => (
            <span key={item.month} title={`${item.month}: ${money(item.commission)}`} style={{ height: `${Math.max((Number(item.commission) / maximum) * 100, 4)}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Statistiques;
