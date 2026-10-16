import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import "./styles/global.css";
import ClientDashboard from "./pages/client/clientDashboard";
import Services from "./pages/client/services";
import ServiceDetails from "./pages/client/servicesDetails";
import MesDemandes from "./pages/client/MesDemandes";
import Portefeuille from "./pages/client/porteFeuille";
import Notifications from "./pages/client/notifications";
import Profil from "./pages/client/profil";
import PrestataireDashboard from "./pages/prestataire/PrestataireDashboard";
import PrestataireServices from "./pages/prestataire/Services";
import PrestataireProfil from "./pages/prestataire/Profil";
import PrestataireNotifications from "./pages/prestataire/Notifications";
import PrestatairePortefeuille from "./pages/prestataire/Portefeuille";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/accueil" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/services" element={<Services />} />
        <Route path="/client/service/:id" element={<ServiceDetails />} />
        <Route path="/client/demandes" element={<MesDemandes />} />
        <Route path="/client/porteFeuille" element={<Portefeuille />} />
        <Route path="/client/portefeuille" element={<Portefeuille />} />
        <Route path="/client/notifications" element={<Notifications />} />
        <Route path="/client/profil" element={<Profil />} />

        <Route path="/prestataire" element={<PrestataireDashboard />} />
        <Route path="/prestataire/services" element={<PrestataireServices />} />
        <Route path="/prestataire/profil" element={<PrestataireProfil />} />
        <Route path="/prestataire/notifications" element={<PrestataireNotifications />} />
        <Route path="/prestataire/portefeuille" element={<PrestatairePortefeuille />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
