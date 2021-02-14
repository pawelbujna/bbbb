const { check } = require("express-validator");

exports.userRegisterPrivateValidator = [
  check("name").notEmpty().withMessage("Imie jest wymagane"),
  check("email").isEmail().withMessage("Poprawny adres email wymagany"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Hasło musi zawierać conajmniej 6 znaków"),
  check("token").notEmpty().withMessage("Brak numeru token"),
];

exports.userRegisterValidator = [
  check("name").notEmpty().withMessage("Imie jest wymagane"),
  check("email").isEmail().withMessage("Poprawny adres email wymagany"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Hasło musi zawierać conajmniej 6 znaków"),
  check("token").notEmpty().withMessage("Brak numeru token"),
];

exports.userInvitationValidator = [
  check("email").notEmpty().withMessage("Email jest wymagany"),
];

exports.userLoginValidator = [
  check("email").isEmail().withMessage("Poprawny adres email wymagany"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Hasło musi zawierać conajmniej 6 znaków"),
];

exports.forgotPasswordValidator = [
  check("email").isEmail().withMessage("Poprawny adres email wymagany"),
];

exports.resetPasswordValidator = [
  check("newPassword")
    .isLength({ min: 6 })
    .withMessage("Hasło musi zawierać conajmniej 6 znaków"),
  check("resetPasswordLink")
    .notEmpty()
    .withMessage("Poprawny adres email wymagany"),
];
