import mongoose from "mongoose";
import { userConnection } from "../config/db.js";

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - passwordSalt
 *         - passwordHash
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user (MongoDB ObjectId)
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         passwordSalt:
 *           type: string
 *           deprecated: true
 *           description: The auto-generated password hashing salt (bcrypt)
 *         passwordHash:
 *           type: string
 *           description: The auto-generated password hash using given password and salt (bcrypt)
 *         membership:
 *           type: number
 *           deprecated: true
 *           description: Number of membership
 *         workspaces:
 *           type: array
 *           description: All the workspaces joined by the user
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const userSchema = mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true },

    /** @deprecated passwordSalt is already stored inside passwordHash in bcrypt */
    passwordSalt: { type: String, required: true },

    passwordHash: { type: String, required: true },

    // DEPRECATED: membership will be deprecated and will be removed in v1.0.0, use workspaces
    /** @deprecated Use user.workspaces.length instead*/
    membership: { type: Number, default: 0 },

    workspaces: [{ type: mongoose.Types.ObjectId, ref: "Workspace" }],
  },
  { timestamps: true }
);

const User = userConnection.model("User", userSchema);

export default User;
