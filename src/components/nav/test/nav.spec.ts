import { Nav } from '../nav';

import { GestureController } from '../../../gestures/gesture-controller';
import {
  mockApp,
  mockConfig,
  mockDeepLinker,
  mockDomController,
  mockElementRef,
  mockPlatform,
  mockRenderer,
  mockTrasitionController,
  mockZone,
} from '../../../util/mock-providers';

describe('Nav', () => {
  describe('ngAfterViewInit', () => {
    it('should call initViews when segment has a component', (done: Function) => {
      const nav = getNav();
      const knownComponent = {};
      const knownSegment = {
        component: knownComponent
      };
      const knownViews = {};
      spyOn(nav._linker, 'getSegmentByNavIdOrName').and.returnValue(knownSegment);
      spyOn(nav._linker, 'initViews').and.returnValue(Promise.resolve(knownViews));
      spyOn(nav, 'setPages');

      const promise = nav.ngAfterViewInit();

      promise.then(() => {
        expect(nav._linker.getSegmentByNavIdOrName).toHaveBeenCalledWith(nav.id, nav.name);
        expect(nav.setPages).toHaveBeenCalledWith(knownViews, null, null);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    });

    it('should call initViews when segment has a loadChildren string', (done: Function) => {
      const nav = getNav();
      const knownLoadChildren = 'someString';
      const knownSegment = {
        loadChildren: knownLoadChildren
      };
      const knownViews = {};
      spyOn(nav._linker, 'getSegmentByNavIdOrName').and.returnValue(knownSegment);
      spyOn(nav._linker, 'initViews').and.returnValue(Promise.resolve(knownViews));
      spyOn(nav, 'setPages');

      const promise = nav.ngAfterViewInit();

      promise.then(() => {
        expect(nav._linker.initViews).toHaveBeenCalledWith(knownSegment);
        expect(nav.setPages).toHaveBeenCalledWith(knownViews, null, null);
        done();
      }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    });

    it('should call push when root is set', (done: Function) => {
       const nav = getNav();
       const knownComponent = {};
       nav.root = knownComponent;

       spyOn(nav, 'push').and.returnValue(Promise.resolve());

       const promise = nav.ngAfterViewInit();

       promise.then(() => {
        expect(nav.push).toHaveBeenCalled();
        done();
       }).catch((err: Error) => {
        fail(err);
        done(err);
      });
    });
  });
});

function getNav() {
  const platform = mockPlatform();
  const config = mockConfig(null, '/', platform);
  const app = mockApp(config, platform);
  const zone = mockZone();
  const dom = mockDomController(platform);
  const elementRef = mockElementRef();
  const renderer = mockRenderer();
  const componentFactoryResolver: any = null;
  const gestureCtrl = new GestureController(app);
  const linker = mockDeepLinker(null, app);
  const trnsCtrl = mockTrasitionController(config);
  const nav = new Nav(
    null,
    null,
    app,
    config,
    platform,
    elementRef,
    zone,
    renderer,
    componentFactoryResolver,
    gestureCtrl,
    trnsCtrl,
    linker,
    dom,
    null
  );
  return nav;
}
