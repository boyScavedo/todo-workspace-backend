import mongoose from "mongoose";

export const userConnection = mongoose.createConnection(
  process.env.MONGO_USERS_URI
);
export const workspaceConnection = mongoose.createConnection(
  process.env.MONGO_WORKSPACES_URI
);

export async function connectDB() {
  try {
    // We wrap the connections in a Promise.all to wait for BOTH to finish
    await Promise.all([
      userConnection.asPromise(),
      workspaceConnection.asPromise(),
    ]);

    console.log("ALL DATABASES CONNECTED");

    // Optional: Keep your event listeners for logging future errors
    userConnection.on("error", (err) => console.error("USER DB ERROR:", err));
    workspaceConnection.on("error", (err) =>
      console.error("WORKSPACE DB ERROR:", err)
    );
  } catch (error) {
    console.error("DATABASE CONNECTION FAILED:", error);
    throw error; // Re-throw so your server start logic knows it failed
  }
}
