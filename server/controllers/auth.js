const AWS = require("aws-sdk");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const shortId = require("shortid");
const expressJwt = require("express-jwt");
const {
  registerEmailParams,
  forgotPasswordEmailParams,
} = require("../helpers/email");

AWS.config.update({
  accessKeyID: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({
  apiVersion: "2010-12-01",
});

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  // Check if userExists in DB
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      console.log(err);

      return res.status(400).json({
        error: "Email is taken",
      });
    }

    // generate token with user name, email and password
    const token = jwt.sign(
      {
        name,
        email,
        password,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "10m",
      }
    );

    const params = registerEmailParams(email, token);

    const sendEmailOnRegister = ses.sendEmail(params).promise();

    sendEmailOnRegister
      .then((data) => {
        console.log(`Email sent to ses: `, data);
        res.json({
          message: `Email has been sent to ${email}. Follow the instructions on to complete your reigstration`,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          message: `We could not verify your email. Please try again.`,
        });
      });
  });
};

exports.registerActivate = (req, res) => {
  const { token } = req.body;

  jwt.verify(
    token,
    process.env.JWT_ACCOUNT_ACTIVATION,
    function (err, decoded) {
      if (err) {
        return res.status(401).json({
          error: "Expired link. Try again.",
        });
      }

      const { name, email, password } = jwt.decode(token);
      const username = shortId.generate();

      User.findOne({ email }).exec((err, user) => {
        if (user) {
          return res.statu(401).json({
            error: "Email is taken.",
          });
        }

        const newUser = new User({
          username,
          name,
          email,
          password,
        });

        newUser.save((err) => {
          if (err) {
            return res.status(401).json({
              error: "Error saving user in database. Try later.",
            });
          }
          return res.json({
            message: "Registrations success. Please login.",
          });
        });
      });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please regiuster.",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match.",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { _id, name, email, role } = user;

    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.requireSignin = expressJwt({ secret: process.env.JWT_SECRET }); // req.user

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;

  User.findOne({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found.",
      });
    }

    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;

  User.findOne({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found.",
      });
    }

    if (user.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource. Access denied.",
      });
    }

    req.profile = user;
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist.",
      });
    }

    const token = jwt.sign(
      { name: user.name },
      process.env.JWT_RESET_PASSWORD,
      {
        expiresIn: "10m",
      }
    );

    const params = forgotPasswordEmailParams(email, token);

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: "Password reset failed. Try later.",
        });
      }

      const sendEmail = ses.sendEmail(params).promise();

      sendEmail
        .then((data) => {
          console.log("reset password success", data);
          return res.json({
            message: `Email has been sent to ${email}. Click to reset your password.`,
          });
        })
        .catch((error) => {
          console.log("reset pasword failet", error);
          return res.json({
            message: `we could not find your email. Try later.`,
          });
        });
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err, success) => {
        if (err) {
          return res.status(400).json({
            error: "Expired link. Try again.",
          });
        }

        User.findOne({ resetPasswordLink }).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "Invalid token. Try again.",
            });
          }

          user.password = newPassword;
          user.resetPasswordLink = "";

          user.save((error, result) => {
            if (error) {
              return res.status(400).json({
                error: "Password reset failed. Try again",
              });
            }

            res.json({
              message: "Great! Now you can login with your new password.",
            });
          });
        });
      }
    );
  }
};