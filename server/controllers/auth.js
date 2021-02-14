const AWS = require("aws-sdk");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const shortId = require("shortid");
const expressJwt = require("express-jwt");
const {
  registerEmailParams,
  forgotPasswordEmailParams,
  inviteEmailParams,
} = require("../helpers/email");

AWS.config.update({
  accessKeyID: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({
  apiVersion: "2010-12-01",
});

// IN CASE I WOULD NEED REGISTER FUNCTION SOMEDAY
exports.registerPrivate = (req, res) => {
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

exports.register = (req, res) => {
  const { name, email, password, token } = req.body;

  jwt.verify(token, process.env.JWT_INVITATION, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        error: "Expired link. Try again.",
      });
    }

    if (decoded.email !== email) {
      return res.status(401).json({
        error:
          "Niepoprawny email. Proszę uzyj tego na ktore wysłaliśmy zaproszenie.",
      });
    }

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
            message: `Email z linkiem aktywacyjnym został wysłany na: ${email}.`,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            error: `Coś poszło nie tak. Skontaktuj się z administratorem.`,
          });
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
          error: "Token wygasł. Spróbuj jeszcze raz.",
        });
      }

      const { name, email, password } = jwt.decode(token);
      const username = shortId.generate();

      User.findOne({ email }).exec((err, user) => {
        if (user) {
          return res.status(401).json({
            error: "Email juz istnieje.",
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
              error:
                "Problem z rejestracją uytkownika. Skontaktuj się z administratorem.",
            });
          }
          return res.json({
            message: "Konto stworzone. Pora się zalogować.",
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

exports.invite = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (!err && user) {
      return res.status(400).json({
        error: "Uytkownik z takim adresem email juz istnieje.",
      });
    }

    const token = jwt.sign({ email }, process.env.JWT_INVITATION, {
      expiresIn: "72h",
    });

    const params = inviteEmailParams(email, token);

    const sendEmail = ses.sendEmail(params).promise();

    sendEmail
      .then((data) => {
        console.log("Invitation sent", data);
        res.json({
          message: `Zaproszenie zostao wysłane do: ${email}.`,
        });
      })
      .catch((error) => {
        console.log("Invitation sent failed", error);
        res.status(400).json({
          error: `Wysyłanie zaproszenia nie powiodło się. Skontaktuj się z adminitratorem.`,
        });
      });
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Uzytkownik z takim adresem email nie istnieje",
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
          error:
            "Zmiana hasła nie powiodła się. Skontaktuj się z administratorem.",
        });
      }

      const sendEmail = ses.sendEmail(params).promise();

      sendEmail
        .then((data) => {
          console.log("Hasło zresetowane poprawnie", data);
          res.json({
            message: `Wysłaliśmy link do zresetowania hasła na adres: ${email}`,
          });
        })
        .catch((error) => {
          console.log("reset pasword failed", error);
          res.status(400).json({
            error: `Zmiana hasła nie powiodła się. Skontaktuj się z administratorem.`,
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
            error: "Token wygasł. Spróbuj ponownie.",
          });
        }

        User.findOne({ resetPasswordLink }).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: "Nieprawidłowy token. Spróbuj jeszcze raz.",
            });
          }

          user.password = newPassword;
          user.resetPasswordLink = "";

          user.save((error, result) => {
            if (error) {
              return res.status(400).json({
                error: "Hasło nie zostało zmienone. Spróbuj później.",
              });
            }

            res.json({
              message: "Hasło zostało zmienione. Zaloguj się.",
            });
          });
        });
      }
    );
  }
};
