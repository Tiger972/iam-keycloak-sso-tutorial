/**
 * Tableau HTML stylisé affichant le payload d'un JWT.
 *
 * - Les claims standards OIDC sont accompagnés d'une description.
 * - Les timestamps Unix (iat, exp, auth_time, nbf) sont convertis en date lisible.
 * - Les valeurs complexes (objets, tableaux) sont affichées en JSON formaté.
 */

const CLAIM_DESCRIPTIONS = {
  // Claims JWT standards (RFC 7519)
  iss: 'Issuer — émetteur du token (URL du realm Keycloak)',
  sub: 'Subject — identifiant unique de l\'utilisateur (UUID)',
  aud: 'Audience — destinataire(s) prévu(s) du token',
  exp: 'Expiration Time — date d\'expiration du token',
  nbf: 'Not Before — date avant laquelle le token n\'est pas valide',
  iat: 'Issued At — date d\'émission du token',
  jti: 'JWT ID — identifiant unique du token',

  // Claims OIDC / Keycloak
  typ: 'Type — type de token (Bearer pour un access token)',
  azp: 'Authorized Party — client OAuth qui a demandé le token',
  session_state: 'Identifiant de la session SSO côté Keycloak',
  acr: 'Authentication Context Class Reference — niveau d\'authentification',
  scope: 'Scopes OAuth accordés (espace séparé)',
  sid: 'Session ID — identifiant de session OIDC',
  email_verified: 'Email vérifié',
  preferred_username: 'Nom d\'utilisateur préféré',
  given_name: 'Prénom',
  family_name: 'Nom de famille',
  email: 'Adresse email',
  name: 'Nom complet',
  realm_access: 'Rôles attribués au niveau du realm',
  resource_access: 'Rôles attribués par client/ressource',
  allowed_origins: 'Origines CORS autorisées',
};

const TIMESTAMP_CLAIMS = ['exp', 'iat', 'nbf', 'auth_time'];

function formatValue(key, value) {
  if (value === null || value === undefined) return <em className="muted">null</em>;

  if (TIMESTAMP_CLAIMS.includes(key) && typeof value === 'number') {
    const date = new Date(value * 1000);
    return (
      <span>
        <code>{value}</code>
        <br />
        <span className="muted">→ {date.toLocaleString('fr-FR')}</span>
      </span>
    );
  }

  if (typeof value === 'object') {
    return <pre className="json-cell">{JSON.stringify(value, null, 2)}</pre>;
  }

  if (typeof value === 'boolean') {
    return <code>{value ? 'true' : 'false'}</code>;
  }

  return <code>{String(value)}</code>;
}

function JwtTable({ payload }) {
  if (!payload) {
    return <p className="muted">Aucun payload disponible.</p>;
  }

  const entries = Object.entries(payload);

  return (
    <div className="table-wrapper">
      <table className="jwt-table">
        <thead>
          <tr>
            <th>Claim</th>
            <th>Valeur</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key}>
              <td className="claim-name"><strong>{key}</strong></td>
              <td className="claim-value">{formatValue(key, value)}</td>
              <td className="claim-desc">
                {CLAIM_DESCRIPTIONS[key] || <span className="muted">— claim spécifique —</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JwtTable;
