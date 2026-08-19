const express = require('express');
const {
  createCanvas,
  getCanvases,
  getCanvasById,
  updateCanvas,
  deleteCanvas,
} = require('../controllers/canvasController');
const { validateCanvasBody, requireCanvasFields } = require('../middleware/validateCanvas');

const router = express.Router();

router.route('/').get(getCanvases).post(requireCanvasFields, validateCanvasBody, createCanvas);

router
  .route('/:id')
  .get(getCanvasById)
  .put(validateCanvasBody, updateCanvas)
  .delete(deleteCanvas);

module.exports = router;
