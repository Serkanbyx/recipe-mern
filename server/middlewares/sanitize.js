/**
 * Express 5 compatible MongoDB query injection sanitizer.
 * Replaces `express-mongo-sanitize` which is incompatible with Express 5
 * because `req.query` is now a read-only getter.
 */

const FORBIDDEN_PATTERN = /^\$|\..*\$/;

const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return;

  for (const key of Object.keys(obj)) {
    if (FORBIDDEN_PATTERN.test(key)) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
};

const sanitizeMongo = (req, _res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);
  next();
};

export default sanitizeMongo;
