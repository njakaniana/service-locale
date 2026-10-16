import { useEffect, useState } from "react";
import { api } from "../../api";
import { useLanguage } from "../../context/LanguageContext";

function Utilisateurs() {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  useEffect(() => { api("/admin/users").then(setUsers); }, []);

  return (
    <div className="page-stack">
      <div className="panel">
        <div className="panel-header">
          <h2>{t.users}</h2>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>{t.name}</th>
                <th>{t.email}</th>
                <th>{t.role}</th>
                <th>{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.prenom} {user.nom}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td><span className="status success">{t.active}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Utilisateurs;
