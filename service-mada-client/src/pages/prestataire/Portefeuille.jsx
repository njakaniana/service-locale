import { useEffect, useState } from "react";
import { getWallet, getWalletTransactions, withdrawWallet } from "../../api/api";
import ProviderNav from "../../components/ProviderNav";
import { useLanguage } from "../../context/LanguageContext";
import "../../styles/provider.css";

export default function PrestatairePortefeuille() {
	const { t } = useLanguage();
	const user = JSON.parse(localStorage.getItem("utilisateur") || "null");
	const [wallet, setWallet] = useState(null); const [transactions, setTransactions] = useState([]); const [amount, setAmount] = useState(100000); const [loading, setLoading] = useState(true); const [isWithdrawing, setIsWithdrawing] = useState(false);
	const load = async () => { if (!user?.id) { setLoading(false); return; } try { const [balance, history] = await Promise.all([getWallet(user.id), getWalletTransactions(user.id)]); setWallet(balance.data.wallet); setTransactions(history.data.transactions || []); } catch (error) { console.error(error); } finally { setLoading(false); } };
	useEffect(() => { load(); }, []);
	const balance = Number(wallet?.solde || 0);
	const withdrawalAmount = Number(amount);
	const canWithdraw = !loading && !isWithdrawing && Number.isFinite(withdrawalAmount) && withdrawalAmount >= 1000 && withdrawalAmount <= balance;
	const retirer = async () => {
		if (!canWithdraw) return;
		if (!window.confirm(t.withdrawConfirm)) return;
		setIsWithdrawing(true);
		try {
			await withdrawWallet(user.id, withdrawalAmount);
			alert(t.withdrawSuccess);
			setAmount("");
			await load();
		} catch (error) {
			alert(error.response?.data?.message || t.withdrawError);
		} finally {
			setIsWithdrawing(false);
		}
	};
	return <div className="provider-page"><ProviderNav /><main className="provider-content"><p className="eyebrow">{t.finances}</p><h1>{t.wallet}</h1><div className="wallet-card"><p>{t.availableBalance}</p><h2>{loading ? "..." : `${balance.toLocaleString("fr-FR")} Ar`}</h2><div><input type="number" min="1000" max={balance} value={amount} onChange={(event) => setAmount(event.target.value)} aria-label={t.withdrawFunds} /><button className="provider-primary" type="button" onClick={retirer} disabled={!canWithdraw}>{isWithdrawing ? t.withdrawInProgress : t.withdrawFunds}</button></div>{amount !== "" && withdrawalAmount < 1000 && <small className="wallet-hint">{t.minimumWithdrawal}</small>}{amount !== "" && withdrawalAmount > balance && <small className="wallet-hint">{t.insufficientBalance}</small>}</div><h2 className="provider-history-title">{t.transactionHistory}</h2><div className="provider-table"><table><thead><tr><th>{t.type}</th><th>{t.description}</th><th>{t.date}</th><th>{t.amount || t.price}</th></tr></thead><tbody>{transactions.length === 0 ? <tr><td colSpan="4">{t.noTransaction}</td></tr> : transactions.map((transaction) => <tr key={transaction.id}><td>{transaction.type === "debit" ? t.debit : t.credit}</td><td>{transaction.description}</td><td>{new Date(transaction.date_creation).toLocaleDateString("fr-FR")}</td><td>{Number(transaction.montant).toLocaleString("fr-FR")} Ar</td></tr>)}</tbody></table></div></main></div>;
}
