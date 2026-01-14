import crypto from "crypto";
import JWT from "jsonwebtoken";

export function workspaceInviteCodeGenerator() {
  return crypto.randomBytes(Number(process.env.BYTE_SIZE)).toString("hex");
}

export function generateToken(id) {
  return JWT.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
}
