'use client';

import styles from './Toolbar.module.css';

/**
 * Top toolbar: shape creation, undo/redo, save/open, and export.
 * Purely presentational - all behavior is supplied via props.
 */
export default function Toolbar({
  canvasName,
  onCanvasNameChange,
  onAddShape,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  isSaving,
  onOpenCanvasList,
  onNewCanvas,
  onExportPNG,
  autosaveEnabled,
  onToggleAutosave,
}) {
  return (
    <header className={styles.toolbar}>
      <div className={styles.group}>
        <span className={styles.brand}>Mini Design Canvas</span>
        <input
          className={styles.nameInput}
          value={canvasName}
          onChange={(e) => onCanvasNameChange(e.target.value)}
          placeholder="Untitled canvas"
          aria-label="Canvas name"
        />
      </div>

      <div className={styles.group}>
        <button className={styles.toolButton} onClick={() => onAddShape('rectangle')} title="Add rectangle">
          ▭ Rectangle
        </button>
        <button className={styles.toolButton} onClick={() => onAddShape('circle')} title="Add circle">
          ◯ Circle
        </button>
        <button className={styles.toolButton} onClick={() => onAddShape('text')} title="Add text">
          T Text
        </button>
      </div>

      <div className={styles.group}>
        <button className={styles.iconButton} onClick={onUndo} disabled={!canUndo} title="Undo">
          ↶ Undo
        </button>
        <button className={styles.iconButton} onClick={onRedo} disabled={!canRedo} title="Redo">
          ↷ Redo
        </button>
      </div>

      <div className={styles.group}>
        <label className={styles.autosaveLabel}>
          <input type="checkbox" checked={autosaveEnabled} onChange={(e) => onToggleAutosave(e.target.checked)} />
          Autosave
        </label>
        <button className={styles.secondaryButton} onClick={onNewCanvas}>
          New
        </button>
        <button className={styles.secondaryButton} onClick={onOpenCanvasList}>
          Open
        </button>
        <button className={styles.secondaryButton} onClick={onExportPNG}>
          Export PNG
        </button>
        <button className={styles.primaryButton} onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </header>
  );
}
