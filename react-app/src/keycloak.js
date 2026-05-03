import Keycloak from 'keycloak-js';

/**
 * Instance singleton Keycloak.
 *
 * Configuration via variables d'environnement Vite (.env).
 * En cas d'absence, fallback sur des valeurs locales par défaut.
 */
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'demo-realm',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'react-spa',
});

export default keycloak;
