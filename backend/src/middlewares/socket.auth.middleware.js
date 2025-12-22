import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";

export const socketAuth = asyncHandler(async (socket, next) => {
  const accessToken = socket.handshake.headers.cookie
    ?.split("; ")
    .find((row) => row.startsWith("jwt="))
    ?.split("=")[1];

  if (!accessToken)
    throw new ApiError(400, "Socket connection failed: No token provided!");

  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (!user)
      throw new ApiError(401, "Socket connection failed: User not found!");

    socket.user = user;
    socket.userId = user._id.toString();

    next();
  } catch (error) {
    throw new ApiError(401, "Socket connection failed: Invalid access token!");
  }
});
