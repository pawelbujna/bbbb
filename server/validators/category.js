const { check } = require("express-validator");

exports.categoryCreateValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("image").isEmpty().withMessage("Image is required"),
  check("content").isLength({ min: 20 }).withMessage("Content is required"),
];

exports.categoryUpdateValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("image").isEmpty().withMessage("Image is required"),
  check("content")
    .isLength({ min: 20 })
    .withMessage("CONTENT IS REQUIRED required"),
];
