# 📸 Liste des screenshots à prendre

> Place chaque screenshot dans ce dossier (`docs/screenshots/`) avec **exactement** le nom de fichier indiqué pour que les liens des docs fonctionnent.

## Étape 1 — Setup Keycloak (`01-keycloak-setup.md`)

| # | Nom du fichier | Description |
|---|----------------|-------------|
| 01 | `01-keycloak-welcome.png` | Page d'accueil Keycloak (http://localhost:8080) |
| 02 | `02-keycloak-admin-login.png` | Écran de login admin (admin/admin) |
| 03 | `03-keycloak-admin-dashboard.png` | Dashboard admin sur le realm `master` |
| 04 | `04-create-realm.png` | Formulaire de création du realm `demo-realm` |
| 05 | `05-realm-created.png` | Vue du realm `demo-realm` après création |
| 06 | `06-create-user.png` | Création de l'utilisateur `testuser` |
| 07 | `07-set-password.png` | Onglet Credentials avec mot de passe défini |
| 08 | `08-client-react-spa-general.png` | Client `react-spa` — General settings |
| 09 | `09-client-react-spa-capability.png` | Client `react-spa` — Capability config (Standard flow ON) |
| 10 | `10-client-react-spa-urls.png` | Client `react-spa` — Login settings (Root URL, redirect URIs, Web origins) |
| 11 | `11-client-react-spa-pkce.png` | Client `react-spa` — Advanced settings (PKCE S256) |
| 12 | `12-client-curl-capability.png` | Client `curl-client` — Capability config (Direct access grants ON) |
| 13 | `13-client-curl-secret.png` | Client `curl-client` — Credentials (⚠️ **flouter le secret**) |

## Étape 2 — JWT (`02-jwt-token.md`)

| # | Nom du fichier | Description |
|---|----------------|-------------|
| 14 | `14-curl-token-request.png` | Terminal avec commande curl + réponse JSON contenant l'access_token |
| 15 | `15-postman-import.png` | Collection Postman importée |
| 16 | `16-postman-variables.png` | Variables de collection configurées |
| 17 | `17-postman-token-response.png` | Requête "Get JWT" exécutée, réponse avec token |
| 18 | `18-postman-userinfo.png` | Requête UserInfo exécutée |
| 19 | `19-postman-pkce.png` | *(optionnel)* Postman avec Authorization Code + PKCE |

## Étape 3 — Décodage (`03-jwt-decode.md`)

| # | Nom du fichier | Description |
|---|----------------|-------------|
| 20 | `20-jwt-io-decoded.png` | Token collé sur jwt.io, header + payload visibles |
| 21 | `21-jwt-io-signature.png` | Partie signature sur jwt.io (avec ou sans clé publique) |

## Étape 4 — SPA React (`04-react-app.md`)

| # | Nom du fichier | Description |
|---|----------------|-------------|
| 22 | `22-spa-home-not-logged.png` | SPA — page d'accueil avec bouton de login |
| 23 | `23-keycloak-login-page.png` | Redirection vers la page de login Keycloak |
| 24 | `24-spa-logged-in-token.png` | SPA après login, access token affiché |
| 25 | `25-spa-jwt-table.png` | SPA — tableau HTML avec le payload décodé |
| 26 | `26-spa-network-tokens.png` | DevTools Network — échange du code contre le token *(bonus)* |

---

## 🛡️ Astuce sécu

Avant de prendre des captures contenant des **secrets** (client_secret, tokens en clair) :
- **Flouter** le client_secret avec un outil comme [annotate-image](https://www.imgonline.com.ua/eng/blur-area-on-image.php) ou simplement avec un cache rectangle.
- Pour les tokens JWT eux-mêmes : en environnement de cours / démo local, ce n'est pas critique (ils expirent vite et ne donnent accès qu'à ton Keycloak local). Mais c'est une bonne habitude à prendre pour le réflexe pro.

## 📐 Format

- **PNG** de préférence
- **Largeur** : ~1400-1600 px (lisible sans être énorme)
- **Compression** : utilise [TinyPNG](https://tinypng.com/) si le zip final est trop lourd
