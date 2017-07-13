import { LAZY_LOADED_TOKEN, ModuleLoader, setupPreloadingImplementation } from '../module-loader';
import { mockConfig, mockModuleLoader, mockNgModuleLoader } from '../mock-providers';
import { NgModuleLoader } from '../ng-module-loader';
import { Config } from '../../config/config';
import { DeepLinkConfig } from '../../navigation/nav-util';


describe('module-loader', () => {

  describe('load', () => {

    it('should call ngModuleLoader and receive a promise back', (done: Function) => {
      const mockLoadedModule = {
        create: () => { }
      };
      const mockComponentFactoryResolver = {};
      const mockInjector = {
        get: () => { }
      };
      const mockNgModuleRef = {
        injector: mockInjector,
        componentFactoryResolver: mockComponentFactoryResolver
      };
      const mockComponent = {};
      spyOn(mockInjector, mockInjector.get.name).and.returnValue(mockComponent);
      spyOn(mockLoadedModule, mockLoadedModule.create.name).and.returnValue(mockNgModuleRef);
      spyOn(ngModuleLoader, 'load').and.returnValue(Promise.resolve(mockLoadedModule));

      let pathPrefix = '../some/known/path';
      let exportSuffix = 'SomeModule';
      let loadChildren = pathPrefix + '#' + exportSuffix;

      let promise = moduleLoader.load(loadChildren);

      promise.then((response) => {
        expect(ngModuleLoader.load).toHaveBeenCalledWith(pathPrefix, exportSuffix);
        expect(mockLoadedModule.create).toHaveBeenCalledWith(null); // whatever the injector is
        expect(mockInjector.get).toHaveBeenCalledWith(LAZY_LOADED_TOKEN);
        expect(response.component).toEqual(mockComponent);
        expect(response.componentFactoryResolver).toEqual(mockComponentFactoryResolver);
        done();
      }).catch((err: Error) => {
          fail(err);
          done(err);
      });
    });

    it('should only call the ngModuleLoader when there is not an active request', () => {
      let resolve: any = null;
      let reject: any = null;
      let promise = new Promise((scopedResolved, scopedReject) => {
          resolve = scopedResolved;
          reject = scopedReject;
      });

      spyOn(ngModuleLoader, 'load').and.returnValue(promise);

      let pathPrefix = '../some/known/path';
      let exportSuffix = 'SomeModule';
      let loadChildren = pathPrefix + '#' + exportSuffix;

      promise = moduleLoader.load(loadChildren);

      // the promise is not resolved
      let secondPromise = moduleLoader.load(loadChildren);

      // The promise returned should be the cached promise
      expect(promise).toEqual(secondPromise);

      expect(ngModuleLoader.load).toHaveBeenCalledTimes(1);
    });

    it('should call the ngModuleLoader twice and return the active request', () => {
      let resolve: any = null;
      let reject: any = null;
      let promise = new Promise((scopedResolved, scopedReject) => {
          resolve = scopedResolved;
          reject = scopedReject;
      });
      let promise2 = new Promise((scopedResolved, scopedReject) => {
          resolve = scopedResolved;
          reject = scopedReject;
      });

      spyOn(ngModuleLoader, 'load').and.returnValue(promise);

      // Load the first module
      let pathPrefix = '../some/known/path';
      let exportSuffix = 'SomeModule';
      let loadChildren = pathPrefix + '#' + exportSuffix;

      promise = moduleLoader.load(loadChildren);
      expect(ngModuleLoader.load).toHaveBeenCalledWith(pathPrefix, exportSuffix);

      // Load the second module
      let pathPrefix2 = '../another/known/path';
      let exportSuffix2 = 'AnotherModule';
      let loadChildren2 = pathPrefix2 + '#' + exportSuffix2;

      promise2 = moduleLoader.load(loadChildren2);
      expect(ngModuleLoader.load).toHaveBeenCalledWith(pathPrefix2, exportSuffix2);

      // Load the first module before the promise has resolved
      let secondPromise = moduleLoader.load(loadChildren);

      // The promise returned from the first module should be the cached promise
      expect(promise).toEqual(secondPromise);

      // Load the second module before the promise has resolved
      let thirdPromise = moduleLoader.load(loadChildren2);

      // The promise returned from the second module should be the cached promise
      expect(promise2).toEqual(thirdPromise);

      expect(ngModuleLoader.load).toHaveBeenCalledTimes(2);
    });

  });

  describe('setupPreloadingImplementation', () => {

    it('should return a promise', (done: Function) => {
      let promise = setupPreloadingImplementation(config, null, moduleLoader);
      promise.then(() => {
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    });

    it('should not call ModuleLoader when preloading disabled', (done: Function) => {
      spyOn(moduleLoader, 'load').and.returnValue(Promise.resolve());

      config.set('preloadModules', false);
      const deepLinkConfig: DeepLinkConfig = {
        links: []
      };
      let promise = setupPreloadingImplementation(config, deepLinkConfig, moduleLoader);
      promise.then(() => {
        expect(moduleLoader.load).not.toHaveBeenCalled();
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    });

    it('should not call ModuleLoader when deepLinkConfig missing', (done: Function) => {
      spyOn(moduleLoader, 'load').and.returnValue(Promise.resolve());

      config.set('preloadModules', true);
      let promise = setupPreloadingImplementation(config, null, moduleLoader);
      promise.then(() => {
        expect(moduleLoader.load).not.toHaveBeenCalled();
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    });

    it('should not call ModuleLoader when no low or high priority links', (done: Function) => {
      spyOn(moduleLoader, 'load').and.returnValue(Promise.resolve());

      config.set('preloadModules', true);
      const deepLinkConfig: DeepLinkConfig = {
        links: [{
          loadChildren: 'offString',
          priority: 'off'
        }]
      };
      let promise = setupPreloadingImplementation(config, deepLinkConfig, moduleLoader);
      promise.then(() => {
        expect(moduleLoader.load).not.toHaveBeenCalled();
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    });

    it('should call ModuleLoader when has low priority links', (done: Function) => {
      spyOn(moduleLoader, 'load').and.returnValue(Promise.resolve());

      config.set('preloadModules', true);
      const deepLinkConfig: DeepLinkConfig = {
        links: [{
          loadChildren: 'lowString',
          priority: 'low'
        }]
      };
      let promise = setupPreloadingImplementation(config, deepLinkConfig, moduleLoader);
      promise.then(() => {
        expect(moduleLoader.load).toHaveBeenCalledWith('lowString');
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    });

    it('should call ModuleLoader when has high priority links', (done: Function) => {
      spyOn(moduleLoader, 'load').and.returnValue(Promise.resolve());

      config.set('preloadModules', true);
      const deepLinkConfig: DeepLinkConfig = {
        links: [{
          loadChildren: 'highString',
          priority: 'high'
        }]
      };
      let promise = setupPreloadingImplementation(config, deepLinkConfig, moduleLoader);
      promise.then(() => {
        expect(moduleLoader.load).toHaveBeenCalledWith('highString');
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    });

  });

  var moduleLoader: ModuleLoader;
  var ngModuleLoader: NgModuleLoader;
  var config: Config;

  beforeEach(() => {
    ngModuleLoader = mockNgModuleLoader();
    moduleLoader = mockModuleLoader(ngModuleLoader);
    config = mockConfig();
  });

});
