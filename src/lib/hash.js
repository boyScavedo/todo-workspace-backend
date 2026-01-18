import "dotenv/config";
import bcrypt from "bcryptjs";

// Operation: Hashes a given password
// Additional Utilities: bcryptjs
// Inputs: password from request body
// Outputs: salt and hash of the password
export async function hashPassword(password) {
  const salt = (await bcrypt.genSalt(Number(process.env.HASH_ITERATION)));
  const hash = (await bcrypt.hash(password, salt));
  return { salt, hash };
}

export async function comparePassword(givenPassword, userPassword) {
  const response = await bcrypt.compare(givenPassword, userPassword);
  return response;
}
