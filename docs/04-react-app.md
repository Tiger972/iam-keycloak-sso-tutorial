# Étape 4 — SPA React avec login Keycloak

## 🎯 Objectif

Développer une **Single Page Application** React qui :
1. Permet à l'utilisateur de se **connecter** via Keycloak (Authorization Code + PKCE)
2. Récupère son **JWT**
3. Affiche le **payload décodé** dans un tableau HTML formatté

---

## 🏗️ 4.1 Stack technique

| Outil | Rôle |
|-------|------|
| **Vite** | Bundler ultra-rapide pour React |
| **React 18** | UI |
| **keycloak-js** | Bibliothèque officielle Keycloak — gère OIDC/OAuth, PKCE, refresh token |

---

## 📂 4.2 Structure du dossier `react-app/`

```
react-app/
├── index.html
├── package.json
├── vite.config.js
├── .env                  # Variables Keycloak
├── .env.example          # Template
├── .gitignore
└── src/
    ├── main.jsx          # Point d'entrée React
    ├── App.jsx           # Logique principale (init Keycloak, login/logout)
    ├── JwtTable.jsx      # Tableau HTML pour afficher le payload
    ├── keycloak.js       # Instance Keycloak (config)
    └── styles.css        # Mise en forme
```

---

## ⚙️ 4.3 Configuration

### Fichier `.env`

```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=demo-realm
VITE_KEYCLOAK_CLIENT_ID=react-spa
```

### Instance Keycloak (`src/keycloak.js`)

```js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export default keycloak;
```

---

## 🔧 4.4 Points clés du code

### Initialisation avec PKCE

```js
keycloak.init({
  onLoad: 'check-sso',     // Vérifie si l'utilisateur est déjà connecté (SSO)
  pkceMethod: 'S256',      // Active PKCE avec SHA-256
  checkLoginIframe: false, // Désactive l'iframe (évite les soucis CORS en dev)
});
```

### Récupération du token décodé

`keycloak-js` décode automatiquement le JWT dans `keycloak.tokenParsed` — pas besoin d'une lib supplémentaire pour notre tableau HTML.

```js
setTokenParsed(keycloak.tokenParsed);  // Objet JS avec tous les claims
setAccessToken(keycloak.token);        // Le JWT brut (3 parties)
```

### Auto-refresh du token

```js
keycloak.onTokenExpired = () => {
  keycloak.updateToken(30).then((refreshed) => { /* ... */ });
};
```

### Tableau HTML

Le composant `JwtTable.jsx` :
- Itère sur les entrées du payload
- Affiche `claim` / `valeur` / `description`
- Convertit les timestamps Unix en dates lisibles (`fr-FR`)
- Affiche les objets imbriqués (`realm_access`, `resource_access`) en JSON formaté

---

## 🚀 4.5 Démarrage de l'application

### Installation

```bash
cd react-app
npm install
```

### Lancement en mode dev

```bash
npm run dev
```

L'app est accessible sur <http://localhost:5173>.

![page d'accueil avec bouton "Se connecter via Keycloak"](screenshots/22-spa-home-not-logged.png)

---

## 🔐 4.6 Flow d'authentification

1. L'utilisateur clique sur **Se connecter via Keycloak**
2. La SPA appelle `keycloak.login()` qui redirige vers la page de login Keycloak avec un **code_challenge** PKCE
3. L'utilisateur saisit `testuser` / `Test1234!`
4. Keycloak redirige vers `http://localhost:5173/?state=…&code=…`
5. `keycloak-js` échange le `code` + `code_verifier` contre un **access token** (sans secret, grâce à PKCE)
6. La SPA récupère et affiche le payload décodé

![page de login Keycloak après redirection](screenshots/23-keycloak-login-page.png)
![SPA après login, avec le token affiché](screenshots/24-spa-logged-in-token.png)
![tableau HTML avec le payload décodé](screenshots/25-spa-jwt-table.png)
![onglet **Network** du navigateur montrant l'échange de tokens (bonus sécu)](screenshots/26-spa-network-tokens.png)

---

## 🐛 4.7 Dépannage

| Symptôme | Cause probable | Solution |
|----------|----------------|----------|
| `Failed to fetch` au login | Web Origins manquant dans le client Keycloak | Ajouter `http://localhost:5173` dans **Web origins** |
| Boucle de redirection infinie | URL de redirection invalide | Vérifier **Valid redirect URIs** : `http://localhost:5173/*` |
| `Invalid parameter: redirect_uri` | URL exacte non whitelistée | Ajouter le wildcard `*` à la fin |
| `Cannot init Keycloak twice` | React StrictMode + double `useEffect` | Le code utilise `keycloak.didInitialize` comme garde-fou |
| Token expire trop vite | Durée de vie par défaut du realm (5 min) | Realm settings → Tokens → augmenter `Access Token Lifespan` |

---

## 🧠 4.8 Pourquoi PKCE plutôt que Implicit Flow ou Password Grant ?

| Flow | Sécurité | Usage |
|------|----------|-------|
| **Authorization Code + PKCE** | ✅ Recommandé | SPA, mobile, desktop |
| Implicit Flow | ❌ Déprécié (token exposé dans l'URL) | — |
| Resource Owner Password Credentials | ❌ Déprécié OAuth 2.1 | Legacy uniquement |
| Client Credentials | ✅ Pour service-to-service | Backend ↔ backend |

**PKCE** (RFC 7636) :
- Le client génère un `code_verifier` aléatoire
- Il hash ce code (`SHA-256`) et envoie le hash (`code_challenge`) lors de la demande d'authorization
- Lors de l'échange du code contre un token, il envoie le `code_verifier` original
- Keycloak vérifie que `SHA-256(code_verifier) == code_challenge`

→ Même si un attaquant intercepte le `code` dans l'URL de redirect, il ne peut pas l'échanger contre un token sans le `code_verifier` qui est resté dans la mémoire du navigateur.

---

## ✅ 4.9 Récap final

L'atelier est complet :
- ✅ Keycloak déployé en Docker
- ✅ Realm, clients (public + confidentiel) et utilisateur configurés
- ✅ JWT récupéré via `curl` et **Postman**
- ✅ JWT décodé sur **jwt.io** et expliqué
- ✅ SPA React avec **Authorization Code + PKCE** affichant le payload dans un tableau HTML stylisé

🎓 **Tu peux maintenant compresser le projet en zip pour le rendu.**
