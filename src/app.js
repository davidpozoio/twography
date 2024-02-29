const express = require("express");
const {
  globalErrorController,
} = require("./controllers/global-error-controller");
const cookies = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config({
  path: ".env",
});

const ERROR = require("./consts/errors");
const { asyncErrorHandler } = require("./utils/async-error-handler");
const HttpError = require("./utils/http-error");
const environment = require("./config/environment");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(cookies());
app.use(
  environment.developMode === environment.mode.prod
    ? (req, res, next) => next()
    : morgan("dev")
);

app.use(
  "*",
  asyncErrorHandler(() => {
    throw new HttpError(ERROR.ROUTE_NOT_FOUND);
  })
);

app.use(globalErrorController);

module.exports = app;
