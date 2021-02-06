const express = require("express");

const router = express.Router();

const {
  articleCreateValidator,
  articleUpdateValidator,
} = require("../validators/article");

const { runValidation } = require("../validators");
const { requireSignin, adminMiddleware } = require("../controllers/auth");
const {
  create,
  list,
  read,
  update,
  remove,
} = require("../controllers/article");

router.post(
  "/article",
  articleCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);

router.get("/article", list);

router.get(
  "/article/:slug",
  runValidation,
  requireSignin,
  adminMiddleware,
  read
);

router.put(
  "/article/:slug",
  articleUpdateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  update
);

router.delete("/article/:slug", requireSignin, adminMiddleware, remove);

module.exports = router;
