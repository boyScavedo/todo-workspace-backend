import express from "express";

import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUser,
  userVerification,
} from "../controllers/userController.js";
import authVerification from "../middleware/authVerification.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/users/:
 *   get:
 *     summary: Returns the list of all users
 *     tags: [Users]
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
 *           description: The number of users per page
 *     responses:
 *       200:
 *         description: The list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Fetched X user records out of Y record from record A to record B'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Something went wrong with the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: string
 *                   example: 'Internal server error'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: 'Some error message'
 */
router.get("/", getAllUsers);

/**
 * @openapi
 * /api/v1/users/me:
 *   get:
 *     summary: Get current logged-in user details
 *     description: Validates the session cookie and returns the user profile information
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User data retrieved successfully
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 'J1231b1233452b...'
 *                     name:
 *                       type: string
 *                       example: 'John Doe'
 *                     email:
 *                       type: string
 *                       example: 'john@example.com'
 *                     workspaces:
 *                       type: array
 *                       items:
 *                         type: string
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: error.message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 data:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: error.message
 */
router.get("/me", authVerification, userVerification);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     summary: Returns the data of the user with the given id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique MongoDB ObjectId of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The data of the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Fetched user record'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: string
 *                   example: 'User not found'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Something went wrong with the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: string
 *                   example: 'Internal server error'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: 'Some error message'
 */
router.get("/:id", getUserById);

/**
 * @openapi
 * /api/v1/users/create:
 *   post:
 *     summary: Creates a new user
 *     tags: [Users]
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
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User created successfully'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: string
 *                   example: 'Email already exists'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Something went wrong with the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: string
 *                   example: 'Internal server error'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: 'Some error message'
 */
router.post("/create", createUser);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   put:
 *     summary: Updates data of an existing user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique MongoDB ObjectId of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
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
 *         description: User record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User record updated successfully'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Email cannot be changed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: string
 *                   example: 'Email cannot be changed'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: string
 *                   example: 'User not found'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Something went wrong with the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: string
 *                   example: 'Internal server error'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: 'Some error message'
 */
router.put("/:id", updateUser);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Deletes an user record with given id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique MongoDB ObjectId of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted data record of the user from the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Deleted user XXXXXXXXXXXXXX successfully'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: string
 *                   example: 'User not found'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: Something went wrong with the server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: string
 *                   example: 'Internal server error'
 *                 data:
 *                   type: array
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   example: 'Some error message'
 */
router.delete("/:id", deleteUserById);

export default router;
