import mongoose from "mongoose";

/**
 * @openapi
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - name
 *         - channelId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the individual task (MongoDB ObjectId)
 *         name:
 *           type: string
 *           example: "Create Front-end"
 *         content:
 *           type: string
 *           default: "A blank canvas has the most potential"
 *         channelId:
 *           description: The one who owns the workspace
 *         status:
 *           description: What is the status of the task.
 *           enum: ['onboarding', 'doing', 'for review', 'done']
 *         priority:
 *           description: What is the priority of the task?
 *           enum: ['low', 'medium', 'high']
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
const TaskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["boarding", "doing", "for review", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ToDoChannel",
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

export default Task;
