class HttpError extends Error {
  constructor(errorState) {
    super();
    this.message = errorState.message;
    this.statusCode = errorState.statusCode;
    this.errorCode = errorState.errorCode;
    this.isOptional = true;
  }
}

module.exports = HttpError;
