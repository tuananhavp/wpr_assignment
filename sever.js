const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Set Handlebars as the view engine
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    partialsDir: path.join(__dirname, "views/partials"),
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SECRECT_KEY));

const Handlebars = require("handlebars");
Handlebars.registerHelper("gt", function (a, b) {
  return a > b;
});

Handlebars.registerHelper("lt", function (a, b) {
  return a < b;
});

Handlebars.registerHelper("add", function (a, b) {
  return a + b;
});

Handlebars.registerHelper("subtract", function (a, b) {
  return a - b;
});
Handlebars.registerHelper("range", function (start, end) {
  let result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
});
Handlebars.registerHelper("formatDate", function (date) {
  const options = { day: "numeric", month: "long" };
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);
  return formattedDate;
});

// Routers
const signInRouter = require("./routes/auth.router");
const homeRouter = require("./routes/home.router");

// Routes
app.use("/", signInRouter);
app.use("/home", homeRouter);

app.listen(process.env.PORT, () => {
  console.log("You are succesfully open the sever!!!!");
});
