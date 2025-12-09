import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [8, "Password should be at least 8 characters long!"],
      maxlength: [12, "Password should be at most 12 characters long!"],
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
