exports.registerEmailParams = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html>
              <h1>Aktywuj konto</h1>
              <p>Uzyj ponizszego linku do aktywacji swojego konta: </p>
              <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
            </html>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Dokończ rejestracje",
      },
    },
  };
};

exports.forgotPasswordEmailParams = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html>
              <h1>Zresetuj swoje hasło</h1>
              <p>Uzyj ponizszego linku do zresetowania hasła: </p>
              <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
            </html>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Zresetuj hasło",
      },
    },
  };
};

exports.inviteEmailParams = (email, token) => {
  return {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<html>
              <h1>Stwórz nowe konto</h1>
              <p>Uzyj ponizszego linku do stworzenia konta: </p>
              <p>${process.env.CLIENT_URL}/auth/invite/${token}</p>
            </html>`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Stwórz nowe konto",
      },
    },
  };
};
