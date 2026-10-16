import { useLanguage } from "../../context/LanguageContext";

function AdminDashboard() {
  const { t } = useLanguage();
  const stats = [
    { label: "Utilisateurs", value: "1 240", detail: "+12% ce mois", icon: "👥" },
    { label: "Prestataires", value: "340", detail: "+8% ce mois", icon: "🧑‍🔧" },
    { label: "Services", value: "865", detail: "+25 ce jour", icon: "🛠️" },
    { label: "Transactions", value: "2 540", detail: "+18% ce mois", icon: "💰" }
  ];

  const users = [
    { name: "Jean Rakoto", role: "Client", status: "Actif" },
    { name: "Mireille Andria", role: "Prestataire", status: "Actif" },
    { name: "Tiana Rabe", role: "Client", status: "En attente" },
    { name: "Patrick Solo", role: "Prestataire", status: "Actif" }
  ];

  return (
    <div style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>{t.adminDashboard}</h1>
      <p>{t.subtitle}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginTop: "24px" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>{stat.icon}</div>
            <p style={{ color: "#666", margin: 0 }}>{stat.label}</p>
            <strong style={{ fontSize: "28px", display: "block", margin: "8px 0" }}>{stat.value}</strong>
            <small style={{ color: "#667eea" }}>{stat.detail}</small>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        <section style={{ background: "#fff", borderRadius: "12px", padding: "20px" }}>
          <h2>{t.recentUsers}</h2>
          <div>
            {users.map((user) => (
              <div key={user.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", padding: "12px 0" }}>
                <div>
                  <strong>{user.name}</strong>
                  <div style={{ color: "#666", fontSize: "13px" }}>{user.role}</div>
                </div>
                <span style={{ background: user.status === "Actif" ? "#e8f9ef" : "#fff4db", color: user.status === "Actif" ? "#1f8a4c" : "#b97a00", borderRadius: "20px", padding: "6px 10px", fontSize: "12px" }}>
                  {user.status === "Actif" ? t.activeStatus : t.pendingStatus}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: "#fff", borderRadius: "12px", padding: "20px" }}>
          <h2>{t.activity}</h2>
          <div style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
            <div><span>{t.requests}</span><strong style={{ display: "block", marginTop: "6px" }}>128</strong></div>
            <div><span>{t.revenue}</span><strong style={{ display: "block", marginTop: "6px" }}>4.8M Ar</strong></div>
            <div><span>{t.conversion}</span><strong style={{ display: "block", marginTop: "6px" }}>18.5%</strong></div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
