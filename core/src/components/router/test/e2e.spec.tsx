import { mockWindow } from '@stencil/core/testing';

import { RouteChain, RouteID } from '../utils/interface';
import { routerIDsToChain, routerPathToChain } from '../utils/matching';
import { readRoutes } from '../utils/parser';
import { chainToPath, generatePath, parsePath } from '../utils/path';

import { mockRouteElement } from './parser.spec';

describe('ionic-conference-app', () => {

  it('should match conference-app routing', () => {
    const root = conferenceAppRouting();
    const routes = readRoutes(root);

    expect(getRouteIDs('/', routes)).toEqual(['page-tabs', 'tab-schedule', 'page-schedule']);
    expect(getRouteIDs('/speaker', routes)).toEqual(['page-tabs', 'tab-speaker', 'page-speaker-list']);
    expect(getRouteIDs('/map', routes)).toEqual(['page-tabs', 'page-map']);
    expect(getRouteIDs('/about', routes)).toEqual(['page-tabs', 'page-about']);
    expect(getRouteIDs('/tutorial', routes)).toEqual(['page-tutorial']);

    expect(getRoutePath([
      { id: 'PAGE-TABS' },
      { id: 'tab-schedule' },
      { id: 'page-schedule' }], routes)).toEqual('/');

    expect(getRoutePath([
      { id: 'page-tabs' },
      { id: 'TAB-SPEAKER' }], routes)).toEqual('/speaker');

    expect(getRoutePath([
      { id: 'page-tabs' },
      { id: 'TAB-SPEAKER' },
      { id: 'page-speaker-list' }], routes)).toEqual('/speaker');

    expect(getRoutePath([
      { id: 'page-tabs' },
      { id: 'PAGE-MAP' }], routes)).toEqual('/map');

    expect(getRoutePath([
      { id: 'page-tabs' },
      { id: 'page-about' }], routes)).toEqual('/about');

    expect(getRoutePath([
      { id: 'page-tutorial' }], routes)).toEqual('/tutorial');
  });

  let win: Window;
  beforeEach(() => {
    win = mockWindow();
  });

  function conferenceAppRouting() {
  const p2 = mockRouteElement(win, '/', 'tab-schedule');
  const p3 = mockRouteElement(win, '/', 'PAGE-SCHEDULE');
  p2.appendChild(p3);

  const p4 = mockRouteElement(win, '/speaker', 'tab-speaker');
  const p5 = mockRouteElement(win, '/', 'page-speaker-list');
  p4.appendChild(p5);

  const p6 = mockRouteElement(win, '/map', 'page-map');
  const p7 = mockRouteElement(win, '/about', 'page-about');

  const p1 = mockRouteElement(win, '/', 'page-tabs');
  p1.appendChild(p2);
  p1.appendChild(p4);
  p1.appendChild(p6);
  p1.appendChild(p7);

  const p8 = mockRouteElement(win, '/tutorial', 'page-tutorial');
  const container = win.document.createElement('div');
  container.appendChild(p1);
  container.appendChild(p8);
  return container;
}
});

export function getRouteIDs(path: string, routes: RouteChain[]): string[] {
  return routerPathToChain(parsePath(path), routes)!.map(r => r.id);
}

export function getRoutePath(ids: RouteID[], routes: RouteChain[]): string {
  return generatePath(chainToPath(routerIDsToChain(ids, routes)!)!);
}
