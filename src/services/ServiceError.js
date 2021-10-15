class ServiceError extends Error {
    constructor(message, responseStatus, responseBody) {
      super(`Service error: ${message}`);
      this.isServiceError = true;
      this.response = {
        status: responseStatus,
        body: responseBody,
      };
    }
  }
  
  module.exports = ServiceError;
  