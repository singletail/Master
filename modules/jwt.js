const fs = require('node:fs');
const jose = require('jose');
const config = require('../config');
const log = require('../config/logger.js');

const jwt_private = fs.readFileSync(config.jwt.private, 'utf8');
//const jwt_public = fs.readFileSync(config.jwt.public, "utf8");

//let keyPublic = "";
let keyPrivate = '';

(async () => {
  keyPrivate = await jose.importPKCS8(jwt_private, 'EdDSA');
  //keyPublic = await jose.importSPKI(jwt_public, "EdDSA");
})();

const createJWT = async (uuid) => {
  let now = Math.floor(Date.now() / 1000);
  const data = {
    iss: config.url,
    aud: config.url,
    iat: now,
    jti: uuid,
  };
  return data;
};

const signJWT = async (jwtObj) => {
  let now = Math.floor(Date.now() / 1000);
  let exp = now + 3600000;
  const jwt = await new jose.SignJWT(jwtObj)
    .setProtectedHeader({ alg: 'EdDSA' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .setIssuer(config.url)
    .setAudience(config.url)
    .sign(keyPrivate);
  return jwt;
};

const verifyJWT = async (jwt) => {
  let verification;
  let now = Math.floor(Date.now() / 1000);
  const claims = jose.decodeJwt(jwt);
  if (claims.exp && claims.exp > now) {
    const { payload } = await jose.jwtVerify(jwt, keyPrivate, {
      issuer: config.url,
      audience: config.url,
    });
    if (!payload.jti) {
      log.warn(`warning: bad payload ${jwt}`);
    } else {
      verification = payload.jti;
    }
  } else {
    log.warn('token expired');
  }
  return verification;
};

module.exports = { createJWT, signJWT, verifyJWT };
