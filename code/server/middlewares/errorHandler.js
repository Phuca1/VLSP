const snakecaseKeys = require('snakecase-keys');
const codes = require('../errors/code');
const getErrorMessage = require('../errors/message');
const fs = require('fs');

const errorHandler = (err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  let statusCode = err.code || err.statusCode;
  let { message } = err;
  let details;
  const code = err.code || err.statusCode || codes.INTERNAL_SERVER_ERROR;
  switch (code) {
    case codes.BAD_REQUEST:
      message = message || 'Bad Request';
      details = err.details;
      break;
    case codes.UNAUTHORIZED:
      message = message || 'Unauthorized';
      //   details = err.details;
      break;
    case codes.FORBIDDEN:
      message = message || 'Forbidden';
      //   details = err.details;
      break;
    case codes.TOO_MANY_REQUESTS:
      message = message || 'Too many requests';
      break;
    case codes.INTERNAL_SERVER_ERROR:
      message = message || 'Internal server error';
      break;
    default:
      message = message || getErrorMessage(code);
      statusCode = 200;
  }
  console.log('Error is ', err);
  console.log('message :', message);

  return res.status(statusCode).send(
    snakecaseKeys(
      {
        status: 0,
        code,
        message,
        details,
      },
      {
        deep: true,
      },
    ),
  );
};

module.exports = errorHandler;
