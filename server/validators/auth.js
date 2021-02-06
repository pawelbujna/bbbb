const { check } = require("express-validator");

exports.userRegisterPrivateValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid Email address required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("token").notEmpty().withMessage("Missing token."),
];

exports.userRegisterValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid Email address required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("token").notEmpty().withMessage("Missing token."),
];

exports.userInvitationValidator = [
  check("email").notEmpty().withMessage("Email is required"),
];

exports.userLoginValidator = [
  check("email").isEmail().withMessage("Valid Email address required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.forgotPasswordValidator = [
  check("email").isEmail().withMessage("Valid Email address required"),
];

exports.resetPasswordValidator = [
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("resetPasswordLink")
    .notEmpty()
    .withMessage("Valid Email address required"),
];
