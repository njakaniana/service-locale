import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Categories from "./pages/admin/Categories";
import DemandesAdmin from "./pages/admin/Demandes";
import Paiements from "./pages/admin/Paiements";
import PrestataireAdmin from "./pages/admin/prestataire";
import ServicesAdmin from "./pages/admin/Services";
import Statistiques from "./pages/admin/Statistiques";
import Transactions from "./pages/admin/Transaction";
import Utilisateurs from "./pages/admin/Utilisateurs";
import AdminPortefeuille from "./pages/admin/Portefeuille";

import PrestataireDashboard from "./pages/prestataire/PrestataireDashboard";
import MesServices from "./pages/prestataire/MesService";
import AjouterService from "./pages/prestataire/AjouterService";
import ModifierService from "./pages/prestataire/ModifierService";
import Demandes from "./pages/prestataire/Demandes";
import Revenus from "./pages/prestataire/Revenus";
import Portefeuille from "./pages/prestataire/Portefeuille";
import Profil from "./pages/prestataire/Profil";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<Layout role="admin" title="Dashboard admin"><AdminDashboard /></Layout>} />
        <Route path="/admin/categories" element={<Layout role="admin" title="Catégories"><Categories /></Layout>} />
        <Route path="/admin/demandes" element={<Layout role="admin" title="Demandes"><DemandesAdmin /></Layout>} />
        <Route path="/admin/services" element={<Layout role="admin" title="Services"><ServicesAdmin /></Layout>} />
        <Route path="/admin/utilisateurs" element={<Layout role="admin" title="Utilisateurs"><Utilisateurs /></Layout>} />
        <Route path="/admin/paiements" element={<Layout role="admin" title="Paiements"><Paiements /></Layout>} />
        <Route path="/admin/statistiques" element={<Layout role="admin" title="Statistiques"><Statistiques /></Layout>} />
        <Route path="/admin/transactions" element={<Layout role="admin" title="Transactions"><Transactions /></Layout>} />
        <Route path="/admin/portefeuille" element={<Layout role="admin" title="Portefeuille"><AdminPortefeuille /></Layout>} />
        <Route path="/admin/prestataires" element={<Layout role="admin" title="Prestataires"><PrestataireAdmin /></Layout>} />

        <Route path="/prestataire" element={<Layout role="prestataire" title="Espace prestataire"><PrestataireDashboard /></Layout>} />
        <Route path="/prestataire/services" element={<Layout role="prestataire" title="Mes services"><MesServices /></Layout>} />
        <Route path="/prestataire/services/ajouter" element={<Layout role="prestataire" title="Ajouter un service"><AjouterService /></Layout>} />
        <Route path="/prestataire/services/modifier/:id" element={<Layout role="prestataire" title="Modifier un service"><ModifierService /></Layout>} />
        <Route path="/prestataire/demandes" element={<Layout role="prestataire" title="Demandes"><Demandes /></Layout>} />
        <Route path="/prestataire/revenus" element={<Layout role="prestataire" title="Revenus"><Revenus /></Layout>} />
        <Route path="/prestataire/portefeuille" element={<Layout role="prestataire" title="Portefeuille"><Portefeuille /></Layout>} />
        <Route path="/prestataire/profil" element={<Layout role="prestataire" title="Profil"><Profil /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;