const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

/**
 * Thin wrapper around fetch that throws a readable Error for non-2xx
 * responses, so calling code can just await and try/catch.
 */
async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return body.data;
}

export const canvasApi = {
  list: () => request('/canvases'),
  get: (id) => request(`/canvases/${id}`),
  create: (canvas) =>
    request('/canvases', {
      method: 'POST',
      body: JSON.stringify(canvas),
    }),
  update: (id, canvas) =>
    request(`/canvases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(canvas),
    }),
  remove: (id) =>
    request(`/canvases/${id}`, {
      method: 'DELETE',
    }),
};
