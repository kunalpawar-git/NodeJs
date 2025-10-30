import express from "express";
import { 
    registerUser,
    loginUser,
    updateProfile,
    updatePassword
} from "../controller/userController.js";
import { upload } from "../midleware/uploadMiddleware.js";
import { protect } from "../midleware/authMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("profilePhoto"), registerUser);
router.post("/login", loginUser);
router.put("/update-profile",protect,updateProfile);
router.put("/update-password",protect,updatePassword);

export default router;
