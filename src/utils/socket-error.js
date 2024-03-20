class SocketError extends Error {
  constructor(errorState) {
    super();
    this.isOperational = true;
    this.data = errorState;
  }
}

module.exports = SocketError;
