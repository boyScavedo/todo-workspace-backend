import express from "express";
import {
  loginAuth,
  registerAuth,
  logoutAuth,
} from "../controllers/authController.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: creates a token if user credentials are valid
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'john@example.com'
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 'StrongPassword123!'
 *     responses:
 *       200:
 *         description: User is successfully logged in with their token for 30 days
 *         headers:
 *           Set-Cookie:
 *             description: The "token" cookie. Use withCredentials=true in Axios
 *             schema:
 *               type: string
 *               example: token=abc123...; HttpOnly; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Logged in successfully'
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "9398237kj2h..."
 *                     name:
 *                       type: string
 *                       example: 'John Doe'
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: 'john@example.com'
 *                     membership:
 *                       type: number
 *                       deprecated: true
 *                       example: 0
 *                     workspaces:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example:
 *                           '923082340823408...'
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Unauthorized, wrong credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid credentials'
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
 *                   example: 'Invalid credentials'
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 */
router.post("/login", loginAuth);

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: creates a token after creating new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'John Doe'
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'john@example.com'
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 'StrongPassword123!'
 *     responses:
 *       200:
 *         description: User is successfully logged in with their token for 30 days
 *         headers:
 *           Set-Cookie:
 *             description: The "token" cookie. Use withCredentials=true in Axios
 *             schema:
 *               type: string
 *               example: token=abc123...; HttpOnly; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Logged in successfully'
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       409:
 *         description: Email already in use
 *         content:
 *           applicaiton/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email already in use"
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
 *                   example: "Email already in use"
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 */
router.post("/register", registerAuth);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     summary: replaces current token with expired one token with blank string as value
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User is successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Logged out successfully'
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
 *                   example: 'Logged out successfully'
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 */
router.post("/logout", logoutAuth);

export default router;
