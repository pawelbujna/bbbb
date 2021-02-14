const express = require("express");

const router = express.Router();

const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth");

const { read, getUser, remove, getList } = require("../controllers/user");

router.get("/user", requireSignin, authMiddleware, read);
router.get("/user/:salt", requireSignin, adminMiddleware, getUser);
router.get("/admin", requireSignin, adminMiddleware, read);
router.get("/users", requireSignin, adminMiddleware, getList);
router.delete("/user/:salt", requireSignin, adminMiddleware, remove);

module.exports = router;
