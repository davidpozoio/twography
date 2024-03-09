const express = require("express");
const { createServer } = require("http");
const {
  globalErrorController,
} = require("./controllers/global-error-controller");
const cookies = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({
  path: ".env",
});

const ERROR = require("./consts/errors");
const { asyncErrorHandler } = require("./utils/async-error-handler");
const environment = require("./config/environment");
const SocketError = require("./utils/socket-error");
const path = require("path");

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cookies());
app.use(
  environment.developMode === environment.mode.prod
    ? (req, res, next) => next()
    : morgan("dev")
);
//CORS CONFIG---------------------------------------------------------------
app.use(cors());

app.use("/", express.static("src/static/dist"));

app.get("*", (req, res) => {
  res
    .status(200)
    .sendFile(path.join(__dirname, "static", "dist", "index.html"));
});

app.use(
  "*",
  asyncErrorHandler(() => {
    throw new SocketError(ERROR.ROUTE_NOT_FOUND);
  })
);

app.use(globalErrorController);

module.exports = server;
