import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.model.js";

export const signup = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
});

export const login = asyncHandler(async (req, res) => {});

export const logout = asyncHandler(async (req, res) => {});
