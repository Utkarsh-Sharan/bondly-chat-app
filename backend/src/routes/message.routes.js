import { Router } from "express";
import {
  getAllContacts,
  getMessagesByUserId,
  sendMessagetoUser,
  getChatPartners,
} from "../controllers/message.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = Router();

//Rate limiter/ Bots protection
router.use(arcjetProtection);

//Protected routes
router.route("/contacts").get(verifyJWT, getAllContacts);
router.route("/chats").get(verifyJWT, getChatPartners);
router.route("/get-messages/:id").get(verifyJWT, getMessagesByUserId);
router.route("/send-message/:id").post(verifyJWT, sendMessagetoUser);

export default router;
