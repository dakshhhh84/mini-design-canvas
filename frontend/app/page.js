'use client';

import dynamic from 'next/dynamic';

// react-konva touches the DOM (window/document) at module load time, so
// it cannot be server-rendered. Loading it with ssr: false keeps Next's
// server bundle clean and avoids "window is not defined" build errors.
const EditorShell = dynamic(() => import('../components/EditorShell'), {
  ssr: false,
  loading: () => <p style={{ padding: 24, fontFamily: 'sans-serif' }}>Loading editor…</p>,
});

export default function Home() {
  return <EditorShell />;
}
