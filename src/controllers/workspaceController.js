import mongoose from "mongoose";

import User from "../models/User.js";
import Workspace from "../models/Workspace.js";
import { userConnection, workspaceConnection } from "../config/db.js";

export async function getAllWorkspaces(req, res) {
  const userId = req.user.id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const skip = (page - 1) * limit;

  try {
    const totalWorkspaces = await Workspace.countDocuments({
      "members.userId": userId,
    });

    const workspaces = await Workspace.find({ "members.userId": userId })
      .skip(skip)
      .limit(limit);

    console.log(totalWorkspaces, workspaces);

    res.status(200).json({
      message: "Fetched workspaces successfully",
      data: workspaces,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      data: null,
      error: error.message,
    });
  }
}

export async function createWorkspace(req, res) {
  const { name, description } = req.body;
  var retryCount = 0;
  const maxRetries = 10;

  while (retryCount < maxRetries) {
    try {
      const newWorkspace = await Workspace.create({
        name,
        description,
        owner: req.user.id,
        members: [
          {
            userId: req.user.id,
            email: req.user.email,
            role: "admin",
          },
        ],
      });

      return res.status(201).json({
        message: "Workspace created successfully",
        data: newWorkspace,
        error: null,
      });
    } catch (error) {
      const isDuplicateInviteCode =
        error.code === 11000 && error.message.includes("inviteCode");

      if (retryCount == maxRetries - 1) {
        return res.status(500).json({
          message: "Duplicate invite code, please try again later",
          data: null,
          error: null,
        });
      }

      if (isDuplicateInviteCode) {
        retryCount++;
        continue;
      }

      return res.status(500).json({
        message: "Internal server error",
        data: null,
        error: error.message,
      });
    }
  }
}

export async function updateWorkspace(req, res) {
  const { name, description } = req.body;

  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace)
      return res
        .status(404)
        .json({ message: "Workspace not found", data: null, error: null });

    if (name) workspace.name = name;
    if (description) workspace.description = description;

    const updatedWorkspace = await workspace.save();

    res.status(200).json({
      message: "Updated workspace successfully",
      data: updatedWorkspace,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      data: null,
      error: error.message,
    });
  }
}

export async function deleteWorkspace(req, res) {
  try {
    const userId = req.user.id;
    const workspace = await Workspace.findOne({
      _id: req.params.id,
      owner: userId,
    });

    if (!workspace)
      return res
        .status(401)
        .json({ message: "Unauthorized", data: null, error: null });

    const deletedWorkspace = await Workspace.findByIdAndDelete(req.params.id);

    if (!deletedWorkspace)
      return res
        .status(404)
        .json({ message: "Workspace not found", data: null, error: null });

    res.status(200).json({
      message: `Deleted workspace ${req.params.id} successfully`,
      data: null,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      data: null,
      error: error.message,
    });
  }
}

export async function addUserToWorkspace(req, res) {
  const { inviteCode } = req.params;

  try {
    const workspace = await Workspace.findOne({ inviteCode });
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!workspace)
      return res
        .status(404)
        .json({ message: "Invalid invite code", data: null, error: null });

    const isAlreadyMember = workspace.members.some(
      (m) => m.userId.toString() === req.user.id.toString()
    );

    if (isAlreadyMember)
      return res.status(400).json({
        message: "You are already an member",
        data: null,
        error: null,
      });

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      workspace._id,
      { $push: { members: { userId, email: user.email } } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { workspaces: workspace._id },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Added user to workspace successfully",
      data: updatedWorkspace,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      data: null,
      error: error.message,
    });
  }
}

export async function removeUserFromWorkspace(req, res) {
  const requestUserId = req.user.id;
  const workspaceId = req.params.workspaceId;
  const toDeleteUserId = req.params.userId;

  const userSession = await userConnection.startSession();
  const workspaceSession = await workspaceConnection.startSession();
  userSession.startTransaction();
  workspaceSession.startTransaction();
  try {
    const workspace = await Workspace.findOneAndUpdate(
      {
        _id: workspaceId,
        members: {
          $all: [
            { $elemMatch: { userId: requestUserId, role: "admin" } },
            { $elemMatch: { userId: toDeleteUserId, role: "member" } },
          ],
        },
      },
      {
        $pull: {
          members: { userId: toDeleteUserId },
        },
      },
      { new: true, workspaceSession }
    );

    if (!workspace) {
      await userSession.abortTransaction();
      await workspaceSession.abortTransaction();

      return res
        .status(400)
        .json({ message: "Invalid request", data: null, error: null });
    }
    await User.findByIdAndUpdate(
      toDeleteUserId,
      { $pull: { workspaces: workspaceId } },
      { userSession }
    );

    await userSession.abortTransaction();
    await workspaceSession.abortTransaction();

    return res.status(200).json({
      message: "User removed successfully",
      data: workspace,
      error: null,
    });
  } catch (error) {
    await userSession.abortTransaction();
    await workspaceSession.abortTransaction();

    return res.status(500).json({
      message: "Internal server error",
      data: null,
      error: error.message,
    });
  } finally {
    await userSession.endSession();
    await workspaceSession.endSession();
  }
}
