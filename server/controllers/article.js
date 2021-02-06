const Article = require("../models/article");
const slugify = require("slugify");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
  accessKeyID: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.create = (req, res) => {
  const { name, files, content } = req.body;

  const uploadLoadToS3 = (file) => {
    const type = file.split(":")[1].split(";")[0];

    const base64Data = new Buffer.from(
      file.split(";")[1].split(",")[1],
      "base64"
    );

    const params = {
      Bucket: "hackr-papu",
      Key: `article/${uuidv4()}.${type.split("/")[1]}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `${type}`,
    };

    return s3.upload(params).promise();
  };

  const promises = [];

  files.forEach((file) => {
    promises.push(uploadLoadToS3(file));
  });

  const slug = slugify(name);

  let article = new Article({
    name,
    content,
    slug,
    postedBy: req.user._id,
  });

  Promise.all(promises)
    .then((data) => {
      article.files =
        data.length > 0
          ? data.map((item) => ({
              key: item.Key,
              url: item.Location,
            }))
          : [];

      article.save((error, success) => {
        if (error) {
          console.log(error);
          return res.status(400).json({ error: "Article create failed" });
        }

        res.json(success);
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ error: "Uploading to s3 failed" });
    });
};

exports.list = (req, res) => {
  Article.find({}).exec((err, data) => {
    if (err) {
      console.log("Error finding all articles");

      return res.status(400).json({
        error: "Article could not load articles",
      });
    }

    res.json(data);
  });
};

exports.read = (req, res) => {
  const { slug } = req.params;

  Article.find({ slug }).exec((err, data) => {
    if (err) {
      console.log("Error finding all articles");

      return res.status(400).json({
        error: "Article could not load articles",
      });
    }

    res.json(data[0]);
  });
};

exports.update = (req, res) => {};

exports.remove = (req, res) => {};
