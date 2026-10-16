const API_URL = "http://localhost:5000/api";

export async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Une erreur est survenue");
  return data;
}

export const money = (value) => `${Number(value || 0).toLocaleString("fr-FR")} Ar`;
export const date = (value) => value ? new Date(value).toLocaleDateString("fr-FR") : "-";
