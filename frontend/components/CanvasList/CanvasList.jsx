'use client';

import styles from './CanvasList.module.css';

/**
 * Modal listing all saved canvases, with load and delete actions per
 * row. Fetching/loading/deleting are all handled by the parent; this
 * component only renders what it's given.
 */
export default function CanvasList({ canvases, isLoading, error, onLoad, onDelete, onClose }) {
  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Saved canvases</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {isLoading && <p className={styles.status}>Loading…</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!isLoading && !error && canvases.length === 0 && (
          <p className={styles.status}>No canvases saved yet. Create one and click Save.</p>
        )}

        <ul className={styles.list}>
          {canvases.map((canvas) => (
            <li key={canvas._id} className={styles.item}>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{canvas.name}</span>
                <span className={styles.itemMeta}>
                  {canvas.width}×{canvas.height} · updated {new Date(canvas.updatedAt).toLocaleString()}
                </span>
              </div>
              <div className={styles.itemActions}>
                <button className={styles.loadButton} onClick={() => onLoad(canvas._id)}>
                  Open
                </button>
                <button className={styles.deleteButton} onClick={() => onDelete(canvas._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
