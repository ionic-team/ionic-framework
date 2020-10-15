export const LIFECYCLE_WILL_ENTER = 'ionViewWillEnter';
export const LIFECYCLE_DID_ENTER = 'ionViewDidEnter';
export const LIFECYCLE_WILL_LEAVE = 'ionViewWillLeave';
export const LIFECYCLE_DID_LEAVE = 'ionViewDidLeave';

const ids: { [k: string]: number } = { main: 0 };

export const generateId = (type = 'main') => {
  const id = (ids[type] ?? 0) + 1;
  ids[type] = id;
  return (id).toString();
};

// TODO types
export const fireLifecycle = (vueComponent: any, lifecycle: string) => {
  if (vueComponent && vueComponent.methods && vueComponent.methods[lifecycle]) {
    vueComponent.methods[lifecycle]();
  }
}
