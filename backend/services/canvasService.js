const Canvas = require('../models/Canvas');
const ApiError = require('../middleware/ApiError');

/**
 * Encapsulates all direct database access for canvases so controllers
 * stay thin and the persistence details can change independently of
 * the HTTP layer.
 */
const canvasService = {
  async createCanvas(data) {
    const canvas = new Canvas({
      name: data.name,
      width: data.width ?? 1000,
      height: data.height ?? 700,
      elements: data.elements ?? [],
    });
    return canvas.save();
  },

  async listCanvases() {
    // Only return summary fields for the list view; full elements are
    // fetched individually via getCanvasById to keep the list light.
    return Canvas.find().select('name width height createdAt updatedAt').sort({ updatedAt: -1 });
  },

  async getCanvasById(id) {
    const canvas = await Canvas.findById(id);
    if (!canvas) {
      throw new ApiError(404, `Canvas ${id} not found`);
    }
    return canvas;
  },

  async updateCanvas(id, data) {
    const update = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.width !== undefined) update.width = data.width;
    if (data.height !== undefined) update.height = data.height;
    if (data.elements !== undefined) update.elements = data.elements;

    const canvas = await Canvas.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!canvas) {
      throw new ApiError(404, `Canvas ${id} not found`);
    }
    return canvas;
  },

  async deleteCanvas(id) {
    const canvas = await Canvas.findByIdAndDelete(id);
    if (!canvas) {
      throw new ApiError(404, `Canvas ${id} not found`);
    }
    return canvas;
  },
};

module.exports = canvasService;
