import dotenv from "dotenv";
dotenv.config();

import express from "express"; 
import { connectDB } from "../src/config/db.js";
import userRoutes from "../src/route/userRoute.js";
import path from "path";
import { errorHandler } from "./midleware/errorMiddleware.js";
import adminRoutes from "./route/adminRoute.js";

const app = express();
const PORT = 5000;
app.use(errorHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads",express.static(path.join(process.cwd(), "uploads")));

connectDB();

app.use("/",userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Node.js is running!");
});                                                           

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
