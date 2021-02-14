const { check } = require("express-validator");

exports.articleCreateValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("content")
    .notEmpty()
    .withMessage("Content is required. At least 20 characters"),
];

exports.articleUpdateValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("files").isArray().withMessage("Files is not array"),
  check("content")
    .isLength({ min: 20 })
    .withMessage("Content is required required. At least 20 characters"),
];
