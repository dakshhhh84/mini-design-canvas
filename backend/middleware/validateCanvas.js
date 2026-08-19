const ApiError = require('./ApiError');

const VALID_TYPES = ['rectangle', 'circle', 'text'];

/**
 * Validates the shape of a single element within a canvas payload.
 * Returns an error message string, or null if the element is valid.
 */
function validateElement(el, index) {
  if (typeof el !== 'object' || el === null) {
    return `elements[${index}] must be an object`;
  }
  if (typeof el.id !== 'string' || !el.id) {
    return `elements[${index}].id is required`;
  }
  if (!VALID_TYPES.includes(el.type)) {
    return `elements[${index}].type must be one of ${VALID_TYPES.join(', ')}`;
  }
  if (typeof el.x !== 'number' || typeof el.y !== 'number') {
    return `elements[${index}] must have numeric x and y`;
  }
  if (el.type === 'rectangle' && (typeof el.width !== 'number' || typeof el.height !== 'number')) {
    return `elements[${index}] (rectangle) must have numeric width and height`;
  }
  if (el.type === 'circle' && typeof el.radius !== 'number') {
    return `elements[${index}] (circle) must have a numeric radius`;
  }
  if (el.type === 'text' && typeof el.text !== 'string') {
    return `elements[${index}] (text) must have a text string`;
  }
  return null;
}

/**
 * Validates the body of create/update canvas requests before it ever
 * reaches Mongoose, so bad requests fail fast with a clear 400.
 */
function validateCanvasBody(req, res, next) {
  const { name, width, height, elements } = req.body;

  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    return next(new ApiError(400, 'name must be a non-empty string'));
  }

  if (width !== undefined && (typeof width !== 'number' || width <= 0)) {
    return next(new ApiError(400, 'width must be a positive number'));
  }

  if (height !== undefined && (typeof height !== 'number' || height <= 0)) {
    return next(new ApiError(400, 'height must be a positive number'));
  }

  if (elements !== undefined) {
    if (!Array.isArray(elements)) {
      return next(new ApiError(400, 'elements must be an array'));
    }
    for (let i = 0; i < elements.length; i += 1) {
      const error = validateElement(elements[i], i);
      if (error) {
        return next(new ApiError(400, error));
      }
    }
  }

  next();
}

/**
 * Requires name/width/height/elements to be present (used on create,
 * where update allows partial payloads).
 */
function requireCanvasFields(req, res, next) {
  const { name } = req.body;
  if (typeof name !== 'string' || !name.trim()) {
    return next(new ApiError(400, 'name is required'));
  }
  next();
}

module.exports = { validateCanvasBody, requireCanvasFields };
