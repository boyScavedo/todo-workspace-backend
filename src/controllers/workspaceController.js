import User from "../models/User.js";
import Workspace from "../models/Workspace.js";

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

  console.log(req.user.id);

  try {
    const newWorkspace = await Workspace.create({
      name,
      description,
      owner: req.user.id,
      members: [
        {
          userId: req.user.id,
          role: "admin",
        },
      ],
    });

    res.status(201).json({
      message: "Workspace created successfully",
      data: newWorkspace,
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
    const deletedWorkspace = await Workspace.findByIdAndDelete(req.params.id);

    if (!deletedWorkspace)
      return res
        .status(404)
        .json({ message: "Workspace not found", data: null, error: null });

    res.status(200).json({
      message: `Deleted user ${req.params.id} successfully`,
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
    console.log("invite code check");
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!workspace)
      return res
        .status(404)
        .json({ message: "Invalid invite code", data: null, error: null });

    const isAlreadyMember = workspace.members.find((m) => m.userId === userId);

    if (isAlreadyMember)
      return res.status(400).json({
        message: "You are already an member",
        data: null,
        error: "ALREADY-MEMBER",
      });

    const updatedWorkspace = await Workspace.findByIdAndUpdate(
      workspace._id,
      { $push: { members: { userId, email: user.email } } },
      { new: true }
    );

    await User.findByIdAndUpdate(userId, {
      $push: { workspaces: workspace._id },
    });

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

// export async function removeUserFromWorkspace(req, res) {

// }
