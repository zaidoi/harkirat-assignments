const jwt = require("jsonwebtoken");
const jwtPassword = "secret";
const zod = require("zod");

const emailSchema = zod.string().email();
const passwordSchema = zod.string().min(6);

function signJwt(username, password) {
  const usernameRes = emailSchema.safeParse(username);
  const passwordRes = passwordSchema.safeParse(password);

  if (!usernameRes.success || !passwordRes.success) {
    return null;
  }
  const token = jwt.sign({ username }, jwtPassword);
  return token;
}

function verifyJwt(token) {
  try {
    const verified = jwt.verify(token, jwtPassword);
    return true;
  } catch {
    return false;
  }
}

function decodeJwt(token) {
  const decoded = jwt.decode(token);
  if (decoded) {
    return true;
  } else {
    return false;
  }
}

module.exports = {verifyJwt,signJwt,decodeJwt}
