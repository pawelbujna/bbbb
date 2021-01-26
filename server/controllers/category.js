const Category = require("../models/category");
const slugify = require("slugify");
const formidable = require("formidable");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const s3 = new AWS.S3({
  accessKeyID: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.create = (req, res) => {
  const { name, image, content } = req.body;

  // getting base64 code only withoud prefix data:image...
  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  // getting type of a file
  const type = image.split(";")[0].split("/")[1];

  const slug = slugify(name);

  let category = new Category({
    name,
    content,
    slug,
    postedBy: req.user._id,
  });

  const params = {
    Bucket: "hackr-papu",
    Key: `category/${uuidv4()}.${type}`,
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "Uploading to s3 failed" });
    }

    category.image.url = data.Location;
    category.image.key = data.Key;

    // save to db
    category.save((error, success) => {
      if (error) {
        console.log(error);
        return res.status(400).json({ error: "Category create failed" });
      }

      res.json(success);
    });
  });
};

exports.list = (req, res) => {
  Category.find({}).exec((err, data) => {
    if (err) {
      console.log("Error finding all categories");

      return res.status(400).json({
        error: "Category could not load categories",
      });
    }

    res.json(data);
  });
};

exports.read = (req, res) => {};

exports.update = (req, res) => {};

exports.remove = (req, res) => {};
