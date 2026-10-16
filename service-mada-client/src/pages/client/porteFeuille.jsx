import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { depositWallet, getWallet, getWalletTransactions } from "../../api/api";
import { useLanguage } from "../../context/LanguageContext";
import "../../styles/wallet.css";
import logo from "../../assets/logo service.jpg";
import ispmLogo from "../../assets/logo ispm.jpg";

function Portefeuille() {
  const { t, locale, setLocale } = useLanguage();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [montant, setMontant] = useState(100000);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("utilisateur") || "null");

  const charger = async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const [w, tx] = await Promise.all([getWallet(user.id), getWalletTransactions(user.id)]);
      setWallet(w.data.wallet); setTransactions(tx.data.transactions || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };
  useEffect(() => { charger(); }, []);

  const recharger = async () => {
    try { await depositWallet(user.id, Number(montant)); alert(t.rechargeSuccess); await charger(); }
    catch (error) { alert(error.response?.data?.message || t.rechargeError); }
  };

  return (
    <div className="client-page">
      <nav className="client-topbar"><div className="brand-logos"><img className="ispm-logo" src={ispmLogo} alt="ISPM" /><img className="client-brand-logo" src={logo} alt="Service Local Madagascar" /></div>
        <div className="client-top-links">
          <Link to="/accueil">{t.home}</Link><Link to="/client/services">{t.services}</Link><Link to="/client/profil">{t.profil}</Link><Link to="/client/demandes">{t.demandes}</Link><Link to="/client/notifications">{t.notifications}</Link><Link to="/client/porteFeuille">{t.portefeuille}</Link>
          <div className="language-switcher">{["fr","mg","en"].map(k=><button key={k} type="button" className={`lang-btn ${locale===k?"active":""}`} onClick={()=>setLocale(k)}>{k.toUpperCase()}</button>)}</div>
        </div></nav>
      <div className="page-container">
        <h1>{t.wallet} 👛</h1>
        <div className="wallet-card"><p>{t.availableBalance}</p><h2>{loading ? "..." : `${Number(wallet?.solde || 0).toLocaleString("fr-FR")} Ar`}</h2>
          <div style={{display:"flex",gap:"10px",flexWrap:"wrap",marginTop:"15px"}}>
            <input type="number" min="1000" value={montant} onChange={e=>setMontant(e.target.value)} style={{padding:"10px",maxWidth:"180px"}} />
            <button className="btn-primary" onClick={recharger}>+ {t.addMoney}</button>
          </div>
        </div>
        <h2>{t.transactionHistory}</h2>
        <div className="table-container"><table><thead><tr><th>{t.type}</th><th>{t.description}</th><th>{t.date}</th><th>{t.price}</th></tr></thead>
          <tbody>{transactions.length===0?<tr><td colSpan="4">{t.noTransaction}</td></tr>:transactions.map(tx=><tr key={tx.id}><td>{tx.type}</td><td>{tx.description}</td><td>{new Date(tx.date_creation).toLocaleDateString("fr-FR")}</td><td>{Number(tx.montant).toLocaleString("fr-FR")} Ar</td></tr>)}</tbody>
        </table></div>
      </div>
    </div>
  );
}
export default Portefeuille;
