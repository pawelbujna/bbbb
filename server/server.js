const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
// app middlewareds
app.use(morgan("dev"));
// app.use(bodyParser.json());
// setting the limit for uploaded files
app.use(bodyParser.json({ limit: "5mb", type: "application/json" }));
app.use(cors({ origin: process.env.CLIENT_URL }));

mongoose
  .connect(process.env.DATABASE_CLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log(error);
  });

// middlewares
app.use("/api/", authRoutes);
app.use("/api/", userRoutes);
app.use("/api/", categoryRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`listening on port: ${port}`));
