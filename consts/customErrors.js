class ClientError extends Error {
  constructor(message) {
    super();
    this.name = 'ClientError';
    this.message = message;
    this.stack = (new Error()).stack;
  }
}

class ServerError extends Error {
  constructor(message) {
    super();
    this.name = 'ServerError';
    this.message = message;
    this.stack = (new Error()).stack;
  }
}

module.exports = {
  ClientError,
  ServerError,
};
