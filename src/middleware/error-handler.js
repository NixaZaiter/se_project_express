module.exports = (err, req, res, next) => {
  console.log({
    name: err.name,
    statusCode: err.statusCode,
    message: err.message,
  });

  console.error(err);

  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    name: err.name,
    statusCode,
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
};
