'use client';

import { Circle } from 'react-konva';

export default function CircleShape({ element, isSelected, shapeRef, onSelect, onDragEnd, onTransformEnd }) {
  return (
    <Circle
      ref={shapeRef}
      id={element.id}
      x={element.x}
      y={element.y}
      radius={element.radius}
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
        const scale = (scaleX + scaleY) / 2; // circles scale uniformly

        node.scaleX(1);
        node.scaleY(1);

        onTransformEnd({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          radius: Math.max(5, node.radius() * scale),
        });
      }}
    />
  );
}
