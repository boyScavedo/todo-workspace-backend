import express from "express";

import authVerification from "../middleware/authVerification.js";
import {
  addUserToWorkspace,
  createWorkspace,
  deleteWorkspace,
  getAllWorkspaces,
  updateWorkspace,
} from "../controllers/workspaceController.js";

const router = express.Router();

/**
 * @openapi
 * /tw/v1/workspaces:
 *   get:
 *     summary: Verifies the user via cookie token, then shows the list of workspaces of the user
 *     tags: [Workspaces]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           description: The page number to retrieve
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           description: The amount of record to retrieve from the page
 *     responses:
 *       200:
 *         description: Fetched all workspaces of the logged in user successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Fetched X workspace records out of Y record from record A to record B'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   items:
 *                     $ref: "#/components/schemas/Workspace"
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: 'Something is wrong'
 */
router.get("/", authVerification, getAllWorkspaces);

/**
 * @openapi
 * /tw/v1/workspaces:
 *   post:
 *     summary: Verifies the user via cookie token, then creates a workspace based on the information on the token
 *     tags: [Workspaces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               _id:
 *
 *
 */
router.post("/", authVerification, createWorkspace);
router.patch("/:id", authVerification, updateWorkspace);
router.delete("/:id", authVerification, deleteWorkspace);
router.post("/:inviteCode", authVerification, addUserToWorkspace);

export default router;
