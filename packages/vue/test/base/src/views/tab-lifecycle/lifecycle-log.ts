export const logLifecycle = (event: string) => {
  const win = window as any;
  win.lifecycleEvents = win.lifecycleEvents || [];
  win.lifecycleEvents.push(event);
};
