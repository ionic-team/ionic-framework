import { install } from './ionic';

export default {
  install,
  version: '__VERSION__'
};

// To be removed once Vue.$ionic is fully deprecated
export { Controllers } from './ionic';

export { default as IonicVueRouter } from './router';
export* from './controllers';
export * from './components/inputs';
