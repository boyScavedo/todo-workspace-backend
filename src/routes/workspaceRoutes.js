import express from "express";

import authVerification from "../middleware/authVerification.js";
import {
  addUserToWorkspace,
  createWorkspace,
  deleteWorkspace,
  getAllWorkspaces,
  removeUserFromWorkspace,
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
 *     summary: Verifies the user via cookie token, then creates a workspace based on the information on the request body
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
 *               name:
 *                 type: string
 *                 example: "My workspace 1"
 *               description:
 *                 type: string
 *                 example: "My workspace content description"
 *     responses:
 *       201:
 *         description: Created new workspace using user authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Created new workspace successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   $ref: '#/components/schemas/Workspace'
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
 *                   example: "Unauthorized"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       500:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: "Something went wrong"
 */
router.post("/", authVerification, createWorkspace);

/**
 * @openapi
 * /tw/v1/workspaces/{id}:
 *   patch:
 *     summary: Verifies the user via cookie token, then updates a workspace based on the information on the request body
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: workspace id
 *         schema:
 *           type: string
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
 *               name:
 *                 type: string
 *                 example: "My workspace 1"
 *               description:
 *                 type: string
 *                 example: "My workspace content description"
 *     responses:
 *       200:
 *         description: Updated workspace successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Updated workspace successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   $ref: '#/components/schemas/Workspace'
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
 *                   example: "Unauthorized"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       500:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: "Something went wrong"
 */
router.patch("/:id", authVerification, updateWorkspace);

/**
 * @openapi
 * /tw/v1/workspaces/{id}:
 *   delete:
 *     summary: Verifies the user via cookie token, then checks if the user is the owner, then the specific workspace is deleted
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: workspace id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted workspace using user authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Deleted workspace successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
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
 *                   example: "Unauthorized"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       500:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: "Something went wrong"
 */
router.delete("/:id", authVerification, deleteWorkspace);

/**
 * @openapi
 * /tw/v1/workspaces/join/{inviteCode}:
 *   post:
 *     summary: Adds a user to workspace based on their login token and the invitecode
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: inviteCode
 *         required: true
 *         description: workspace invite code
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Added user to workspace using user authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Added user to workspace successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   $ref: '#/components/schemas/Workspace'
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Already a member
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You are already a member of this workspace"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Invite code not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid invite code"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       500:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: "Something went wrong"
 */
router.post("/join/:inviteCode", authVerification, addUserToWorkspace);

/**
 * @openapi
 * /tw/v1/workspaces/{workspaceId}/remove/{userId}:
 *   patch:
 *     summary: Removes the user from the workspace
 *     tags: [Workspaces]
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         description: workspace id
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         description: to remove user id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Removed user from workspace using user token authentication (check for admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Added user to workspace successfully"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   $ref: '#/components/schemas/Workspace'
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Either requesting user is not admin or to delete user either doesn't exist or is not a member (i.e. admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       500:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: "Something went wrong"
 */
router.patch(
  "/:workspaceId/remove/:userId",
  authVerification,
  removeUserFromWorkspace,
);

export default router;
