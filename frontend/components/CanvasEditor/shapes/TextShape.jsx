'use client';

import { Text } from 'react-konva';

export default function TextShape({ element, isSelected, shapeRef, onSelect, onDragEnd, onTransformEnd }) {
  return (
    <Text
      ref={shapeRef}
      id={element.id}
      x={element.x}
      y={element.y}
      text={element.text}
      fontSize={element.fontSize}
      fontFamily="Inter, sans-serif"
      rotation={element.rotation}
      fill={element.fill}
      stroke={isSelected ? '#5b5ff0' : undefined}
      strokeWidth={isSelected ? 0.6 : 0}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onDragEnd({ x: e.target.x(), y: e.target.y() });
      }}
      onTransformEnd={(e) => {
        const node = e.target;
        const scaleX = node.scaleX();

        // Scale font size rather than stretching the text node, so text
        // stays crisp and proportional after a resize handle drag.
        node.scaleX(1);
        node.scaleY(1);

        onTransformEnd({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          fontSize: Math.max(6, Math.round(node.fontSize() * scaleX)),
        });
      }}
    />
  );
}
