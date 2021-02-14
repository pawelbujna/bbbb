const User = require("../models/user");

exports.read = (req, res) => {
  return res.json(req.profile);
};

exports.getUser = (req, res) => {
  const { salt } = req.params;

  User.findOne({ salt }).exec((err, data) => {
    if (err) {
      console.log("Error finding all users");

      return res.status(400).json({
        error: "User could not be loaded",
      });
    }

    res.json(data);
  });
};

exports.getList = (req, res) => {
  User.find({}).exec((err, data) => {
    if (err) {
      console.log("Error finding all users");

      return res.status(400).json({
        error: "User could not be loaded",
      });
    }

    res.json(data);
  });
};

exports.remove = (req, res) => {
  const { salt } = req.params;

  User.findOneAndDelete({ salt }).exec((err, data) => {
    if (err) {
      console.log("Error deleteing user");

      return res.status(400).json({
        error: "Could not delete user",
      });
    }

    if (!data) {
      console.log("Error deleteing user");

      return res.status(400).json({
        error: "Taki użytkownik nie istnieje",
      });
    }

    res.json({
      message: "Użytkownik usunięty pomyślnie",
    });
  });
};
