const { check } = require("express-validator");

exports.userRegisterValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid Email address required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
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
