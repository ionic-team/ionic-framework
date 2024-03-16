import { CoreFoo } from '@ionic/core/components';

export * from './lifecycle';
export * from './contexts/NavContext';
export * from './contexts/IonLifeCycleContext';
export * from './components';
export * from './routing';
export * from './models';
export * from './utils/generateId';

export const ReactFoo = 'ReactBar2';

console.log('[@ionic/react] CoreFoo', CoreFoo);
