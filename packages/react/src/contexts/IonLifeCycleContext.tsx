import React from 'react';

export interface IonLifeCycleContextInterface {
  onIonViewWillEnter: (callback: () => void) => void;
  ionViewWillEnter: () => void;
  onIonViewDidEnter: (callback: () => void) => void;
  ionViewDidEnter: () => void;
  onIonViewWillLeave: (callback: () => void) => void;
  ionViewWillLeave: () => void;
  onIonViewDidLeave: (callback: () => void) => void;
  ionViewDidLeave: () => void;
}

export const IonLifeCycleContext = /*@__PURE__*/ React.createContext<IonLifeCycleContextInterface>({
  onIonViewWillEnter: () => {
    return;
  },
  ionViewWillEnter: () => {
    return;
  },
  onIonViewDidEnter: () => {
    return;
  },
  ionViewDidEnter: () => {
    return;
  },
  onIonViewWillLeave: () => {
    return;
  },
  ionViewWillLeave: () => {
    return;
  },
  onIonViewDidLeave: () => {
    return;
  },
  ionViewDidLeave: () => {
    return;
  },
});

export interface LifeCycleCallback {
  (): void;
  id?: number;
}

export const DefaultIonLifeCycleContext = class implements IonLifeCycleContextInterface {
  ionViewWillEnterCallbacks: LifeCycleCallback[] = [];
  ionViewDidEnterCallbacks: LifeCycleCallback[] = [];
  ionViewWillLeaveCallbacks: LifeCycleCallback[] = [];
  ionViewDidLeaveCallbacks: LifeCycleCallback[] = [];
  componentCanBeDestroyedCallback?: () => void;

  onIonViewWillEnter(callback: LifeCycleCallback) {
    if (callback.id) {
      const index = this.ionViewWillEnterCallbacks.findIndex((x) => x.id === callback.id);
      if (index > -1) {
        this.ionViewWillEnterCallbacks[index] = callback;
      } else {
        this.ionViewWillEnterCallbacks.push(callback);
      }
    } else {
      this.ionViewWillEnterCallbacks.push(callback);
    }
  }

  ionViewWillEnter() {
    this.ionViewWillEnterCallbacks.forEach((cb) => cb());
  }

  onIonViewDidEnter(callback: LifeCycleCallback) {
    if (callback.id) {
      const index = this.ionViewDidEnterCallbacks.findIndex((x) => x.id === callback.id);
      if (index > -1) {
        this.ionViewDidEnterCallbacks[index] = callback;
      } else {
        this.ionViewDidEnterCallbacks.push(callback);
      }
    } else {
      this.ionViewDidEnterCallbacks.push(callback);
    }
  }

  ionViewDidEnter() {
    this.ionViewDidEnterCallbacks.forEach((cb) => cb());
  }

  onIonViewWillLeave(callback: LifeCycleCallback) {
    if (callback.id) {
      const index = this.ionViewWillLeaveCallbacks.findIndex((x) => x.id === callback.id);
      if (index > -1) {
        this.ionViewWillLeaveCallbacks[index] = callback;
      } else {
        this.ionViewWillLeaveCallbacks.push(callback);
      }
    } else {
      this.ionViewWillLeaveCallbacks.push(callback);
    }
  }

  ionViewWillLeave() {
    this.ionViewWillLeaveCallbacks.forEach((cb) => cb());
  }

  onIonViewDidLeave(callback: LifeCycleCallback) {
    if (callback.id) {
      const index = this.ionViewDidLeaveCallbacks.findIndex((x) => x.id === callback.id);
      if (index > -1) {
        this.ionViewDidLeaveCallbacks[index] = callback;
      } else {
        this.ionViewDidLeaveCallbacks.push(callback);
      }
    } else {
      this.ionViewDidLeaveCallbacks.push(callback);
    }
  }

  ionViewDidLeave() {
    this.ionViewDidLeaveCallbacks.forEach((cb) => cb());
    this.componentCanBeDestroyed();
  }

  onComponentCanBeDestroyed(callback: () => void) {
    this.componentCanBeDestroyedCallback = callback;
  }

  componentCanBeDestroyed() {
    if (this.componentCanBeDestroyedCallback) {
      this.componentCanBeDestroyedCallback();
    }
  }
};
