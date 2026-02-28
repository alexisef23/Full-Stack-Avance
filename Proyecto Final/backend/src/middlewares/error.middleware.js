const errorMiddleware = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Postgres errors (pg)
  // https://www.postgresql.org/docs/current/errcodes-appendix.html
  if (err && err.code) {
    if (err.code === '23505') {
      status = 409;
      message = 'Conflicto: valor duplicado (unique).';
    } else if (err.code === '23503') {
      status = 400;
      message = 'Referencia inválida (foreign key).';
    } else if (err.code === '22P02') {
      status = 400;
      message = 'Formato inválido.';
    }
  }

  console.error(`[ERROR] ${status} - ${message}`, err.stack);

  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
