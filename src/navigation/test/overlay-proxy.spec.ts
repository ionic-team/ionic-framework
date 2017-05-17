import { OverlayProxy } from '../overlay-proxy';

import { mockApp, mockConfig, mockDeepLinker, mockOverlay } from '../../util/mock-providers';

describe('Overlay Proxy', () => {
  describe('dismiss', () => {
    it('should call dismiss if overlay is loaded', (done: Function) => {

      const instance = new OverlayProxy(mockApp(), 'my-component', mockConfig(), mockDeepLinker());
      instance.overlay = mockOverlay();
      spyOn(instance.overlay, instance.overlay.dismiss.name).and.returnValue(Promise.resolve());

      const promise = instance.dismiss();

      promise.then(() => {
        expect(instance.overlay.dismiss).toHaveBeenCalled();
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    });
  });

  describe('onWillDismiss', () => {
    it('should update the handler on the overlay object', () => {
      const instance = new OverlayProxy(mockApp(), 'my-component', mockConfig(), mockDeepLinker());
      instance.overlay = mockOverlay();
      spyOn(instance.overlay, instance.overlay.onWillDismiss.name);

      const handler = () => { };
      instance.onWillDismiss(handler);

      expect(instance.overlay.onWillDismiss).toHaveBeenCalledWith(handler);
    });
  });

  describe('onDidDismiss', () => {
    it('should update the handler on the overlay object', () => {
      const instance = new OverlayProxy(mockApp(), 'my-component', mockConfig(), mockDeepLinker());
      instance.overlay = mockOverlay();
      spyOn(instance.overlay, instance.overlay.onDidDismiss.name);

      const handler = () => { };
      instance.onDidDismiss(handler);

      expect(instance.overlay.onDidDismiss).toHaveBeenCalledWith(handler);
    });
  });

  describe('createAndPresentOverlay', () => {
    it('should set onWillDismiss and onDidDismiss handlers', (done: Function) => {
      const instance = new OverlayProxy(mockApp(), 'my-component', mockConfig(), mockDeepLinker());
      const handler = () => { };
      instance.onWillDismiss(handler);
      instance.onDidDismiss(handler);
      const knownOptions = {};
      const knownOverlay = mockOverlay();

      spyOn(knownOverlay, knownOverlay.present.name).and.returnValue(Promise.resolve());
      spyOn(knownOverlay, knownOverlay.onDidDismiss.name);
      spyOn(knownOverlay, knownOverlay.onWillDismiss.name);
      spyOn(instance, 'getImplementation').and.returnValue(knownOverlay);

      const promise = instance.createAndPresentOverlay(knownOptions);

      promise.then(() => {
        expect(knownOverlay.present).toHaveBeenCalledWith(knownOptions);
        expect(knownOverlay.onDidDismiss).toHaveBeenCalledWith(handler);
        expect(knownOverlay.onWillDismiss).toHaveBeenCalledWith(handler);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    });
  });

  describe('present', () => {
    it('should use present the overlay immediately if the component is not a string', (done: Function) => {
      const knownComponent = { };
      const deepLinker = mockDeepLinker();
      const knownOverlay = mockOverlay();
      const instance = new OverlayProxy(mockApp(), knownComponent, mockConfig(), deepLinker);
      const knownOptions = {};

      spyOn(instance, 'getImplementation').and.returnValue(knownOverlay);
      spyOn(deepLinker, 'getComponentFromName');

      const promise = instance.present(knownOptions);

      promise.then(() => {
        expect(deepLinker.getComponentFromName).not.toHaveBeenCalled();
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    });

    it('should load the component if its a string before using it', (done: Function) => {
      const knownComponent = { };
      const deepLinker = mockDeepLinker();
      const knownOverlay = mockOverlay();
      const componentName = 'my-component';
      const instance = new OverlayProxy(mockApp(), componentName, mockConfig(), deepLinker);
      const knownOptions = {};

      spyOn(instance, 'getImplementation').and.returnValue(knownOverlay);
      spyOn(deepLinker, 'getComponentFromName').and.returnValue(Promise.resolve(knownComponent));

      const promise = instance.present(knownOptions);

      promise.then(() => {
        expect(deepLinker.getComponentFromName).toHaveBeenCalledWith(componentName);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    });
  });
});
