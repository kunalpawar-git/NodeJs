import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} from "../controller/adminController.js";
import { protect, authorizeRoles } from "../midleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/users/:id", protect, authorizeRoles("admin"), getUserById);
router.put("/users/:id", protect, authorizeRoles("admin"), updateUserRole);
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
