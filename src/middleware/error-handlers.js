exports.serviceError = (err, req, res, next) => {
  if (err.isServiceError && err.response.body) {
    res.status(err.response.status).send(err.response.body);
  } else if (err.isServiceError && !err.response.body) {
    res.status(err.response.status).end();
  } else {
    next(err);
  }
};
