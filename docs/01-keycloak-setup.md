# Étape 1 — Déploiement de Keycloak et configuration SSO

## 🐳 1.1 Déploiement Docker

### Option A — Commande directe (consigne du cours)

Comme indiqué dans le slide du cours :

```bash
sudo docker run -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:26.0.1 start-dev
```

### Option B — docker-compose (recommandé)

Plus propre, redémarrable, et permet d'enchaîner avec une base PostgreSQL si besoin.

```bash
cd docker
docker compose up -d
docker compose logs -f keycloak    # suivre le démarrage
```

Patientez ~30 secondes que Keycloak finisse de démarrer, puis ouvrez : <http://localhost:8080>.

📸 **Screenshot à prendre :** `01-keycloak-welcome.png` — page d'accueil Keycloak

---

## 🔑 1.2 Connexion à la console d'administration

1. Cliquer sur **Administration Console**
2. Saisir les identifiants `admin` / `admin`

📸 **Screenshot à prendre :** `02-keycloak-admin-login.png` — écran de login admin
📸 **Screenshot à prendre :** `03-keycloak-admin-dashboard.png` — dashboard admin (realm `master`)

---

## 🏛️ 1.3 Création du realm `demo-realm`

Plutôt que d'utiliser le realm `master` (réservé à l'administration de Keycloak), on crée un realm dédié pour notre application — c'est une **bonne pratique de sécurité**.

### Étapes

1. En haut à gauche, cliquer sur le dropdown **master** → **Create realm**
2. Saisir :
   - **Realm name** : `demo-realm`
   - **Enabled** : ✅ ON
3. Cliquer sur **Create**

📸 **Screenshot à prendre :** `04-create-realm.png` — formulaire de création du realm
📸 **Screenshot à prendre :** `05-realm-created.png` — vue du realm `demo-realm` après création

---

## 👤 1.4 Création d'un utilisateur de test

1. Menu de gauche → **Users** → **Add user**
2. Remplir :
   - **Username** : `testuser`
   - **Email** : `testuser@efrei.local`
   - **First name** : `Test`
   - **Last name** : `User`
   - **Email verified** : ✅ ON
   - **Enabled** : ✅ ON
3. Cliquer sur **Create**

### Définir le mot de passe

1. Onglet **Credentials** → **Set password**
2. Saisir :
   - **Password** : `Test1234!`
   - **Password confirmation** : `Test1234!`
   - **Temporary** : ❌ OFF (sinon Keycloak forcera un changement à la première connexion)
3. Cliquer sur **Save** puis confirmer

📸 **Screenshot à prendre :** `06-create-user.png` — formulaire de création de l'utilisateur
📸 **Screenshot à prendre :** `07-set-password.png` — onglet Credentials avec le mot de passe défini

---

## 📱 1.5 Création du client public `react-spa` (pour la SPA React)

Ce client utilisera le **Authorization Code Flow + PKCE**, le standard recommandé pour les SPA.

1. Menu de gauche → **Clients** → **Create client**
2. **General settings** :
   - **Client type** : `OpenID Connect`
   - **Client ID** : `react-spa`
   - **Name** : `React SPA - JWT Decoder`
3. **Capability config** :
   - **Client authentication** : ❌ OFF *(client public, pas de secret)*
   - **Authorization** : ❌ OFF
   - **Standard flow** : ✅ ON *(Authorization Code)*
   - **Direct access grants** : ❌ OFF
   - **Implicit flow** : ❌ OFF *(déprécié)*
   - **Service accounts roles** : ❌ OFF
4. **Login settings** :
   - **Root URL** : `http://localhost:5173`
   - **Valid redirect URIs** : `http://localhost:5173/*`
   - **Valid post logout redirect URIs** : `http://localhost:5173/*`
   - **Web origins** : `http://localhost:5173` *(CORS)*
5. Cliquer sur **Save**

### Forcer PKCE (sécurité supplémentaire)

1. Sur la page du client, onglet **Advanced**
2. Section **Advanced settings**
3. **Proof Key for Code Exchange Code Challenge Method** : `S256`
4. **Save**

📸 **Screenshot à prendre :** `08-client-react-spa-general.png` — General settings
📸 **Screenshot à prendre :** `09-client-react-spa-capability.png` — Capability config
📸 **Screenshot à prendre :** `10-client-react-spa-urls.png` — Login settings (URLs)
📸 **Screenshot à prendre :** `11-client-react-spa-pkce.png` — Advanced settings (PKCE S256)

---

## 🔐 1.6 Création du client confidentiel `curl-client` (pour curl/Postman)

Ce client utilisera le **Resource Owner Password Credentials Grant** — uniquement à des fins pédagogiques pour respecter la consigne du cours.

> ⚠️ **Avertissement sécurité** : ce flow est **déprécié par OAuth 2.1**. Il est conservé ici car le slide le mentionne explicitement, mais ne doit **jamais** être utilisé en production.

1. **Clients** → **Create client**
2. **General settings** :
   - **Client type** : `OpenID Connect`
   - **Client ID** : `curl-client`
   - **Name** : `Curl & Postman client`
3. **Capability config** :
   - **Client authentication** : ✅ ON *(client confidentiel = avec secret)*
   - **Standard flow** : ❌ OFF
   - **Direct access grants** : ✅ ON *(active le password grant)*
4. **Login settings** : laisser vide
5. **Save**

### Récupérer le client secret

1. Sur la page du client, onglet **Credentials**
2. Copier la valeur **Client Secret** — on en aura besoin pour curl et Postman

📸 **Screenshot à prendre :** `12-client-curl-capability.png` — Capability config (Direct access grants ON)
📸 **Screenshot à prendre :** `13-client-curl-secret.png` — onglet Credentials avec le secret (✏️ tu peux flouter le secret avant de prendre la capture)

---

## ✅ 1.7 Vérification

À ce stade, tu dois avoir :

- ✅ Keycloak qui tourne sur <http://localhost:8080>
- ✅ Un realm `demo-realm`
- ✅ Un utilisateur `testuser` / `Test1234!`
- ✅ Un client public `react-spa` (Standard Flow + PKCE)
- ✅ Un client confidentiel `curl-client` (Direct Access Grants) avec son secret copié

➡️ **Prochaine étape :** [`02-jwt-token.md`](02-jwt-token.md)
