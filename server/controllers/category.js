const Category = require("../models/category");
const slugify = require("slugify");

exports.create = (req, res) => {
  const { name, image, content } = req.body;

  const slug = slugify(name);
};

exports.list = (req, res) => {};

exports.read = (req, res) => {};

exports.update = (req, res) => {};

exports.remove = (req, res) => {};
