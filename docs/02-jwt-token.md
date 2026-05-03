# Étape 2 — Récupération du JWT (curl + Postman)

## 🎯 Objectif

Récupérer un **access token JWT** depuis Keycloak via deux méthodes :
1. La ligne de commande avec `curl`
2. L'outil graphique **Postman**

---

## 🖥️ 2.1 Récupération via `curl`

### Commande complète

> Remplacer `<CLIENT_SECRET>` par la valeur copiée depuis l'onglet **Credentials** du client `curl-client`.

```bash
curl -X POST \
  "http://localhost:8080/realms/demo-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=curl-client" \
  -d "client_secret=<CLIENT_SECRET>" \
  -d "username=testuser" \
  -d "password=Test1234!" \
  -d "grant_type=password"
```

### Réponse attendue

Keycloak renvoie un JSON contenant l'access token, le refresh token et leurs durées de vie :

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "not-before-policy": 0,
  "session_state": "...",
  "scope": "profile email"
}
```

### Astuce — extraire seulement l'access token avec `jq`

```bash
TOKEN=$(curl -s -X POST \
  "http://localhost:8080/realms/demo-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=curl-client" \
  -d "client_secret=<CLIENT_SECRET>" \
  -d "username=testuser" \
  -d "password=Test1234!" \
  -d "grant_type=password" | jq -r .access_token)

echo $TOKEN
```

![terminal avec la commande curl et la réponse JSON](screenshots/14-curl-token-request.png)

---

## 📮 2.2 Récupération via Postman

### Importer la collection

1. Ouvrir Postman
2. **File** → **Import** → sélectionner `postman/keycloak-jwt.postman_collection.json`
3. La collection **"Keycloak JWT - IAM M1-CSM 2026"** apparaît

![collection importée](screenshots/15-postman-import.png)

### Configurer les variables

1. Cliquer sur la collection → onglet **Variables**
2. Renseigner les valeurs courantes :
   - `keycloak_url` : `http://localhost:8080`
   - `realm` : `demo-realm`
   - `client_id` : `curl-client`
   - `client_secret` : *(valeur copiée depuis Keycloak)*
   - `username` : `testuser`
   - `password` : `Test1234!`
3. **Save**

![variables configurées](screenshots/16-postman-variables.png)

### Exécuter "1. Get JWT (Password Grant)"

1. Sélectionner la requête **1. Get JWT (Password Grant)**
2. Vérifier dans l'onglet **Body** que le mode est `x-www-form-urlencoded` avec les bons champs
3. Cliquer **Send**
4. Le JWT apparaît dans la réponse, et le script de test stocke automatiquement `access_token` dans la variable de collection

![réponse contenant l'access_token](screenshots/17-postman-token-response.png)

### Bonus — UserInfo et Introspection

La collection inclut aussi :

- **2. UserInfo** : récupère les infos de l'utilisateur via le token
- **3. Token Introspection** : vérifie la validité d'un token (RFC 7662)
- **4. Logout** : invalide la session

![réponse de /userinfo](screenshots/18-postman-userinfo.png)

---

## 🧪 2.3 Test alternatif — OAuth 2.0 natif de Postman (Authorization Code + PKCE)

Pour tester le flow utilisé par notre SPA React, Postman permet aussi de simuler le **Authorization Code Flow + PKCE**.

1. Créer une nouvelle requête vers une URL protégée (ex: `{{keycloak_url}}/realms/demo-realm/protocol/openid-connect/userinfo`)
2. Onglet **Authorization** → **Type** : `OAuth 2.0`
3. Cliquer **Get New Access Token** et remplir :
   - **Token Name** : `Demo PKCE`
   - **Grant Type** : `Authorization Code (With PKCE)`
   - **Callback URL** : `https://oauth.pstmn.io/v1/callback` *(à ajouter dans les Valid Redirect URIs du client `react-spa` côté Keycloak pour ce test)*
   - **Auth URL** : `http://localhost:8080/realms/demo-realm/protocol/openid-connect/auth`
   - **Access Token URL** : `http://localhost:8080/realms/demo-realm/protocol/openid-connect/token`
   - **Client ID** : `react-spa`
   - **Code Challenge Method** : `SHA-256`
   - **Scope** : `openid profile email`
4. **Get New Access Token** → tu seras redirigé vers Keycloak pour t'authentifier

📸 **Screenshot à prendre :** `19-postman-pkce.png` *(optionnel — bonus pour la soutenance)*

---

## ✅ 2.4 Récap

À ce stade, tu disposes :
- ✅ d'un access token JWT obtenu via `curl`
- ✅ d'un access token JWT obtenu via **Postman**
- ✅ de la compréhension de la différence entre **password grant** (déprécié) et **Authorization Code + PKCE** (recommandé)

➡️ **Prochaine étape :** [`03-jwt-decode.md`](03-jwt-decode.md)
