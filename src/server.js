import app from "./app.js"
import { connectDB } from "./config/db.js";

async function startServer() {
  try {
    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(error, "\n Trying again after 1 minute...");

    setTimeout(() => {
      startServer();
    }, 1 * 60 * 1000);
  }
}

startServer();