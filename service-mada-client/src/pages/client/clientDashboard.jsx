import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "../../styles/dashboard.css";
function ClientDashboard() {
    const { t } = useLanguage();

    return (
        <div className="dashboard">

            <aside className="sidebar">

                <h2>Service Mada</h2>

                <Link to="/client">
                    🏠 {t.home}
                </Link>

                <Link to="/client/services">
                    🔎 {t.services}
                </Link>

                <Link to="/client/demandes">
                    📋 {t.demandes}
                </Link>

                <Link to="/client/porteFeuille">
                    💰 {t.portefeuille}
                </Link>

                <Link to="/client/notifications">
                    🔔 {t.notifications}
                </Link>

                <Link to="/client/profil">
                    👤 {t.profile}
                </Link>

            </aside>

            <main className="dashboard-content">

                <h1>{t.userDashboard}</h1>

                <p>
                    {t.clientSpace}
                </p>

                <div className="dashboard-cards">

                    <div className="dashboard-card">
                        <span>🔎</span>
                        <h3>{t.dashboardServices}</h3>
                        <p>
                            {t.dashboardServiceText}
                        </p>
                    </div>

                    <div className="dashboard-card">
                        <span>📋</span>
                        <h3>{t.dashboardRequests}</h3>
                        <p>
                            {t.dashboardRequestsText}
                        </p>
                    </div>

                    <div className="dashboard-card">
                        <span>💰</span>
                        <h3>{t.dashboardWallet}</h3>
                        <p>
                            {t.dashboardWalletText}
                        </p>
                    </div>

                </div>

            </main>

        </div>
    );
}

export default ClientDashboard;