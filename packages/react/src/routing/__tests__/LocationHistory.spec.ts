import { LocationHistory } from '../LocationHistory';
import { RouteInfo } from '../../models/RouteInfo';
import { generateId } from '../../utils/generateId';

let log = false;

describe('LocationHistory', () => {
  let locationHistory: LocationHistory;
  logHistory();
  log = true;

  beforeEach(() => {
    locationHistory = new LocationHistory();
  });

  describe('Popping history', () => {
    describe('page1 > page2', () => {
      beforeEach(() => {
        const firstRoute = createRoute('/page1');
        const secondRoute = createRoute('/page2', firstRoute);
        locationHistory.add(firstRoute);
        locationHistory.add(secondRoute);
      });

      it('then should be at /page2 canGoBack should be true', () => {
        expect(currentRoute().pathname).toEqual('/page2');
        expect(locationHistory.canGoBack()).toBeTruthy();
      });

      it('when going back, should be on /page1 and canGoBack should be false', () => {
        popRoute();
        expect(currentRoute().pathname).toEqual('/page1');
        expect(locationHistory.canGoBack()).toBeFalsy();
      });
    });

    describe('tab1 > tab2 > Back', () => {
      beforeEach(() => {
        const tab1Route = createRoute('/tab1', undefined, 'tab1');
        const tab2Route = createRoute('/tab2', tab1Route, 'tab2');
        locationHistory.add(tab1Route);
        locationHistory.add(tab2Route);
        popRoute();
      });

      it('then should be on tab1 and should not be able to go back', () => {
        expect(currentRoute().pathname).toEqual('/tab1');
        expect(locationHistory.canGoBack()).toBeFalsy();
      });
    });

    describe('tab1 > tab2 > tab3', () => {
      beforeEach(() => {
        const tab1Route = createRoute('/tab1', undefined, 'tab1');
        const tab2Route = createRoute('/tab2', tab1Route, 'tab2');
        const tab3Route = createRoute('/tab3', tab2Route, 'tab3');
        locationHistory.add(tab1Route);
        locationHistory.add(tab2Route);
        locationHistory.add(tab3Route);
      });

      it('when back once, then should be on tab2 and should be able to go back', () => {
        popRoute();
        expect(currentRoute().pathname).toEqual('/tab2');
        expect(locationHistory.canGoBack).toBeTruthy();
      });

      it('when going back twice, should be on tab1 and not be able to go back', () => {
        popRoute();
        popRoute();
        expect(currentRoute().pathname).toEqual('/tab1');
        expect(locationHistory.canGoBack()).toBeFalsy();
      });
    });

    describe('tab1 > tab1/details/1, then tab1/details/2', () => {
      beforeEach(() => {
        const homeRoute = createRoute('/tab1', undefined, 'tab1');
        const details1Route = createRoute('/tab1/details/1', undefined, 'tab1');
        const details2Route = createRoute('/tab1/details/2', undefined, 'tab1');
        locationHistory.add(homeRoute);
        locationHistory.add(details1Route);
        locationHistory.add(details2Route);
      });

      it('then should be at details2 and able to go back', () => {
        expect(currentRoute().pathname).toEqual('/tab1/details/2');
        expect(locationHistory.canGoBack()).toBeTruthy();
      });

      it('when going back, should be at details1 and able to go back', () => {
        popRoute();
        expect(currentRoute().pathname).toEqual('/tab1/details/1');
        expect(locationHistory.canGoBack()).toBeTruthy();
      });

      it('when going back twice, should be at home and not able to go back', () => {
        popRoute();
        popRoute();
        expect(currentRoute().pathname).toEqual('/tab1');
        expect(locationHistory.canGoBack()).toBeFalsy();
      });
    });
  });

  describe('Switching tabs', () => {
    describe('tab1 > tab2 > tab1', () => {
      beforeEach(() => {
        const tab1Route = createRoute('/tab1', undefined, 'tab1');
        const tab2Route = createRoute('/tab2', tab1Route, 'tab2');
        const tab1_2Route = createRoute('/tab1', tab2Route, 'tab1');
        locationHistory.add(tab1Route);
        locationHistory.add(tab2Route);
        locationHistory.add(tab1_2Route);
      });

      it('then locationHistory should have 3 entries', () =>
        expect((locationHistory as any).locationHistory.length).toEqual(3));

      it('then tab1 and tab2 should have one entry', () => {
        expect((locationHistory as any).tabHistory['tab1'].length).toEqual(1);
        expect((locationHistory as any).tabHistory['tab2'].length).toEqual(1);
      });
    });

    describe('tab1 > tab2 > tab3 > Back', () => {
      beforeEach(() => {
        const tab1Route = createRoute('/tab1', undefined, 'tab1');
        const tab2Route = createRoute('/tab2', tab1Route, 'tab2');
        const tab3Route = createRoute('/tab3', tab2Route, 'tab3');
        locationHistory.add(tab1Route);
        locationHistory.add(tab2Route);
        locationHistory.add(tab3Route);
        popRoute();
      });

      it('when going back, then locationHistory should have 2 entries', () => {
        expect((locationHistory as any).locationHistory.length).toEqual(2);
      });

      it('when going back, then tab1, tab2, and tab3 should have one entry', () => {
        expect((locationHistory as any).tabHistory['tab1'].length).toEqual(1);
        expect((locationHistory as any).tabHistory['tab2'].length).toEqual(1);
        expect((locationHistory as any).tabHistory['tab3'].length).toEqual(1);
      });
    });
  });

  describe('Replacing history', () => {
    describe('tab1 > tab1/details/1, tab1/details/2, Replace to tab1/details/3', () => {
      beforeEach(() => {
        const homeRoute = createRoute('/tab1', undefined, 'tab1');
        const details1Route = createRoute('/tab1/details/1', homeRoute, 'tab1');
        const details2Route = createRoute('/tab1/details/2', details1Route, 'tab1');
        const details3Route = createRoute('/tab1/details/3', details2Route, 'tab1', 'replace');
        locationHistory.add(homeRoute);
        locationHistory.add(details1Route);
        locationHistory.add(details2Route);
        locationHistory.add(details3Route);
      });

      it('then should be at details3', () => {
        expect(currentRoute().pathname).toEqual('/tab1/details/3');
      });

      it('tab1 history should have 3 entries and they should have correct paths', () => {
        expect((locationHistory as any).tabHistory['tab1'].length).toEqual(3);
        expect((locationHistory as any).tabHistory['tab1'][0].pathname).toEqual('/tab1');
        expect((locationHistory as any).tabHistory['tab1'][1].pathname).toEqual('/tab1/details/1');
        expect((locationHistory as any).tabHistory['tab1'][2].pathname).toEqual('/tab1/details/3');
      });

      it('locationHistory should have 3 entries and they should have correct paths', () => {
        expect((locationHistory as any).locationHistory.length).toEqual(3);
        expect((locationHistory as any).locationHistory[0].pathname).toEqual('/tab1');
        expect((locationHistory as any).locationHistory[1].pathname).toEqual('/tab1/details/1');
        expect((locationHistory as any).locationHistory[2].pathname).toEqual('/tab1/details/3');
      });
    });
  });

  function currentRoute() {
    return locationHistory.current();
  }

  function popRoute() {
    const previous = locationHistory.previous();
    previous.routeDirection = 'back';
    previous.routeAction = 'pop';
    locationHistory.add(previous);
  }

  function logHistory() {
    if (log) {
      console.log('locationHistory', (locationHistory as any).locationHistory);
      console.log('tabHistory', (locationHistory as any).tabHistory);
    }
  }
});

function createRoute(
  pathname: string = '',
  prevRoute?: RouteInfo,
  tab?: string,
  routeAction = 'push'
) {
  const routeInfo: RouteInfo = {
    id: generateId(),
    lastPathname: prevRoute?.pathname,
    prevRouteLastPathname: prevRoute?.lastPathname,
    routeAction: routeAction as any,
    routeDirection: 'forward',
    pushedByRoute: prevRoute?.pathname,
    pathname: pathname,
    tab: tab,
    search: '',
  };
  return routeInfo;
}
