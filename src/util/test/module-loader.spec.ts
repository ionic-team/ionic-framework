import { ModuleLoader } from '../module-loader';
import { mockModuleLoader, mockNgModuleLoader } from '../mock-providers';
import { NgModuleLoader } from '../ng-module-loader';


describe('module-loader', () => {

  describe('load', () => {

    it('should call ngModuleLoader and receive a promise back', (done: Function) => {
        spyOn(ngModuleLoader, 'load').and.returnValue(Promise.resolve());

        let pathPrefix = '../some/known/path';
        let exportSuffix = 'SomeModule';
        let loadChildren = pathPrefix + '#' + exportSuffix;

        let promise = moduleLoader.load(loadChildren);

        promise.then((response) => {
          expect(ngModuleLoader.load).toHaveBeenCalledWith(pathPrefix, exportSuffix);
        }).catch((err: Error) => {
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

  var moduleLoader: ModuleLoader;
  var ngModuleLoader: NgModuleLoader;

  beforeEach(() => {
    ngModuleLoader = mockNgModuleLoader();
    moduleLoader = mockModuleLoader(ngModuleLoader);
  });

});
