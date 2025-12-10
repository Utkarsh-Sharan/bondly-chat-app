import { Router } from "express";
import { signup, login, logout } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userSignupValidator,
  userLoginValidator,
} from "../validators/index.js";

const router = Router();

//Un-protected routes
router.route("/signup").post(userSignupValidator(), validate, signup);

router.route("/login").post(userLoginValidator(), validate, login);

//Protected routes
router.route("/logout").post(logout);

export default router;
