import { mockWindow } from '@stencil/core/testing';

import type { RouteRedirect, RouteTree } from '../utils/interface';
import { flattenRouterTree, readRedirects, readRouteNodes } from '../utils/parser';

describe('parser', () => {
  describe('readRoutes', () => {
    it('should read URL', () => {
      const root = win.document.createElement('div');
      const r1 = mockRouteElement(win, '/', 'MAIN-PAGE');
      const r2 = mockRouteElement(win, '/one-page', 'one-page');
      const r3 = mockRouteElement(win, 'secondpage', 'second-page');
      const r4 = mockRouteElement(win, '/5/hola', '4');
      const r5 = mockRouteElement(win, '/path/to/five', '5');
      const r6 = mockRouteElement(win, '/path/to/five2', '6');
      const r7 = mockRouteElement(win, '/path?flag=true', '6');

      root.appendChild(r1);
      root.appendChild(r2);
      root.appendChild(r3);
      root.appendChild(r7);
      r3.appendChild(r4);
      r4.appendChild(r5);
      r4.appendChild(r6);

      const expected: RouteTree = [
        { segments: [''], id: 'main-page', children: [], params: undefined },
        { segments: ['one-page'], id: 'one-page', children: [], params: undefined },
        {
          segments: ['secondpage'],
          id: 'second-page',
          params: undefined,
          children: [
            {
              segments: ['5', 'hola'],
              id: '4',
              params: undefined,
              children: [
                { segments: ['path', 'to', 'five'], id: '5', children: [], params: undefined },
                { segments: ['path', 'to', 'five2'], id: '6', children: [], params: undefined },
              ],
            },
          ],
        },
        { segments: ['path'], id: '6', children: [], params: undefined },
      ];
      expect(readRouteNodes(root)).toEqual(expected);
    });
  });

  describe('readRedirects', () => {
    it('should read redirects', () => {
      const root = win.document.createElement('div');
      const r1 = mockRedirectElement(win, '/', undefined);
      const r2 = mockRedirectElement(win, undefined, '/workout');
      const r3 = mockRedirectElement(win, '*', null);
      const r4 = mockRedirectElement(win, '/workout/*', '');
      const r5 = mockRedirectElement(win, 'path/hey', '/path/to//login');
      const r6 = mockRedirectElement(win, 'path/qs', '/path?qs=true');

      root.appendChild(r1);
      root.appendChild(r2);
      root.appendChild(r3);
      root.appendChild(r4);
      root.appendChild(r5);
      root.appendChild(r6);

      const expected: RouteRedirect[] = [
        { from: [''], to: undefined },
        { from: [''], to: { segments: ['workout'] } },
        { from: ['*'], to: undefined },
        { from: ['workout', '*'], to: { segments: [''] } },
        { from: ['path', 'hey'], to: { segments: ['path', 'to', 'login'] } },
        { from: ['path', 'qs'], to: { segments: ['path'], queryString: 'qs=true' } },
      ];
      expect(readRedirects(root)).toEqual(expected);
    });
  });

  describe('flattenRouterTree', () => {
    it('should process routes', () => {
      const entries: RouteTree = [
        { segments: [''], id: 'hola', children: [], params: undefined },
        { segments: ['one-page'], id: 'one-page', children: [], params: undefined },
        {
          segments: ['secondpage'],
          id: 'second-page',
          params: undefined,
          children: [
            {
              segments: ['5', 'hola'],
              id: '4',
              params: undefined,
              children: [
                { segments: ['path', 'to', 'five'], id: '5', children: [], params: undefined },
                { segments: ['path', 'to', 'five2'], id: '6', children: [], params: undefined },
              ],
            },
          ],
        },
      ];
      const routes = flattenRouterTree(entries);
      expect(routes).toEqual([
        [{ segments: [''], id: 'hola' }],
        [{ segments: ['one-page'], id: 'one-page' }],
        [
          { segments: ['secondpage'], id: 'second-page' },
          { segments: ['5', 'hola'], id: '4' },
          { segments: ['path', 'to', 'five'], id: '5' },
        ],
        [
          { segments: ['secondpage'], id: 'second-page' },
          { segments: ['5', 'hola'], id: '4' },
          { segments: ['path', 'to', 'five2'], id: '6' },
        ],
      ]);
    });
  });

  let win: Window;
  beforeEach(() => {
    win = mockWindow();
  });
});

export function mockRouteElement(win: Window, path: string, component: string) {
  const el = win.document.createElement('ion-route');
  el.setAttribute('url', path);
  (el as any).component = component;
  return el;
}

function mockRedirectElement(win: Window, from: string | undefined | null, to: string | undefined | null) {
  const el = win.document.createElement('ion-route-redirect');
  if (from != null) {
    el.setAttribute('from', from);
  }
  if (to != null) {
    el.setAttribute('to', to);
  }
  return el;
}
