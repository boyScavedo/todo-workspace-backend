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

router.get("/", authVerification, getAllWorkspaces);
router.post("/", authVerification, createWorkspace);
router.patch("/:id", authVerification, updateWorkspace);
router.delete("/:id", authVerification, deleteWorkspace);
router.post("/:inviteCode", authVerification, addUserToWorkspace);

export default router;
