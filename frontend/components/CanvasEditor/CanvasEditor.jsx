'use client';

import { useEffect, useRef } from 'react';
import { Stage, Layer, Transformer, Rect as GridRect } from 'react-konva';
import RectangleShape from './shapes/RectangleShape';
import CircleShape from './shapes/CircleShape';
import TextShape from './shapes/TextShape';

const SHAPE_COMPONENTS = {
  rectangle: RectangleShape,
  circle: CircleShape,
  text: TextShape,
};

/**
 * Renders the Konva stage, all elements in z-order, and the transformer
 * for whichever element is currently selected. All state lives in the
 * parent (EditorShell); this component is intentionally stateless aside
 * from Konva node refs.
 */
export default function CanvasEditor({
  stageRef,
  width,
  height,
  elements,
  selectedId,
  onSelect,
  onDeselect,
  onElementChange,
}) {
  const transformerRef = useRef(null);
  const shapeRefs = useRef({});

  const orderedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    const selectedNode = selectedId ? shapeRefs.current[selectedId] : null;

    if (selectedNode) {
      transformer.nodes([selectedNode]);
      transformer.getLayer().batchDraw();
    } else {
      transformer.nodes([]);
    }
  }, [selectedId, elements]);

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onMouseDown={(e) => {
        // Clicking the stage background (not a shape) clears selection.
        if (e.target === e.target.getStage()) {
          onDeselect();
        }
      }}
    >
      <Layer listening={false}>
        {/* Static canvas background + subtle dot grid, purely visual */}
        <GridRect x={0} y={0} width={width} height={height} fill="#ffffff" />
      </Layer>

      <Layer>
        {orderedElements.map((element) => {
          const ShapeComponent = SHAPE_COMPONENTS[element.type];
          if (!ShapeComponent) return null;

          return (
            <ShapeComponent
              key={element.id}
              element={element}
              isSelected={element.id === selectedId}
              shapeRef={(node) => {
                if (node) {
                  shapeRefs.current[element.id] = node;
                } else {
                  delete shapeRefs.current[element.id];
                }
              }}
              onSelect={() => onSelect(element.id)}
              onDragEnd={(changes) => onElementChange(element.id, changes)}
              onTransformEnd={(changes) => onElementChange(element.id, changes)}
            />
          );
        })}
        <Transformer
          ref={transformerRef}
          rotateEnabled
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // Prevent the box from collapsing to nothing while resizing.
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
}
