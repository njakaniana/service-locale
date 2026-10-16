import { useEffect, useState } from "react";
import { getServices } from "../../api/api";
import ProviderNav from "../../components/ProviderNav";
import { useLanguage } from "../../context/LanguageContext";
import { translateCategory } from "../../i18n";
import "../../styles/provider.css";

export default function PrestataireServices() {
  const { t } = useLanguage();
  const [services, setServices] = useState([]); const [search, setSearch] = useState(""); const [loading, setLoading] = useState(true);
  useEffect(() => { getServices().then((response) => setServices(response.data || [])).catch(() => setServices([])).finally(() => setLoading(false)); }, []);
  const filtered = services.filter((service) => `${service.nom} ${service.categorie} ${service.ville}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="provider-page"><ProviderNav /><main className="provider-content"><p className="eyebrow">{t.myActivity}</p><h1>{t.myServicesTitle}</h1><p className="provider-muted">{t.providerServicesSubtitle}</p><input className="provider-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchService} /><div className="provider-service-grid">{loading ? <p>{t.loadingServices}</p> : filtered.length === 0 ? <p>{t.noServiceFound}</p> : filtered.map((service) => <article className="provider-service" key={service.id}><span className="service-tag">{service.categorie ? translateCategory(service.categorie, t) : t.service}</span><h2>{service.nom}</h2><p>{service.description || t.serviceOffered}</p><strong>{service.prix || t.priceOnRequest}</strong><small>{service.ville || t.madagascar}</small></article>)}</div></main></div>;
}