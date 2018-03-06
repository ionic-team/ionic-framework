import { RouteChain } from '../utils/interfaces';
import { routerIDsToChain, routerPathToChain } from '../utils/matching';
import { mockRouteElement } from './parser.spec';
import { chainToPath, generatePath, parsePath } from '../utils/path';
import { flattenRouterTree, readRoutes } from '../utils/parser';
import { mockElement } from '@stencil/core/dist/testing';

describe('ionic-conference-app', () => {

  it('should match conference-app routing', () => {
    const root = conferenceAppRouting();
    const tree = readRoutes(root);
    const routes = flattenRouterTree(tree);

    expect(getRouteIDs('/', routes)).toEqual(['page-tabs', 'tab-schedule', 'page-schedule']);
    expect(getRouteIDs('/speaker', routes)).toEqual(['page-tabs', 'tab-speaker', 'page-speaker-list']);
    expect(getRouteIDs('/map', routes)).toEqual(['page-tabs', 'page-map']);
    expect(getRouteIDs('/about', routes)).toEqual(['page-tabs', 'page-about']);
    expect(getRouteIDs('/tutorial', routes)).toEqual(['page-tutorial']);

    expect(getRoutePaths(['page-tabs', 'tab-schedule', 'page-schedule'], routes)).toEqual('/');
    expect(getRoutePaths(['page-tabs', 'tab-speaker', 'page-speaker-list'], routes)).toEqual('/speaker');
    expect(getRoutePaths(['page-tabs', 'page-map'], routes)).toEqual('/map');
    expect(getRoutePaths(['page-tabs', 'page-about'], routes)).toEqual('/about');
    expect(getRoutePaths(['page-tutorial'], routes)).toEqual('/tutorial');

  });
});


function conferenceAppRouting() {
  const p2 = mockRouteElement('/', 'tab-schedule');
  const p3 = mockRouteElement('/', 'page-schedule');
  p2.appendChild(p3);

  const p4 = mockRouteElement('/speaker', 'tab-speaker');
  const p5 = mockRouteElement('/', 'page-speaker-list');
  p4.appendChild(p5);

  const p6 = mockRouteElement('/map', 'page-map');
  const p7 = mockRouteElement('/about', 'page-about');

  const p1 = mockRouteElement('/', 'page-tabs');
  p1.appendChild(p2);
  p1.appendChild(p4);
  p1.appendChild(p6);
  p1.appendChild(p7);

  const p8 = mockRouteElement('/tutorial', 'page-tutorial');
  const container = mockElement('div');
  container.appendChild(p1);
  container.appendChild(p8);
  return container;
}



function getRouteIDs(path: string, routes: RouteChain[]): string[] {
  return routerPathToChain(parsePath(path), routes).chain.map(r => r.id);
}

function getRoutePaths(ids: string[], routes: RouteChain[]): string {
  return generatePath(chainToPath(routerIDsToChain(ids, routes).chain));
}

