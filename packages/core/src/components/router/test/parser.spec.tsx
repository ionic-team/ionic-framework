import { mockElement } from '@stencil/core/testing';
import { flattenRouterTree, readRoutes } from '../utils/parser';
import { RouteTree } from '../utils/interfaces';

describe('readRoutes', () => {
  it('should read URL', () => {
    const root = mockElement('div');
    const r1 = mockRouteElement('/', 'main-page');
    const r2 = mockRouteElement('/one-page', 'one-page');
    const r3 = mockRouteElement('secondpage', 'second-page');
    const r4 = mockRouteElement('/5/hola', '4');
    const r5 = mockRouteElement('/path/to/five', '5');
    const r6 = mockRouteElement('/path/to/five2', '6');

    root.appendChild(r1);
    root.appendChild(r2);
    root.appendChild(r3);
    r3.appendChild(r4);
    r4.appendChild(r5);
    r4.appendChild(r6);

    const expected: RouteTree = [
      { path: [''], id: 'main-page', children: [], props: undefined },
      { path: ['one-page'], id: 'one-page', children: [], props: undefined },
      { path: ['secondpage'], id: 'second-page', props: undefined, children: [
        { path: ['5', 'hola'], id: '4', props: undefined, children: [
          { path: ['path', 'to', 'five'], id: '5', children: [], props: undefined },
          { path: ['path', 'to', 'five2'], id: '6', children: [], props: undefined }
        ] }
      ] }
    ];
    expect(readRoutes(root)).toEqual(expected);
  });
});

describe('flattenRouterTree', () => {
  it('should process routes', () => {
    const entries: RouteTree = [
      { path: [''], id: 'hola', children: [], props: undefined },
      { path: ['one-page'], id: 'one-page', children: [], props: undefined },
      { path: ['secondpage'], id: 'second-page', props: undefined, children: [
        { path: ['5', 'hola'], id: '4', props: undefined, children: [
          { path: ['path', 'to', 'five'], id: '5', children: [], props: undefined },
          { path: ['path', 'to', 'five2'], id: '6', children: [], props: undefined }
        ] }
      ] }
    ];
    const routes = flattenRouterTree(entries);
    expect(routes).toEqual([
      [{ path: [''], id: 'hola' }],
      [{ path: ['one-page'], id: 'one-page' }],
      [{ path: ['secondpage'], id: 'second-page'}, { path: ['5', 'hola'], id: '4'}, { path: ['path', 'to', 'five'], id: '5'}],
      [{ path: ['secondpage'], id: 'second-page'}, { path: ['5', 'hola'], id: '4'}, { path: ['path', 'to', 'five2'], id: '6'}],
    ]);
  });
});




export function mockRouteElement(path: string, component: string) {
  const el = mockElement('ion-route');
  el.setAttribute('path', path);
  (el as any).component = component;
  return el;
}
