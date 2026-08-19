'use client';

import styles from './PropertiesPanel.module.css';

/**
 * Editable properties for the currently selected element. Renders a
 * different field set depending on the element's type (rectangle,
 * circle, text) but shares the common x/y/rotation/fill controls.
 */
export default function PropertiesPanel({ element, onChange, onDelete, onBringForward, onSendBackward }) {
  if (!element) {
    return (
      <aside className={styles.panel}>
        <h2 className={styles.heading}>Properties</h2>
        <p className={styles.empty}>Select an element on the canvas to edit its properties.</p>
      </aside>
    );
  }

  const num = (value) => (Number.isFinite(value) ? value : 0);

  const handleNumberChange = (field) => (e) => {
    const value = parseFloat(e.target.value);
    onChange(element.id, { [field]: Number.isNaN(value) ? 0 : value });
  };

  return (
    <aside className={styles.panel}>
      <h2 className={styles.heading}>Properties</h2>
      <p className={styles.typeLabel}>{element.type}</p>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>X</span>
          <input type="number" value={num(element.x)} onChange={handleNumberChange('x')} />
        </label>
        <label className={styles.field}>
          <span>Y</span>
          <input type="number" value={num(element.y)} onChange={handleNumberChange('y')} />
        </label>
      </div>

      {element.type === 'rectangle' && (
        <div className={styles.row}>
          <label className={styles.field}>
            <span>Width</span>
            <input type="number" value={num(element.width)} min={1} onChange={handleNumberChange('width')} />
          </label>
          <label className={styles.field}>
            <span>Height</span>
            <input type="number" value={num(element.height)} min={1} onChange={handleNumberChange('height')} />
          </label>
        </div>
      )}

      {element.type === 'circle' && (
        <div className={styles.row}>
          <label className={styles.field}>
            <span>Radius</span>
            <input type="number" value={num(element.radius)} min={1} onChange={handleNumberChange('radius')} />
          </label>
        </div>
      )}

      {element.type === 'text' && (
        <>
          <label className={styles.fieldFull}>
            <span>Text content</span>
            <textarea
              value={element.text || ''}
              onChange={(e) => onChange(element.id, { text: e.target.value })}
              rows={3}
            />
          </label>
          <label className={styles.field}>
            <span>Font size</span>
            <input type="number" value={num(element.fontSize)} min={1} onChange={handleNumberChange('fontSize')} />
          </label>
        </>
      )}

      <label className={styles.field}>
        <span>Rotation (°)</span>
        <input type="number" value={num(element.rotation)} onChange={handleNumberChange('rotation')} />
      </label>

      <label className={styles.field}>
        <span>Color</span>
        <div className={styles.colorRow}>
          <input
            type="color"
            value={element.fill || '#000000'}
            onChange={(e) => onChange(element.id, { fill: e.target.value })}
          />
          <input
            type="text"
            value={element.fill || '#000000'}
            onChange={(e) => onChange(element.id, { fill: e.target.value })}
          />
        </div>
      </label>

      <div className={styles.layerRow}>
        <button className={styles.secondaryButton} onClick={() => onSendBackward(element.id)}>
          ↓ Send backward
        </button>
        <button className={styles.secondaryButton} onClick={() => onBringForward(element.id)}>
          ↑ Bring forward
        </button>
      </div>

      <button className={styles.deleteButton} onClick={() => onDelete(element.id)}>
        Delete element
      </button>
    </aside>
  );
}
