# Étape 3 — Décoder le JWT et expliquer son contenu

## 📚 3.1 Qu'est-ce qu'un JWT ?

Un **JSON Web Token** (RFC 7519) est un format compact et auto-portant pour transporter des informations entre deux parties, signé cryptographiquement.

Un JWT est composé de **trois parties** séparées par des points :

```
xxxxx.yyyyy.zzzzz
└──┬──┘└──┬──┘└──┬──┘
HEADER PAYLOAD SIGNATURE
```

Chaque partie est encodée en **Base64URL**.

| Partie | Contenu | Rôle |
|--------|---------|------|
| **Header** | Algorithme de signature et type de token | Métadonnées du token |
| **Payload** | Claims (informations sur l'utilisateur, validité, scopes…) | Données utiles |
| **Signature** | Hash signé du header+payload | Garantit l'intégrité du token |

---

## 🌐 3.2 Décodage en ligne via [jwt.io](https://www.jwt.io/)

1. Copier l'access token obtenu à l'étape précédente
2. Ouvrir <https://www.jwt.io/>
3. Coller le token dans la zone **Encoded**
4. Le site affiche automatiquement le **Header** et le **Payload** décodés

📸 **Screenshot à prendre :** `20-jwt-io-decoded.png` — token collé sur jwt.io avec header et payload visibles

---

## 🔍 3.3 Analyse du Header

Exemple typique :

```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "abc-123-def-456"
}
```

| Claim | Description |
|-------|-------------|
| `alg` | Algorithme de signature. **RS256** = RSA + SHA-256 (asymétrique). Keycloak utilise RS256 par défaut, ce qui permet aux clients de **vérifier** la signature avec la clé publique sans connaître la clé privée. |
| `typ` | Type du token. Toujours `JWT`. |
| `kid` | Key ID — identifiant de la clé publique à utiliser pour vérifier la signature. Permet de gérer la **rotation des clés**. |

> 🔑 **À savoir** : Keycloak expose ses clés publiques sur l'endpoint JWKS :
> `http://localhost:8080/realms/demo-realm/protocol/openid-connect/certs`

---

## 🔍 3.4 Analyse du Payload (claims)

Exemple typique d'un access token Keycloak :

```json
{
  "exp": 1745849700,
  "iat": 1745849400,
  "jti": "uuid-token",
  "iss": "http://localhost:8080/realms/demo-realm",
  "aud": "account",
  "sub": "uuid-user",
  "typ": "Bearer",
  "azp": "react-spa",
  "session_state": "uuid-session",
  "acr": "1",
  "allowed-origins": ["http://localhost:5173"],
  "realm_access": {
    "roles": ["default-roles-demo-realm", "offline_access", "uma_authorization"]
  },
  "resource_access": {
    "account": {
      "roles": ["manage-account", "view-profile"]
    }
  },
  "scope": "openid email profile",
  "sid": "uuid-session",
  "email_verified": true,
  "name": "Test User",
  "preferred_username": "testuser",
  "given_name": "Test",
  "family_name": "User",
  "email": "testuser@efrei.local"
}
```

### Claims standards (RFC 7519)

| Claim | Signification | Exemple |
|-------|---------------|---------|
| `iss` | **Issuer** — qui a émis le token | `http://localhost:8080/realms/demo-realm` |
| `sub` | **Subject** — identifiant unique de l'utilisateur (UUID) | `f8a3d...` |
| `aud` | **Audience** — destinataire prévu du token | `account` |
| `exp` | **Expiration** — timestamp Unix après lequel le token est invalide | `1745849700` |
| `iat` | **Issued At** — timestamp Unix d'émission | `1745849400` |
| `jti` | **JWT ID** — identifiant unique du token (anti-rejeu) | `uuid` |
| `nbf` | **Not Before** — token invalide avant ce timestamp | *(parfois absent)* |

### Claims spécifiques OIDC / Keycloak

| Claim | Signification |
|-------|---------------|
| `typ` | Type de token : `Bearer` pour un access token |
| `azp` | **Authorized Party** — client OAuth qui a obtenu le token |
| `scope` | Scopes OAuth accordés (espacés) |
| `realm_access.roles` | Rôles globaux au realm |
| `resource_access.<client>.roles` | Rôles spécifiques par client |
| `preferred_username` | Login utilisateur |
| `email` / `email_verified` | Email et statut de vérification |
| `given_name` / `family_name` / `name` | Identité affichée |
| `sid` / `session_state` | Identifiants de session SSO |
| `acr` | Niveau d'authentification (1 = mot de passe simple, 2 = MFA) |

---

## 🔐 3.5 Analyse de la Signature

La signature garantit que :
1. Le token n'a **pas été modifié** depuis son émission
2. Il a bien été émis par Keycloak (et pas un attaquant)

**Calcul** (RS256) :

```
signature = RSA-SHA256(
  base64url(header) + "." + base64url(payload),
  clé_privée_keycloak
)
```

**Vérification côté client** :

```
verify(signature, base64url(header) + "." + base64url(payload), clé_publique_keycloak)
```

> ⚠️ **Erreur fréquente** : ne jamais faire confiance au contenu d'un JWT sans **vérifier sa signature**. Le payload est en Base64, pas chiffré : tout le monde peut le lire, mais seul le détenteur de la clé privée peut le générer/modifier valablement.

📸 **Screenshot à prendre :** `21-jwt-io-signature.png` — partie signature sur jwt.io (avec ou sans clé publique chargée pour montrer la vérification)

---

## 🛡️ 3.6 Bonnes pratiques de sécurité

1. **Toujours vérifier la signature** côté serveur ou via une lib éprouvée (jose, keycloak-js, etc.)
2. **Utiliser HTTPS** en production — un JWT volé = compte compromis jusqu'à expiration
3. **Durée de vie courte** pour l'access token (5-15 min) + refresh token longue durée
4. **Vérifier `iss`, `aud`, `exp`** systématiquement
5. **Stocker en mémoire** côté SPA (pas en localStorage) pour éviter le vol par XSS
6. **Révocation** : implémenter un mécanisme côté Keycloak (logout backchannel, introspection)

---

## ✅ 3.7 Récap

- ✅ Tu sais de quoi est composé un JWT (header / payload / signature)
- ✅ Tu sais lire et expliquer chaque claim
- ✅ Tu connais les claims standards et ceux spécifiques OIDC / Keycloak
- ✅ Tu comprends le rôle de la signature et ses implications sécurité

➡️ **Prochaine étape :** [`04-react-app.md`](04-react-app.md)
