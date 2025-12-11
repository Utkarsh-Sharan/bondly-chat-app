import { Router } from "express";
import {
  getAllContacts,
  getMessagesByUserId,
  sendMessagetoUser,
  getChatPartners,
} from "../controllers/message.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/contacts").get(verifyJWT, getAllContacts);
router.route("/chats").get(verifyJWT, getChatPartners);
router.route("/get-messages/:id").get(verifyJWT, getMessagesByUserId);
router.route("/send-message/:id").post(verifyJWT, sendMessagetoUser);

export default router;