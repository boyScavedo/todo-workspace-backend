import mongoose from "mongoose";

export const userConnection = mongoose.createConnection(
  process.env.MONGO_USERS_URI
);
export const workspaceConnection = mongoose.createConnection(
  process.env.MONGO_WORKSPACES_URI
);

export function connectDB() {
  userConnection.on("connected", () => console.log("USER DATABASE CONNECTED"));
  workspaceConnection.on("connected", () =>
    console.log("WORKSPACE DATABASE CONNECTED")
  );

  userConnection.on("error", (err) => console.log("USER DATABASE ERROR", err));
  workspaceConnection.on("error", (err) =>
    console.log("WORKSPACE DATABASE ERROR", err)
  );
}
