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
  cleanupIonViewWillEnter: (callback: () => void) => void;
  cleanupIonViewDidEnter: (callback: () => void) => void;
  cleanupIonViewWillLeave: (callback: () => void) => void;
  cleanupIonViewDidLeave: (callback: () => void) => void;
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
  cleanupIonViewWillEnter: () => {
    return;
  },
  cleanupIonViewDidEnter: () => {
    return;
  },
  cleanupIonViewWillLeave: () => {
    return;
  },
  cleanupIonViewDidLeave: () => {
    return;
  },
});

export interface LifeCycleCallback {
  (): void | (() => void | undefined);
  id?: number;
}

export interface LifeCycleDestructor {
  id: number;
  destructor: ReturnType<LifeCycleCallback>;
}

export const DefaultIonLifeCycleContext = class implements IonLifeCycleContextInterface {
  ionViewWillEnterCallbacks: LifeCycleCallback[] = [];
  ionViewDidEnterCallbacks: LifeCycleCallback[] = [];
  ionViewWillLeaveCallbacks: LifeCycleCallback[] = [];
  ionViewDidLeaveCallbacks: LifeCycleCallback[] = [];
  componentCanBeDestroyedCallback?: () => void;
  ionViewWillEnterDestructorCallbacks: LifeCycleDestructor[] = [];
  ionViewDidEnterDestructorCallbacks: LifeCycleDestructor[] = [];
  ionViewWillLeaveDestructorCallbacks: LifeCycleDestructor[] = [];
  ionViewDidLeaveDestructorCallbacks: LifeCycleDestructor[] = [];

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

  teardownCallback(callback: LifeCycleCallback, callbacks: any[]) {
    // Find any destructors that have been registered for the callback
    const matches = callbacks.filter((x) => x.id === callback.id);
    if (matches.length !== 0) {
      // Execute the destructor for each matching item
      matches.forEach((match) => {
        if (match && typeof match.destructor === 'function') {
          match.destructor();
        }
      });
      // Remove all matching items from the array
      callbacks = callbacks.filter((x) => x.id !== callback.id);
    }
  }

  /**
   * Tears down the user-provided ionViewWillEnter lifecycle callback.
   * This is the same behavior as React's useEffect hook. The callback
   * is invoked when the component is unmounted.
   */
  cleanupIonViewWillEnter(callback: LifeCycleCallback) {
    this.teardownCallback(callback, this.ionViewWillEnterDestructorCallbacks);
  }

  /**
   * Tears down the user-provided ionViewDidEnter lifecycle callback.
   * This is the same behavior as React's useEffect hook. The callback
   * is invoked when the component is unmounted.
   */
  cleanupIonViewDidEnter(callback: LifeCycleCallback) {
    this.teardownCallback(callback, this.ionViewDidEnterDestructorCallbacks);
  }

  /**
   * Tears down the user-provided ionViewWillLeave lifecycle callback.
   * This is the same behavior as React's useEffect hook. The callback
   * is invoked when the component is unmounted.
   */
  cleanupIonViewWillLeave(callback: LifeCycleCallback) {
    this.teardownCallback(callback, this.ionViewWillLeaveDestructorCallbacks);
  }

  /**
   * Tears down the user-provided ionViewDidLeave lifecycle callback.
   * This is the same behavior as React's useEffect hook. The callback
   * is invoked when the component is unmounted.
   */
  cleanupIonViewDidLeave(callback: LifeCycleCallback) {
    this.teardownCallback(callback, this.ionViewDidLeaveDestructorCallbacks);
  }

  ionViewWillEnter() {
    this.ionViewWillEnterCallbacks.forEach((cb) => {
      const destructor = cb();
      if (cb.id) {
        this.ionViewWillEnterDestructorCallbacks.push({ id: cb.id, destructor });
      }
    });
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
    this.ionViewDidEnterCallbacks.forEach((cb) => {
      const destructor = cb();
      if (cb.id) {
        this.ionViewDidEnterDestructorCallbacks.push({ id: cb.id, destructor });
      }
    });
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
    this.ionViewWillLeaveCallbacks.forEach((cb) => {
      const destructor = cb();
      if (cb.id) {
        this.ionViewWillLeaveDestructorCallbacks.push({ id: cb.id, destructor });
      }
    });
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
    this.ionViewDidLeaveCallbacks.forEach((cb) => {
      const destructor = cb();
      if (cb.id) {
        this.ionViewDidLeaveDestructorCallbacks.push({ id: cb.id, destructor });
      }
    });
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
