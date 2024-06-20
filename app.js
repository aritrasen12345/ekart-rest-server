require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); // Save user Credentials in Cookies
const cors = require("cors");
const expressValidator = require("express-validator");
const cron = require("node-cron");
const axios = require("axios");

// import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const braintreeRoutes = require("./routes/braintree");
const orderRoutes = require("./routes/order");

// app
const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB successfully!!");
  })
  .catch((err) => {
    console.error("DB connection failed", err);
  });

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json()); //application/json
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);

app.get("/api", function (_, res) {
  res.send("Hello World");
});

// Error Handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

// * Render.Com server auto run after 14 minutes
// cron.schedule("*/14 * * * *", () => {
//   axios
//     .get(process.env.BACKEND_BASE_URL)
//     .then((response) => {
//       console.log("Ping successful");
//     })
//     .catch((error) => {
//       console.error("Error pinging server:", error.message);
//     });
// });

// db
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
