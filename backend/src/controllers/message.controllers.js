import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

export const getAllContacts = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;
  const filteredUsers = await User.find({
    _id: { $ne: loggedInUserId },
  }).select("-password -refreshToken");

  if (!filteredUsers) throw new ApiError(400, "Failed to get all contacts!");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { filteredUsers },
        "Fetched all users successfully!",
      ),
    );
});

export const getMessagesByUserId = asyncHandler(async (req, res) => {
  const myId = req.user._id;
  const { id: partenerId } = req.params;

  if (!partenerId) throw new ApiError(400, "Failed to get partner id!");

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: partenerId }, //either i am the sender
      { senderId: partenerId, receiverId: myId }, //or i am the receiver, get both messages
    ],
  });

  if (!messages)
    throw new ApiError(
      400,
      "Unable to get the messages, Please try again later!",
    );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { messages }, "Fetched all messages successfully!"),
    );
});
