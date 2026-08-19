'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import Toolbar from './Toolbar/Toolbar';
import CanvasEditor from './CanvasEditor/CanvasEditor';
import PropertiesPanel from './PropertiesPanel/PropertiesPanel';
import CanvasList from './CanvasList/CanvasList';
import { canvasApi } from '../services/api';
import { createElement, cloneElements } from '../utils/elements';
import styles from './EditorShell.module.css';

const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 700;
const AUTOSAVE_DELAY_MS = 2000;
const HISTORY_LIMIT = 50;

export default function EditorShell() {
  const stageRef = useRef(null);

  const [canvasId, setCanvasId] = useState(null);
  const [canvasName, setCanvasName] = useState('Untitled canvas');
  const [canvasWidth] = useState(DEFAULT_WIDTH);
  const [canvasHeight] = useState(DEFAULT_HEIGHT);

  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  const [showCanvasList, setShowCanvasList] = useState(false);
  const [canvasesList, setCanvasesList] = useState([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [listError, setListError] = useState('');

  const [autosaveEnabled, setAutosaveEnabled] = useState(false);
  const autosaveTimer = useRef(null);

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  // ---- history helpers -----------------------------------------------

  const pushHistory = useCallback(() => {
    setPast((prev) => {
      const next = [...prev, cloneElements(elements)];
      return next.length > HISTORY_LIMIT ? next.slice(next.length - HISTORY_LIMIT) : next;
    });
    setFuture([]);
  }, [elements]);

  const undo = useCallback(() => {
    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;
      const previous = prevPast[prevPast.length - 1];
      setFuture((prevFuture) => [cloneElements(elements), ...prevFuture]);
      setElements(previous);
      setSelectedId(null);
      return prevPast.slice(0, -1);
    });
  }, [elements]);

  const redo = useCallback(() => {
    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;
      const next = prevFuture[0];
      setPast((prevPast) => [...prevPast, cloneElements(elements)]);
      setElements(next);
      setSelectedId(null);
      return prevFuture.slice(1);
    });
  }, [elements]);

  // ---- element operations ---------------------------------------------

  const addShape = useCallback(
    (type) => {
      pushHistory();
      const topZIndex = elements.length ? Math.max(...elements.map((el) => el.zIndex)) + 1 : 0;
      const newElement = createElement(type, { canvasWidth, canvasHeight, topZIndex });
      setElements((prev) => [...prev, newElement]);
      setSelectedId(newElement.id);
    },
    [elements, canvasWidth, canvasHeight, pushHistory]
  );

  const updateElement = useCallback(
    (id, changes) => {
      pushHistory();
      setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...changes } : el)));
    },
    [pushHistory]
  );

  const deleteElement = useCallback(
    (id) => {
      pushHistory();
      setElements((prev) => prev.filter((el) => el.id !== id));
      setSelectedId((current) => (current === id ? null : current));
    },
    [pushHistory]
  );

  const bringForward = useCallback(
    (id) => {
      pushHistory();
      setElements((prev) => {
        const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
        const idx = sorted.findIndex((el) => el.id === id);
        if (idx === -1 || idx === sorted.length - 1) return prev;
        const temp = sorted[idx].zIndex;
        sorted[idx].zIndex = sorted[idx + 1].zIndex;
        sorted[idx + 1].zIndex = temp;
        return sorted;
      });
    },
    [pushHistory]
  );

  const sendBackward = useCallback(
    (id) => {
      pushHistory();
      setElements((prev) => {
        const sorted = [...prev].sort((a, b) => a.zIndex - b.zIndex);
        const idx = sorted.findIndex((el) => el.id === id);
        if (idx <= 0) return prev;
        const temp = sorted[idx].zIndex;
        sorted[idx].zIndex = sorted[idx - 1].zIndex;
        sorted[idx - 1].zIndex = temp;
        return sorted;
      });
    },
    [pushHistory]
  );

  // ---- persistence ------------------------------------------------------

  const buildPayload = useCallback(
    () => ({
      name: canvasName,
      width: canvasWidth,
      height: canvasHeight,
      elements,
    }),
    [canvasName, canvasWidth, canvasHeight, elements]
  );

  const save = useCallback(async () => {
    setIsSaving(true);
    setSaveError('');
    try {
      const payload = buildPayload();
      if (canvasId) {
        const saved = await canvasApi.update(canvasId, payload);
        setSaveMessage(`Saved at ${new Date(saved.updatedAt).toLocaleTimeString()}`);
      } else {
        const saved = await canvasApi.create(payload);
        setCanvasId(saved._id);
        setSaveMessage(`Saved at ${new Date(saved.updatedAt).toLocaleTimeString()}`);
      }
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
    }
  }, [buildPayload, canvasId]);

  // Debounced autosave whenever elements/name change and autosave is on.
  useEffect(() => {
    if (!autosaveEnabled) return undefined;

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      save();
    }, AUTOSAVE_DELAY_MS);

    return () => clearTimeout(autosaveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, canvasName, autosaveEnabled]);

  const newCanvas = useCallback(() => {
    setCanvasId(null);
    setCanvasName('Untitled canvas');
    setElements([]);
    setSelectedId(null);
    setPast([]);
    setFuture([]);
    setSaveMessage('');
    setSaveError('');
  }, []);

  const openCanvasList = useCallback(async () => {
    setShowCanvasList(true);
    setIsListLoading(true);
    setListError('');
    try {
      const list = await canvasApi.list();
      setCanvasesList(list);
    } catch (err) {
      setListError(err.message);
    } finally {
      setIsListLoading(false);
    }
  }, []);

  const loadCanvas = useCallback(async (id) => {
    setIsListLoading(true);
    setListError('');
    try {
      const canvas = await canvasApi.get(id);
      setCanvasId(canvas._id);
      setCanvasName(canvas.name);
      setElements(canvas.elements || []);
      setSelectedId(null);
      setPast([]);
      setFuture([]);
      setShowCanvasList(false);
      setSaveMessage('');
      setSaveError('');
    } catch (err) {
      setListError(err.message);
    } finally {
      setIsListLoading(false);
    }
  }, []);

  const deleteSavedCanvas = useCallback(
    async (id) => {
      try {
        await canvasApi.remove(id);
        setCanvasesList((prev) => prev.filter((c) => c._id !== id));
        if (id === canvasId) {
          newCanvas();
        }
      } catch (err) {
        setListError(err.message);
      }
    },
    [canvasId, newCanvas]
  );

  const exportPNG = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const uri = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `${canvasName || 'canvas'}.png`;
    link.href = uri;
    link.click();
  }, [canvasName]);

  return (
    <div className={styles.shell}>
      <Toolbar
        canvasName={canvasName}
        onCanvasNameChange={setCanvasName}
        onAddShape={addShape}
        onUndo={undo}
        onRedo={redo}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        onSave={save}
        isSaving={isSaving}
        onOpenCanvasList={openCanvasList}
        onNewCanvas={newCanvas}
        onExportPNG={exportPNG}
        autosaveEnabled={autosaveEnabled}
        onToggleAutosave={setAutosaveEnabled}
      />

      {(saveMessage || saveError) && (
        <div className={saveError ? styles.statusBarError : styles.statusBar}>{saveError || saveMessage}</div>
      )}

      <div className={styles.body}>
        <div className={styles.canvasArea}>
          <CanvasEditor
            stageRef={stageRef}
            width={canvasWidth}
            height={canvasHeight}
            elements={elements}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDeselect={() => setSelectedId(null)}
            onElementChange={updateElement}
          />
        </div>

        <PropertiesPanel
          element={selectedElement}
          onChange={updateElement}
          onDelete={deleteElement}
          onBringForward={bringForward}
          onSendBackward={sendBackward}
        />
      </div>

      {showCanvasList && (
        <CanvasList
          canvases={canvasesList}
          isLoading={isListLoading}
          error={listError}
          onLoad={loadCanvas}
          onDelete={deleteSavedCanvas}
          onClose={() => setShowCanvasList(false)}
        />
      )}
    </div>
  );
}
