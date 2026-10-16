import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getCategories = () => API.get("/catalog/categories");
export const getServices = () => API.get("/catalog/services");
export const payService = (data) => API.post("/payments/pay-service", data);
export const getClientDemandes = (userId) => API.get(`/client/demandes/${userId}`);
export const getClientNotifications = (userId) => API.get(`/client/notifications/${userId}`);
export const createServiceRequest = (data) => API.post("/client/demande", data);
export const getServiceById = (id) => API.get(`/client/service/${id}`);
export const getWallet = (userId) => API.get(`/payments/wallet/${userId}`);
export const getWalletTransactions = (userId) => API.get(`/payments/transactions/${userId}`);
export const depositWallet = (userId, montant) => API.post("/payments/wallet/deposit", { user_id: userId, montant });
export const withdrawWallet = (userId, montant) => API.post("/payments/wallet/withdraw", { user_id: userId, montant });
export const submitProviderProfile = (data) => API.post("/prestataire/profil", data);
export const getProviderDashboard = (userId) => API.get(`/prestataire/dashboard/${userId}`);

export default API;