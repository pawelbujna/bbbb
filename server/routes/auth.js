const express = require("express");

const router = express.Router();

const {
  register,
  registerActivate,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");

// validators
const {
  userRegisterValidator,
  userLoginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/auth");

const { runValidation } = require("../validators");

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
