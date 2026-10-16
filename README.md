# Service Locale Mada

Cette archive contient le projet corrigé sans `node_modules` ni `dist`.

## Structure

```text
vita/
├── backend/
├── service-mada-client/
└── service-mada-admin/
```

## 1. Backend

```powershell
cd backend
npm install
npm run dev
```

API : `http://localhost:5000`

## 2. Client

Dans un nouveau terminal :

```powershell
cd service-mada-client
npm install
npm run dev
```

## 3. Admin

Dans un troisième terminal :

```powershell
cd service-mada-admin
npm install
npm run dev
```

## Fonctionnalités corrigées dans cette version

- Création automatique du portefeuille à l'inscription.
- Création automatique de la fiche prestataire pour un compte prestataire.
- Catalogue avec vrai identifiant du prestataire utilisateur et identifiant de la fiche prestataire.
- Page détail d'un service chargée depuis MySQL.
- Paiement contrôlé contre le vrai service et le vrai prestataire.
- Création de la demande lors du paiement.
- Répartition automatique : 10 % admin / 90 % prestataire.
- Écritures dans `wallet_transactions` pour client, admin et prestataire.
- Recharge du portefeuille client.
- Historique du portefeuille connecté à la base.
- Recherche de services et ouverture du vrai détail.
- Traduction globale FR / MG / EN pour les éléments principaux du client et la navigation admin/prestataire.

## Scénario de démonstration conseillé

1. Démarrer MySQL.
2. Démarrer le backend.
3. Démarrer le client et l'admin.
4. Se connecter avec un compte client.
5. Rechercher « informatique ».
6. Ouvrir « Création de site web ».
7. Cliquer sur « Demander ce service » / paiement.
8. Vérifier `service_requests`, `payments`, `wallets` et `wallet_transactions` dans MySQL.
9. Vérifier le portefeuille du client, du prestataire et de l'admin.
10. Tester FR → MG → EN.

## Comptes de démonstration initialisés par le backend

- Admin : `admin@service-mada.com` / `admin123`
- Prestataire : `prestataire@service-mada.com` / `prestataire123`
- Client : `client@service-mada.com` / `client123`

Si ces comptes existent déjà dans votre base, leurs mots de passe existants restent prioritaires.
