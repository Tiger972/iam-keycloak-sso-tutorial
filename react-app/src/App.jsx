import { useEffect, useState } from 'react';
import keycloak from './keycloak';
import JwtTable from './JwtTable';

/**
 * Composant principal.
 *
 * Initialise Keycloak avec le flow Authorization Code + PKCE (S256),
 * gère l'état d'authentification et affiche le contenu décodé du JWT.
 *
 * Un seul useEffect : Keycloak doit être initialisé une seule fois,
 * sinon on déclenche une boucle de redirection.
 */
function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);
  const [tokenParsed, setTokenParsed] = useState(null);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    // Garde-fou contre la double exécution due à React StrictMode en dev.
    // keycloak-js ne supporte pas plusieurs init sur la même instance.
    if (keycloak.didInitialize) return;

    keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .then((authStatus) => {
        setAuthenticated(authStatus);
        if (authStatus) {
          setTokenParsed(keycloak.tokenParsed);
          setAccessToken(keycloak.token);
        }
      })
      .catch((err) => {
        console.error('Erreur initialisation Keycloak :', err);
        setError('Impossible de se connecter au serveur Keycloak. Vérifie que le conteneur Docker tourne sur http://localhost:8080.');
      })
      .finally(() => setInitializing(false));

    // Auto-refresh du token avant expiration
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(30).then((refreshed) => {
        if (refreshed) {
          setTokenParsed(keycloak.tokenParsed);
          setAccessToken(keycloak.token);
        }
      });
    };
  }, []);

  const handleLogin = () => keycloak.login();
  const handleLogout = () => keycloak.logout({ redirectUri: window.location.origin });

  if (initializing) {
    return (
      <div className="container">
        <div className="card">
          <p className="loading">⏳ Initialisation de Keycloak…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card error">
          <h2>❌ Erreur</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🔐 IAM Keycloak — JWT Decoder</h1>
        <p className="subtitle">
          SPA React avec authentification SSO via Keycloak (OIDC + PKCE)
        </p>
      </header>

      {!authenticated ? (
        <div className="card center">
          <h2>Bienvenue</h2>
          <p>Connecte-toi pour récupérer et décoder ton JWT.</p>
          <button className="btn btn-primary" onClick={handleLogin}>
            🔑 Se connecter via Keycloak
          </button>
        </div>
      ) : (
        <>
          <div className="card user-card">
            <div>
              <h2>✅ Connecté</h2>
              <p>
                <strong>Utilisateur :</strong> {tokenParsed?.preferred_username}{' '}
                ({tokenParsed?.email || 'pas d\'email'})
              </p>
            </div>
            <button className="btn btn-secondary" onClick={handleLogout}>
              🚪 Se déconnecter
            </button>
          </div>

          <div className="card">
            <h2>🎫 Access Token (JWT)</h2>
            <p className="hint">Tu peux le copier-coller sur <a href="https://www.jwt.io/" target="_blank" rel="noopener noreferrer">jwt.io</a> pour le décoder en ligne.</p>
            <textarea
              className="token-box"
              value={accessToken}
              readOnly
              rows={5}
              onClick={(e) => e.target.select()}
            />
          </div>

          <div className="card">
            <h2>📋 Payload décodé</h2>
            <p className="hint">Contenu du JWT décodé directement par <code>keycloak-js</code> (pas besoin de bibliothèque tierce).</p>
            <JwtTable payload={tokenParsed} />
          </div>
        </>
      )}

      <footer className="footer">
        <p>
          PIQUIONNE Andy — IAM M1-CSM 2026 — EFREI Paris
        </p>
      </footer>
    </div>
  );
}

export default App;
