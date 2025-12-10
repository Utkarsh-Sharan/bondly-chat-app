import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.model.js";
import { sendWelcomeEmail } from "../utils/email-handler.js";

export const signup = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new ApiError(409, "User with this email already exists!");

  const user = await User.create({
    fullname,
    email,
    password,
  });

  await user.save({ validateBeforeSave: false });

  try {
    await sendWelcomeEmail(user.email, user.fullname, process.env.CLIENT_URL);
  } catch (error) {
    throw new ApiError(400, "Failed to send welcome email!");
  }

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );
  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user!");

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User registered successfully!",
      ),
    );
});

export const login = asyncHandler(async (req, res) => {
  
});

export const logout = asyncHandler(async (req, res) => {});
