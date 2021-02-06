const express = require("express");

const router = express.Router();

const {
  register,
  registerActivate,
  login,
  invite,
  forgotPassword,
  resetPassword,
  registerPrivate,
} = require("../controllers/auth");

// validators
const {
  userRegisterValidator,
  userRegisterPrivateValidator,
  userLoginValidator,
  userInvitationValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth");

const { runValidation } = require("../validators");

router.post("/invite", userInvitationValidator, runValidation, invite);

router.post(
  "/register/private",
  userRegisterPrivateValidator,
  runValidation,
  registerPrivate
);

router.post("/register", userRegisterValidator, runValidation, register);
router.post("/register/activate", registerActivate);
router.post("/login", userLoginValidator, runValidation, login);

router.put(
  "/forgot-password",
  forgotPasswordValidator,
  runValidation,
  forgotPassword
);

router.put(
  "/reset-password",
  resetPasswordValidator,
  runValidation,
  resetPassword
);
// router.get("/secret", (req, res) => {
//   res.json({
//     data: "This is secret page for logged users only",
//   });
// });

module.exports = router;
