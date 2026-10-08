/** Records a committed render under `id` on `window.renderCounts` for a spec to assert on. */
export const countRender = (id: string) => {
  (window as any).renderCounts = (window as any).renderCounts || {};
  (window as any).renderCounts[id] = ((window as any).renderCounts[id] ?? 0) + 1;
};
