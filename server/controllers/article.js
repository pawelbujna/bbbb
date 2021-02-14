const Article = require("../models/article");
const slugify = require("slugify");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyID: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.create = (req, res) => {
  const { name, content } = req.body;

  const slug = slugify(name);

  let article = new Article({
    name,
    content,
    slug,
    postedBy: req.user._id,
  });

  if (req.files) {
    const { files } = req.files;

    const uploadLoadToS3 = (file) => {
      const params = {
        Bucket: "hackr-papu",
        Key: `article/${file.name}`,
        Body: file.data,
      };

      return s3.upload(params).promise();
    };

    const promises = [];

    files.forEach((file) => {
      promises.push(uploadLoadToS3(file));
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
            return res
              .status(400)
              .json({ error: "Tworzenie ogłoszenia nie powiodło się" });
          }

          res.json(success);
        });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(400)
          .json({ error: "Wgrywanie plików się nie powiodło" });
      });
  } else {
    article.save((error, success) => {
      if (error) {
        console.log(error);
        return res
          .status(400)
          .json({ error: "Tworzenie ogłoszenia nie powiodło się" });
      }

      res.json(success);
    });
  }
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

// TODO: Fix edition of article
exports.read = (req, res) => {
  const { slug } = req.params;

  Article.find({ slug }).exec((err, data) => {
    if (err) {
      console.log("Error finding all articles");

      return res.status(400).json({
        error: "Article could not load articles",
      });
    }

    const getFromS3 = (fileName) => {
      const params = {
        Bucket: "hackr-papu",
        Key: `${fileName}`,
      };

      return s3.getObject(params).promise();
    };

    const promises = [];

    data[0].files.forEach((file) => {
      promises.push(getFromS3(file.key));
    });

    // Czekam az wszystkie pliki zostana pobrane
    Promise.all(promises)
      .then((files) => {
        console.log(files);

        // Tutaj mam problem. Jak odesłać pliki tak zeby mialy taki sam typ jak po stronie frontendu.
        data[0].files = files.map((file) => file.Body.toString("utf-8"));
        res.send(data[0]);
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ error: "Getting files from s3 failed" });
      });
  });
};

exports.update = (req, res) => {};

exports.remove = (req, res) => {
  const { slug } = req.params;

  Article.findOneAndDelete({ slug }).exec((err, data) => {
    if (err) {
      console.log("Error deleteing article");

      return res.status(400).json({
        error: "Nie mozna załadowac ogloszenia",
      });
    }

    if (!data) {
      console.log("Error deleteing article");

      return res.status(400).json({
        error: "Taki artykuł nie istnieje.",
      });
    }

    console.log(data);
    if (data && data.files && data.files.length > 0) {
      const deleteFromS3 = (fileName) => {
        const params = {
          Bucket: "hackr-papu",
          Key: `${fileName}`,
        };
        console.log("deleteFromS3");

        return s3.deleteObject(params).promise();
      };

      const promises = [];

      data.files.forEach((file) => {
        console.log("loop");
        promises.push(deleteFromS3(file.key));
      });

      Promise.all(promises)
        .then(() => {
          console.log("deleted, promise resolved");
          res.json({
            message: "Artykuł usunięty pomyślnie",
          });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(400)
            .json({ error: "Deleting files from s3 failed" });
        });
    } else {
      console.log("response without files");
      res.json({
        message: "Artykuł usunięty pomyślnie",
      });
    }
  });
};
