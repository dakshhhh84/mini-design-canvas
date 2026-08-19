'use client';

import { Rect } from 'react-konva';

/**
 * Renders a single rectangle element. Drag and transform events bubble
 * up as plain (x, y, width, height, rotation) updates so the parent
 * doesn't need to know anything about Konva's node API.
 */
export default function RectangleShape({ element, isSelected, shapeRef, onSelect, onDragEnd, onTransformEnd }) {
  return (
    <Rect
      ref={shapeRef}
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation}
      fill={element.fill}
      stroke={isSelected ? '#5b5ff0' : undefined}
      strokeWidth={isSelected ? 2 : 0}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onDragEnd({ x: e.target.x(), y: e.target.y() });
      }}
      onTransformEnd={(e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Konva scales the node instead of changing width/height directly.
        // Bake the scale back into width/height and reset scale to 1 so
        // subsequent transforms behave predictably.
        node.scaleX(1);
        node.scaleY(1);

        onTransformEnd({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
        });
      }}
    />
  );
}
