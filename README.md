# IAM Keycloak SSO Tutorial — M1 CSM 2026

> **Auteur :** PIQUIONNE Andy
> **Cours :** Open source IAM solutions and Cloud Computing
> **Formation :** EFREI Paris — M1 Cybersécurité & Management
> **Date :** 28/04/2026

---

## 🎯 Objectifs de l'atelier

Mettre en œuvre une architecture **SSO (Single Sign-On)** complète basée sur **Keycloak** :

1. Déployer un serveur Keycloak via **Docker**
2. Configurer un **realm**, un **client OIDC** et un **utilisateur**
3. Récupérer un **JWT** via `curl` et **Postman** (OAuth 2.0 / OIDC)
4. **Décoder** le JWT et expliquer son contenu (header / payload / signature)
5. Développer une **SPA React** qui se connecte à Keycloak (Authorization Code + PKCE) et affiche le payload du token dans un tableau HTML stylisé

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   SPA React     │ ◄─────► │     Keycloak     │ ◄─────► │   Base interne   │
│  (port 5173)    │  OIDC   │   (port 8080)    │         │    (H2 dev)      │
└─────────────────┘  PKCE   └──────────────────┘         └──────────────────┘
        ▲
        │  curl / Postman
        │  (password grant pour démo)
        ▼
┌─────────────────┐
│   Utilisateur   │
└─────────────────┘
```

---

## 📁 Structure du dépôt

```
iam-keycloak-sso-tutorial/
├── README.md                          # Ce fichier
├── docs/
│   ├── 01-keycloak-setup.md          # Déploiement Docker + config realm/client/user
│   ├── 02-jwt-token.md               # Récupération JWT (curl + Postman)
│   ├── 03-jwt-decode.md              # Décodage payload + explication claims
│   ├── 04-react-app.md               # SPA React avec login Keycloak
│   └── screenshots/                  # Captures d'écran
├── react-app/                        # SPA React (Vite + keycloak-js)
├── postman/                          # Collection Postman OAuth/OIDC
├── docker/                           # docker-compose.yml (Keycloak)
└── .gitignore
```

---

## 🚀 Démarrage rapide

### 1. Lancer Keycloak

```bash
cd docker
docker compose up -d
```

Keycloak est disponible sur [http://localhost:8080](http://localhost:8080) — admin / admin.

### 2. Configurer le realm

Suivre [`docs/01-keycloak-setup.md`](docs/01-keycloak-setup.md) pour :
- Créer le realm `demo-realm`
- Créer le client public `react-spa` (Standard Flow + PKCE)
- Créer le client confidentiel `curl-client` (Direct Access Grants)
- Créer un utilisateur de test

### 3. Lancer la SPA React

```bash
cd react-app
npm install
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173).

---

## 📚 Documentation détaillée

| Étape | Document | Contenu |
|-------|----------|---------|
| 1 | [01-keycloak-setup.md](docs/01-keycloak-setup.md) | Déploiement Docker, realm, clients, utilisateur |
| 2 | [02-jwt-token.md](docs/02-jwt-token.md) | Récupération du JWT (curl + Postman) |
| 3 | [03-jwt-decode.md](docs/03-jwt-decode.md) | Décodage et analyse du JWT (jwt.io) |
| 4 | [04-react-app.md](docs/04-react-app.md) | SPA React avec Authorization Code + PKCE |

---

## 🔐 Notes de sécurité

- Le **Resource Owner Password Credentials Grant** (utilisé pour `curl`) est **déprécié par OAuth 2.1** et ne doit **jamais** être utilisé en production. Il est conservé ici uniquement pour respecter la consigne pédagogique.
- La SPA React utilise **Authorization Code Flow + PKCE**, qui est le flow recommandé pour les applications publiques (SPA, mobile).
- Le mode `start-dev` de Keycloak utilise **HTTP** et une base **H2 en mémoire** : à proscrire en production. Voir le `docker-compose.yml` pour une configuration plus réaliste avec PostgreSQL.

---

## 🧪 Technologies utilisées

| Composant | Technologie | Version |
|-----------|-------------|---------|
| IAM | Keycloak | 26.0.1 |
| SPA | React + Vite | React 18 / Vite 5 |
| Auth client | keycloak-js | 26.x |
| Conteneurisation | Docker / Docker Compose | — |
| Test API | curl, Postman | — |

---

## 📝 Livrable

Archive ZIP : `PIQUIONNE Andy – IAM M1-CSM 2026 – 28-04-2026.zip`
