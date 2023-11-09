const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const {
  usersRouter,
  reviewsRouter,
  tasksRouter,
  docsRouter,
  emailsRouter,
} = require("./src/routes");
require("dotenv").config();

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(express.urlencoded({ extended: true }));
app.use(logger(formatsLogger));
app.use(
  cors({
    origin: "*", // Дозволити запити з цього домену
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Дозволені HTTP-методи
    credentials: true, // Дозволити передавати кредити (наприклад, куки або токен)
  })
);
app.use(express.json());
app.use(express.static("public"));

app.use("/auth", usersRouter);
app.use("/tasks", tasksRouter);
app.use("/emails", emailsRouter);
app.use("/reviews", reviewsRouter);
app.use("/", docsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((error, req, res, next) => {
  const { status = 500, message = "Server error" } = error;
  res.status(status).json({ message });
});

module.exports = app;
