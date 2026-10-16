import { useEffect, useState } from "react";
import { api, money } from "../../api";
import { useLanguage } from "../../context/LanguageContext";

function AdminDashboard() {
  const { t } = useLanguage();
  const [data, setData] = useState({ users: 0, providers: 0, services: 0, transactions: 0, commission: 0, validatedRequests: 0, conversion: 0 });
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    Promise.all([
      api("/admin/stats"),
      api("/admin/users")
    ])
      .then(([stats, users]) => {
        setData(stats);
        setRecentUsers((users || []).slice(0, 4).map((user) => ({
          id: user.id,
          name: `${user.prenom || ""} ${user.nom || ""}`.trim(),
          role: user.role === "prestataire" ? "Prestataire" : user.role === "admin" ? "Admin" : "Client",
          status: "Actif"
        })));
      })
      .catch(() => {
        setData({ users: 0, providers: 0, services: 0, transactions: 0, commission: 0, validatedRequests: 0, conversion: 0 });
        setRecentUsers([]);
      });
  }, []);

  const stats = [
    { label: t.users, value: data.users, detail: t.totalRegistered, icon: "👥" },
    { label: t.providers, value: data.providers, detail: t.acceptedProfiles, icon: "🧑‍🔧" },
    { label: t.services, value: data.services, detail: t.publishedServices, icon: "🛠️" },
    { label: t.transactions, value: data.transactions, detail: `${t.commission} ${money(data.commission)}`, icon: "💰" },
  ];

  return (
    <div className="page-stack">
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-icon">{stat.icon}</div>
            <div>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
              <small>{stat.detail}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="panel-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>{t.recentUsers}</h2>
            <button type="button" className="btn-primary small">{t.seeAll}</button>
          </div>

          <div className="list-table">
            {recentUsers.length ? recentUsers.map((user) => (
              <div className="list-row" key={user.id ?? user.name}>
                <div>
                  <strong>{user.name}</strong>
                  <small>{user.role}</small>
                </div>
                <span className="status success">{t.active}</span>
              </div>
            )) : (
              <div className="list-row">
                <div>
                  <strong>{t.noData}</strong>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>{t.activity}</h2>
          </div>

          <div className="mini-metrics">
            <div>
              <span>{t.requests}</span>
              <strong>{data.validatedRequests ?? 0}</strong>
            </div>
            <div>
              <span>{t.revenue}</span>
              <strong>{money(data.commission ?? 0)}</strong>
            </div>
            <div>
              <span>{t.conversion}</span>
              <strong>{Number(data.conversion || 0).toFixed(1)}%</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;