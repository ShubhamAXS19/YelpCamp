const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const { reviewSchema } = require("./schema");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Review = require("./models/review");
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");
const catchAsync = require("./utils/catchAsync");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("Views", path.join(__dirname, "Views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => {
  // res.send('Hello from the server!!!')
  res.render("Home");
});

app.all("*", (req, res, next) => {
  // res, send("404!!");
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message)
    (err.message = "Something Went Wrong"),
      res.status(statusCode).render("error", { err });
  // res.send("OH boy something went wrong");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
