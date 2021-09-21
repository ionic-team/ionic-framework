/**
 * @jest-environment jsdom
 */
import { createViewStacks } from '../src/viewStacks';

let viewStacks;
let counter = 0;

describe('View Stacks', () => {
  beforeEach(() => {
    counter = 0;
    viewStacks = createViewStacks();
  });

  it('should create a view item', () => {
    const item = viewStacks.createViewItem(
      '1',
      () => {},
      { path: '/mockMatchedRoute' },
      { pathname: '/home' }
    );

    expect(item.outletId).toEqual('1');
    expect(item.matchedRoute).toEqual({ path: '/mockMatchedRoute' });
    expect(item.pathname).toEqual('/home');
  });

  it('should add a view item', () => {
    const item = viewStacks.createViewItem(
      '1',
      () => {},
      { path: '/mockMatchedRoute' },
      { pathname: '/home' }
    );

    viewStacks.add(item);
    const viewItem = viewStacks.findViewItemByRouteInfo({ pathname: '/home' }, '1');
    expect(viewItem).toEqual(item);
  });

  it('should register an ion page', () => {
    const item = viewStacks.createViewItem(
      '1',
      () => {},
      { path: '/mockMatchedRoute' },
      { pathname: '/home' }
    );

    viewStacks.add(item);

    const ionPage = document.createElement('div');
    ionPage.classList.add('ion-page');

    viewStacks.registerIonPage(item, ionPage);

    const viewItem = viewStacks.findViewItemByRouteInfo({ pathname: '/home' }, '1');
    expect(viewItem.ionPageElement).toEqual(ionPage);
  });

  it('should get view item by route info', () => {
    const itemA = createRegisteredViewItem(viewStacks, '1', '/home');
    const itemB = createRegisteredViewItem(viewStacks, '2', '/dashboard');

    const getViewItem = viewStacks.findViewItemByRouteInfo({ pathname: '/dashboard', outletId: '2' });
    expect(getViewItem.id).toEqual(itemB.id);

    const getViewItemAgain = viewStacks.findViewItemByRouteInfo({ pathname: '/dashboard' });
    expect(getViewItemAgain.id).toEqual(itemB.id);
  });

  it('should get leaving view by route info', () => {
    const itemA = createRegisteredViewItem(viewStacks, '1', '/home');
    const itemB = createRegisteredViewItem(viewStacks, '2', '/dashboard');

    const getLeavingView = viewStacks.findLeavingViewItemByRouteInfo({ pathname: '/home', lastPathname: '/dashboard', matchedRoute: { path: '/home' } });

    expect(getLeavingView).toEqual(itemB);
  });

  it('should get children to render', () => {
    const itemA = createRegisteredViewItem(viewStacks);
    const itemB = createRegisteredViewItem(viewStacks);
    const itemC = createRegisteredViewItem(viewStacks);

    itemA.mount = itemC.mount = true;

    const routes = viewStacks.getChildrenToRender(1);
    expect(routes).toEqual([
      itemA,
      itemC
    ]);
  });

  it('should clear a stack', () => {
    const itemA = createRegisteredViewItem(viewStacks, 2);
    const itemB = createRegisteredViewItem(viewStacks, 2);

    const viewItems = viewStacks.getViewStack(2);
    expect(viewItems.length).toEqual(2);

    viewStacks.clear('2');

    const viewItemsAgain = viewStacks.getViewStack(2);
    expect(viewItemsAgain).toEqual(undefined);
  });

  it('should unmount orphaned views', () => {
    const itemA = createRegisteredViewItem(viewStacks, 1, '/home/1', true);
    const itemB = createRegisteredViewItem(viewStacks, 1, '/home/2', true);
    const itemC = createRegisteredViewItem(viewStacks, 1, '/home/3', true);
    const itemD = createRegisteredViewItem(viewStacks, 1, '/home/4', true);

    viewStacks.unmountLeavingViews(1, itemA, itemD);

    expect(itemB.mount).toEqual(false);
    expect(itemB.ionPageElement).toEqual(undefined);
    expect(itemB.ionRoute).toEqual(false);

    expect(itemC.mount).toEqual(false);
    expect(itemC.ionPageElement).toEqual(undefined);
    expect(itemC.ionRoute).toEqual(false);
  });

  it('should remount intermediary views', () => {
    const itemA = createRegisteredViewItem(viewStacks);
    const itemB = createRegisteredViewItem(viewStacks);
    const itemC = createRegisteredViewItem(viewStacks);
    const itemD = createRegisteredViewItem(viewStacks);

    viewStacks.mountIntermediaryViews(1, itemD, itemA);

    expect(itemB.mount).toEqual(true);
    expect(itemC.mount).toEqual(true);
  });
})

const createRegisteredViewItem = (viewStacks, outletId = '1', route = `/home/${counter++}`, mount = false) => {
  const item = viewStacks.createViewItem(
    outletId,
    () => {},
    { path: '/mockMatchedRoute' },
    { pathname: route }
  );

  viewStacks.add(item);

  if (mount) {
    const ionPage = document.createElement('div');
    ionPage.classList.add('ion-page');

    viewStacks.registerIonPage(item, ionPage);

    item.mount = true;
    item.ionRoute = true;
  }

  return item;
}
