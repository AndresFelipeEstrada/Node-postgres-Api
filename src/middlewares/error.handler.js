import { ValidationError } from "sequelize";

function logErrors(err, req, res, next) {
  // console.error(err);
  return next(err);
}

function errorHandler(err, req, res, next) {
  return res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    return res.status(output.statusCode).json(output.payload);
  }
  next(err);
}

function ormErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: err.errors,
    });
  }
  return next(err);
}

export { logErrors, errorHandler, boomErrorHandler, ormErrorHandler };
