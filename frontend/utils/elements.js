import { v4 as uuidv4 } from 'uuid';

/**
 * Returns a freshly-created element of the given type, positioned near
 * the center of the supplied canvas dimensions with sensible defaults.
 * zIndex is set to `topZIndex` so new elements always appear on top.
 */
export function createElement(type, { canvasWidth, canvasHeight, topZIndex }) {
  const base = {
    id: uuidv4(),
    rotation: 0,
    zIndex: topZIndex,
  };

  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;

  switch (type) {
    case 'rectangle':
      return {
        ...base,
        type: 'rectangle',
        x: cx - 75,
        y: cy - 50,
        width: 150,
        height: 100,
        fill: '#5b5ff0',
      };
    case 'circle':
      return {
        ...base,
        type: 'circle',
        x: cx,
        y: cy,
        radius: 60,
        fill: '#e05a5a',
      };
    case 'text':
      return {
        ...base,
        type: 'text',
        x: cx - 60,
        y: cy,
        text: 'Hello World',
        fontSize: 24,
        fill: '#1c1d22',
      };
    default:
      throw new Error(`Unknown element type: ${type}`);
  }
}

/** Deep-enough clone for history snapshots (elements are flat objects). */
export function cloneElements(elements) {
  return elements.map((el) => ({ ...el }));
}
