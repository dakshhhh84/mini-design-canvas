const canvasService = require('../services/canvasService');
const { asyncHandler } = require('../middleware/errorHandler');

// POST /api/canvases
const createCanvas = asyncHandler(async (req, res) => {
  const canvas = await canvasService.createCanvas(req.body);
  res.status(201).json({ success: true, data: canvas });
});

// GET /api/canvases
const getCanvases = asyncHandler(async (req, res) => {
  const canvases = await canvasService.listCanvases();
  res.status(200).json({ success: true, data: canvases });
});

// GET /api/canvases/:id
const getCanvasById = asyncHandler(async (req, res) => {
  const canvas = await canvasService.getCanvasById(req.params.id);
  res.status(200).json({ success: true, data: canvas });
});

// PUT /api/canvases/:id
const updateCanvas = asyncHandler(async (req, res) => {
  const canvas = await canvasService.updateCanvas(req.params.id, req.body);
  res.status(200).json({ success: true, data: canvas });
});

// DELETE /api/canvases/:id
const deleteCanvas = asyncHandler(async (req, res) => {
  await canvasService.deleteCanvas(req.params.id);
  res.status(200).json({ success: true, data: { id: req.params.id } });
});

module.exports = {
  createCanvas,
  getCanvases,
  getCanvasById,
  updateCanvas,
  deleteCanvas,
};
