import { createLocationHistory } from '../src/locationHistory';

let locationHistory;
describe('Location History', () => {
  beforeEach(() => {
    locationHistory = createLocationHistory();
  });

  it('should correctly add an item to location history', () => {
    locationHistory.add({ pathname: '/' });
    expect(locationHistory.canGoBack(1)).toEqual(false);
  });

  it('should correctly replace an item to location history', () => {
    locationHistory.add({ pathname: '/home' });
    locationHistory.add({ pathname: '/login', routerAction: 'replace' });

    const current = locationHistory.current();
    expect(current.pathname).toEqual('/login');
  });

  it('should correctly pop an item from location history', () => {
    locationHistory.add({ pathname: '/home' });
    locationHistory.add({ pathname: '/login', routerAction: 'pop' });

    const current = locationHistory.current();
    expect(current.pathname).toEqual('/login');
    expect(locationHistory.canGoBack(1)).toEqual(false);
  });

  it('should correctly wipe location history when routerDirection is root', () => {
    locationHistory.add({ pathname: '/home' });
    locationHistory.add({ pathname: '/login' });
    locationHistory.add({ pathname: '/logout', routerDirection: 'root' });

    const current = locationHistory.current();
    expect(current.pathname).toEqual('/logout');
    expect(locationHistory.canGoBack(1)).toEqual(false);
  });

  it('should correctly update a route', () => {
    locationHistory.add({ id: '1', pathname: '/tabs/tab1', tab: 'tab1' });
    locationHistory.add({ id: '2', pathname: '/tabs/tab2' });

    const current = { ...locationHistory.current() };
    current.tab = 'tab2';

    locationHistory.update(current);

    const getCurrentAgain = locationHistory.current();
    expect(getCurrentAgain.tab).toEqual('tab2');
  });

  it('should correctly get the first route for a tab', () => {
    locationHistory.add({ id: '1', pathname: '/tabs/tab1', tab: 'tab1' });
    locationHistory.add({ id: '2', pathname: '/tabs/tab1/child', tab: 'tab1' });
    locationHistory.add({ id: '2', pathname: '/tabs/tab1/child/1', tab: 'tab1' });

    const first = locationHistory.getFirstRouteInfoForTab('tab1');
    expect(first.pathname).toEqual('/tabs/tab1');
  });

  it('should correctly get the current route for a tab', () => {
    locationHistory.add({ id: '1', pathname: '/tabs/tab1', tab: 'tab1' });
    locationHistory.add({ id: '2', pathname: '/tabs/tab1/child', tab: 'tab1' });
    locationHistory.add({ id: '2', pathname: '/tabs/tab1/child/1', tab: 'tab1' });

    const first = locationHistory.getCurrentRouteInfoForTab('tab1');
    expect(first.pathname).toEqual('/tabs/tab1/child/1');
  });

  it('should correctly get current and previous routes', () => {
    locationHistory.add({ pathname: '/home' });
    locationHistory.add({ pathname: '/login' });

    const current = locationHistory.current();
    expect(current.pathname).toEqual('/login');

    const previous = locationHistory.previous();
    expect(previous.pathname).toEqual('/home');
  });

  it('should correctly determine if we can go back', () => {
    locationHistory.add({ pathname: '/home' });
    locationHistory.add({ pathname: '/login' });

    expect(locationHistory.canGoBack(1)).toEqual(true);
    expect(locationHistory.canGoBack(2)).toEqual(false);
  });
});
