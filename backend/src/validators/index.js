import { body } from "express-validator";

const userSignupValidator = () => {
  return [
    body("fullname")
      .trim()
      .notEmpty()
      .withMessage("Full name is required!")
      .isLength({ min: 5, max: 15 })
      .withMessage("Full name must be 5 to 15 characters long!"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required!")
      .isLength({ min: 8, max: 12 })
      .withMessage("Password must be 8 to 12 characters long!"),
  ];
};

export { userSignupValidator };
