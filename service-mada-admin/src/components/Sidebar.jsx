import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { to: "/admin", label: "Accueil" },
    { to: "/admin/utilisateurs", label: "Utilisateurs" },
    { to: "/admin/prestataires", label: "Prestataires" },
    { to: "/admin/services", label: "Services" },
    { to: "/admin/categories", label: "Catégories" },
    { to: "/admin/paiements", label: "Paiements" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand-box">
        <div className="brand-mark">S</div>
        <div>
          <div className="brand-title">Service Mada</div>
          <small>Administration</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            end={to === "/admin"}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
