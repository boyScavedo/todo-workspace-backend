import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *   schemas:
 *     ToDoChannel:
 *       type: object
 *       required:
 *         - name
 *         - workspaceId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the todo channel (MongoDB ObjectId)
 *         name:
 *           type: string
 *           example: "ABC Tech solutions Website"
 *         description:
 *           type: string
 *           maxLenth: 200
 *           default: "A blank canvas has the most potential"
 *         workspaceId:
 *           description: The one who owns the workspace
 *         tasks:
 *           type: array of strings
 *           description: All the tasks inside the channel
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const ToDoChannelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxLength: 200,
      trim: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true }
);

ToDoChannelSchema.index({ name: 1, workspaceId: 1 }, { unique: true });

const ToDoChannel = mongoose.model("ToDoChannel", ToDoChannelSchema);

export default ToDoChannel;
