import { useEffect, useState } from "react";
import { api } from "../../api";
import { translateCategory } from "../../i18n";
import { useLanguage } from "../../context/LanguageContext";

function Categories() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ nom: "", description: "" });
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = () => api("/admin/categories").then(setCategories).catch((error) => setMessage(error.message));
  useEffect(() => { load(); }, []);

  const save = async (event) => {
    event.preventDefault();
    const nom = form.nom.trim();

    if (!nom) {
      setMessage("Le nom de la catégorie est obligatoire");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nom,
        description: form.description.trim(),
      };

      await api(editing ? `/admin/categories/${editing}` : "/admin/categories", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setForm({ nom: "", description: "" });
      setEditing(null);
      setMessage(editing ? "Catégorie modifiée" : "Catégorie ajoutée");
      await load();
    } catch (error) {
      setMessage(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <div className="panel">
        <div className="panel-header">
          <h2>{t.categories}</h2>
          <form onSubmit={save} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <input
              placeholder={t.name}
              value={form.nom}
              onChange={(event) => setForm({ ...form, nom: event.target.value })}
              required
            />
            <input
              placeholder={t.description}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              style={{ minWidth: 180 }}
            />
            <button type="submit" className="btn-primary small" disabled={isSubmitting}>
              {isSubmitting ? "..." : editing ? t.edit : t.add}
            </button>
          </form>
        </div>
        {message && <p>{message}</p>}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t.name}</th>
                <th>{t.services}</th>
                <th>{t.status}</th>
                <th>{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{translateCategory(cat.nom, t)}</td>
                  <td>{cat.services}</td>
                  <td><span className="status success">{t.active}</span></td>
                  <td><button className="btn-secondary small" onClick={() => { setEditing(cat.id); setForm({ nom: cat.nom, description: cat.description || "" }); }}>{t.edit}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Categories;
