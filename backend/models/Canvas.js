const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * A single graphical element on the canvas. All shape types share this
 * one schema rather than using Mongoose discriminators, because the
 * property set is small and mostly overlapping (x, y, rotation, fill).
 * Fields that only apply to certain shapes (radius, width/height, text)
 * are simply left undefined for shapes that don't use them.
 */
const elementSchema = new Schema(
  {
    id: { type: String, required: true }, // client-generated id, stable across saves
    type: {
      type: String,
      required: true,
      enum: ['rectangle', 'circle', 'text'],
    },
    x: { type: Number, required: true, default: 0 },
    y: { type: Number, required: true, default: 0 },
    rotation: { type: Number, default: 0 },
    fill: { type: String, default: '#000000' },

    // rectangle-specific
    width: { type: Number },
    height: { type: Number },

    // circle-specific
    radius: { type: Number },

    // text-specific
    text: { type: String },
    fontSize: { type: Number },

    // shared stacking/visibility metadata (used by layer management)
    zIndex: { type: Number, default: 0 },
  },
  { _id: false }
);

const canvasSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    width: { type: Number, required: true, default: 1000 },
    height: { type: Number, required: true, default: 700 },
    elements: { type: [elementSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Canvas', canvasSchema);
