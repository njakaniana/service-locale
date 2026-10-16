import { NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import {
  FiBarChart2,
  FiCreditCard,
  FiDollarSign,
  FiHome,
  FiLayers,
  FiLogOut,
  FiSettings,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";

const navByRole = {
  admin: [
    { to: "/admin", label: "Accueil", icon: <FiHome /> },
    { to: "/admin/utilisateurs", label: "Utilisateurs", icon: <FiUsers /> },
    { to: "/admin/prestataires", label: "Prestataires", icon: <FiShoppingBag /> },
    { to: "/admin/services", label: "Services", icon: <FiLayers /> },
    { to: "/admin/categories", label: "Catégories", icon: <FiLayers /> },
    { to: "/admin/demandes", label: "Demandes", icon: <FiShoppingBag /> },
    { to: "/admin/paiements", label: "Paiements", icon: <FiCreditCard /> },
    { to: "/admin/transactions", label: "Transactions", icon: <FiDollarSign /> },
    { to: "/admin/portefeuille", label: "Portefeuille", icon: <FiCreditCard /> },
    { to: "/admin/statistiques", label: "Statistiques", icon: <FiBarChart2 /> },
  ],
  prestataire: [
    { to: "/prestataire", label: "Accueil", icon: <FiHome /> },
    { to: "/prestataire/services", label: "Mes services", icon: <FiLayers /> },
    { to: "/prestataire/demandes", label: "Demandes", icon: <FiShoppingBag /> },
    { to: "/prestataire/revenus", label: "Revenus", icon: <FiDollarSign /> },
    { to: "/prestataire/portefeuille", label: "Portefeuille", icon: <FiCreditCard /> },
    { to: "/prestataire/profil", label: "Profil", icon: <FiSettings /> },
  ],
};

function Layout({ role = "admin", title, children }) {
  const navigate = useNavigate();
  const { t, locale, setLocale } = useLanguage();
  const labels = { Accueil:t.home, Utilisateurs:t.users, Prestataires:t.providers, Services:t.services, Catégories:t.categories, Demandes:t.requests, Paiements:t.payments, Transactions:t.transactions, Statistiques:t.statistics, "Mes services":t.myServices, Revenus:t.revenue, Portefeuille:t.wallet, Profil:t.profile };
  const links = (navByRole[role] || navByRole.admin).map(link => ({ ...link, label: labels[link.label] || link.label }));
  const titleMap = { "Dashboard admin": t.adminDashboard, "Catégories": t.categories, "Demandes": t.requests, "Services": t.services, "Utilisateurs": t.users, "Paiements": t.payments, "Statistiques": t.statistics, "Transactions": t.transactions, "Prestataires": t.providers, "Espace prestataire": t.providerDashboard, "Mes services": t.myServices, "Revenus": t.revenue, "Portefeuille": t.wallet, "Profil": t.profile };
  const logout = () => {
    localStorage.removeItem("utilisateur");
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-box">
          <small>{role === "admin" ? t.modeAdmin : t.modeProvider}</small>
        </div>

        <nav className="sidebar-nav">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              end={to === "/admin" || to === "/prestataire"}
            >
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" type="button" onClick={logout}>
            <FiLogOut />
            {t.logout}
          </button>
        </div>
      </aside>

      <div className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">{t.management}</p>
            <h1>{titleMap[title] || title}</h1>
          </div>

          <div className="topbar-actions">
            <div className="language-switcher">{["fr","mg","en"].map(k=><button key={k} type="button" className={`lang-btn ${locale===k?"active":""}`} onClick={()=>setLocale(k)}>{k.toUpperCase()}</button>)}</div>
            <button className="chip" type="button">
              {role === "admin" ? t.modeAdmin : t.modeProvider}
            </button>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
