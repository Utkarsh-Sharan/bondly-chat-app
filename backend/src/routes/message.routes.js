import { Router } from "express";
import { getAllContacts } from "../controllers/message.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/contacts").get(verifyJWT, getAllContacts);
// router.route("/chats").get(getChatParteners);
router.route("/get-message/:id").get(getMessagesByUserId);
// router.route("/send-message/:id").post(sendMessagetoUser);

export default router;