/** Records a view lifecycle event on `window.lifecycleEvents` for a spec to assert on. */
export const pushLifecycleEvent = (event: string) => {
  (window as any).lifecycleEvents = (window as any).lifecycleEvents || [];
  (window as any).lifecycleEvents.push(event);
};
