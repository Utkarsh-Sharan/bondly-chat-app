import {Router} from "express";
import { signup, login, logout } from "../controllers/auth.controllers.js";

const router = Router();

router.route("/signup").post(signup);

router.route("/signup").post(login);

router.route("/signup").post(logout);

export default router;