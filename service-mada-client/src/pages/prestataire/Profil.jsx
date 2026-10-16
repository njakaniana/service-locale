import { useState } from "react";
import { submitProviderProfile } from "../../api/api";
import ProviderNav from "../../components/ProviderNav";
import { useLanguage } from "../../context/LanguageContext";
import "../../styles/provider.css";

const getInitialProfile = () => {
  const savedProfile = JSON.parse(localStorage.getItem("prestataireProfil") || "null");
  const user = JSON.parse(localStorage.getItem("utilisateur") || "null");

  return savedProfile || {
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
    telephone: user?.telephone || "",
    ville: "Antananarivo",
    adresse: "",
    service: "",
    tarif: ""
  };
};

export default function PrestataireProfil() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState(getInitialProfile); const [status, setStatus] = useState(localStorage.getItem("prestataireProfilStatus") || "draft");
  const update = (field, value) => setProfile((current) => ({ ...current, [field]: value }));
  const submit = async (event) => {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem("utilisateur") || "null");
    try {
      await submitProviderProfile({ ...profile, user_id: user?.id });
      localStorage.setItem("prestataireProfil", JSON.stringify(profile));
      localStorage.setItem("prestataireProfilStatus", "pending");
      setStatus("pending");
      alert(t.profileSentSuccess);
    } catch (error) {
      alert(error.response?.data?.message || t.profileSendError);
    }
  };
  return <div className="provider-page"><ProviderNav /><main className="provider-content provider-profile-layout"><div><p className="eyebrow">{t.providerAccount}</p><h1>{t.profil}</h1><p className="provider-muted">{t.profileInstructions}</p></div><div className={`profile-status ${status}`}><strong>{status === "pending" ? t.requestSent : status === "accepted" ? t.profileAccepted : status === "rejected" ? t.profileRejected : t.profileNotSent}</strong><span>{status === "pending" ? t.adminReview : t.completeAndSend}</span></div><form className="provider-form" onSubmit={submit}><label>{t.name}<input required value={profile.nom} onChange={(event) => update("nom", event.target.value)} /></label><label>{t.firstName}<input required value={profile.prenom} onChange={(event) => update("prenom", event.target.value)} /></label><label>{t.email}<input required type="email" value={profile.email} onChange={(event) => update("email", event.target.value)} /></label><label>{t.contactPhone}<input required value={profile.telephone} onChange={(event) => update("telephone", event.target.value)} placeholder="034 00 000 00" /></label><label className="full-field">{t.fullAddress}<input required value={profile.adresse || ""} onChange={(event) => update("adresse", event.target.value)} placeholder="Lot, rue, quartier, ville" /></label><label>{t.city}<input required value={profile.ville} onChange={(event) => update("ville", event.target.value)} /></label><label>{t.serviceToOffer}<input required value={profile.service || ""} onChange={(event) => update("service", event.target.value)} placeholder="Plomberie, coiffure, réparation..." /></label><label>{t.price}<input required type="text" value={profile.tarif || ""} onChange={(event) => update("tarif", event.target.value)} placeholder="25 000 Ar / intervention" /></label><button className="provider-primary" type="submit">{t.sendToAdmin}</button></form></main></div>;
}