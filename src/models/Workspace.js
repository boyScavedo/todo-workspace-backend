import mongoose from "mongoose";
import { workspaceInviteCodeGenerator } from "../lib/generator.js";
import { workspaceConnection } from "../config/db.js";

/**
 * @openapi
 * components:
 *   schemas:
 *     Workspace:
 *       type: object
 *       required:
 *         - name
 *         - owner
 *       properties:
 *         _id:
 *           type: mongoose.Types.ObjectId
 *           description: The auto-generated id of the workspace (MongoDB ObjectId)
 *         name:
 *           type: string
 *           example: "Rato Guras Technology"
 *         description:
 *           type: string
 *           maxLenth: 200
 *           default: "A blank canvas has the most potential"
 *         owner:
 *           type: mongoose.Types.ObjectId
 *           description: The one who owns the workspace
 *         members:
 *           type: object
 *           description: All the members who have joined the workspace and their workspace specific details
 *           properties:
 *             userId:
 *               type: string
 *               required: true
 *             roles:
 *               type: string
 *               enum: ['member', 'admin']
 *               default: 'admin'
 *             joinedAt:
 *               type: Date
 *               default: Date.now
 *         inviteCode:
 *           type: String
 *           unique: true
 *           description: Unique slug code for joining the workspace
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const workspaceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 200,
      default: "A blank canvas has the most potential",
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        email: {
          type: String,
        },
        role: {
          type: String,
          enum: ["member", "admin"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ToDoChannel",
      },
    ],
    inviteCode: {
      type: String,
      unique: true,
      default: workspaceInviteCodeGenerator,
    },
  },
  { timestamps: true }
);

const Workspace = workspaceConnection.model("Workspace", workspaceSchema);

export default Workspace;
