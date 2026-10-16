import { useEffect, useState } from "react";
import { api, money } from "../../api";
import { translateCategory } from "../../i18n";
import { useLanguage } from "../../context/LanguageContext";

function ServicesAdmin() {
  const { t } = useLanguage();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [prestataires, setPrestataires] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ nom: "", description: "", prix: "", ville: "", categorie_id: "", prestataire_id: "" });
  const load = () => api("/admin/services").then(setServices).catch((error) => setMessage(error.message));
  useEffect(() => {
    load();
    Promise.allSettled([api("/admin/categories"), api("/admin/prestataires")]).then(([categoryResult, providerResult]) => {
      if (categoryResult.status === "fulfilled") setCategories(categoryResult.value);
      if (providerResult.status === "fulfilled") setPrestataires(providerResult.value);
      const errors = [categoryResult, providerResult].filter((result) => result.status === "rejected");
      if (errors.length) setMessage(errors.map((result) => result.reason.message).join(" | "));
      setLoadingOptions(false);
    });
  }, []);
  const save = async (event) => { event.preventDefault(); try { await api("/admin/services", { method: "POST", body: JSON.stringify(form) }); setForm({ nom: "", description: "", prix: "", ville: "", categorie_id: "", prestataire_id: "" }); setOpen(false); setMessage(t.save); load(); } catch (error) { setMessage(error.message); } };

  return (
    <div className="page-stack">
      <div className="panel">
        <div className="panel-header">
          <h2>{t.services}</h2>
          <button type="button" className="btn-primary small" onClick={() => setOpen(!open)}>{t.newItem}</button>
        </div>
        {message && <p>{message}</p>}
        {open && <form className="form-card" onSubmit={save}>
          <input placeholder={t.serviceName} value={form.nom} onChange={(event) => setForm({ ...form, nom: event.target.value })} required />
          <input type="number" placeholder={t.priceMGA} value={form.prix} onChange={(event) => setForm({ ...form, prix: event.target.value })} required />
          <input placeholder={t.city} value={form.ville} onChange={(event) => setForm({ ...form, ville: event.target.value })} />
          <label>{t.categories}<select value={form.categorie_id} onChange={(event) => setForm({ ...form, categorie_id: event.target.value })} required><option value="">{loadingOptions ? t.loadingOptions : t.chooseCategory}</option>{categories.map((item) => <option key={item.id} value={item.id}>{translateCategory(item.nom, t)}</option>)}</select></label>
          <label>{t.providers}<select value={form.prestataire_id} onChange={(event) => setForm({ ...form, prestataire_id: event.target.value })} required><option value="">{loadingOptions ? t.loadingOptions : t.chooseProvider}</option>{prestataires.map((item) => <option key={item.id} value={item.id}>{item.prenom} {item.nom} ({item.validation_status})</option>)}</select></label>
          <textarea placeholder={t.description} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <button type="submit" className="btn-primary">{t.save}</button>
        </form>}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t.services}</th>
                <th>{t.providers}</th>
                <th>{t.price}</th>
                <th>{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.nom}</td>
                  <td>{service.prestataire}</td>
                  <td>{money(service.prix)}</td>
                  <td><span className={`status ${service.disponible ? "success" : "warning"}`}>{service.disponible ? t.published : t.disabled}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ServicesAdmin;
