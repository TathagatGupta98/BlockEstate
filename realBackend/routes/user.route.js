import { registerUser,loginUser,logoutUser } from "../controllers/user.controller";
import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router=Router();
router.post("/register",registerUser)
router.post("/login",loginUser);
router.post("/logout",verifyJWT,logoutUser);
export default router;