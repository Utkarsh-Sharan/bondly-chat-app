import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.model.js";
import { sendWelcomeEmail } from "../utils/email-handler.js";
import cloudinary from "../lib/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens!",
    );
  }
};

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
    console.error("Failed to send welcome email!", error);
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
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "User does not exist!");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(400, "Incorrect Password!");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully!",
      ),
    );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { avatar } = req.body;

  if (!avatar) throw new ApiError(400, "Avatar is required!");

  const userId = req.user._id;

  let uploadAvatar;
  try {
    uploadAvatar = await cloudinary.uploader.upload(avatar);
  } catch (error) {
    throw new ApiError(500, "Failed to upload Avatar!", error);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { "avatar.url": uploadAvatar.secure_url },
    { new: true },
  );

  if(!updatedUser) throw new ApiError(404, "User not found!");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedUser },
        "User profile updated successfully!",
      ),
    );
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully!"));
});
