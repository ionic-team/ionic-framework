import { RouterSegments, breadthFirstSearch } from '../utils/common';

describe('RouterSegments', () => {
  it ('should initialize with empty array', () => {
    const s = new RouterSegments([]);
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('');
  });

  it ('should initialize with array', () => {
    const s = new RouterSegments(['', 'path', 'to', 'destination']);
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('path');
    expect(s.next()).toEqual('to');
    expect(s.next()).toEqual('destination');
    expect(s.next()).toEqual('');
    expect(s.next()).toEqual('');
  });
});

describe('breadthFirstSearch', () => {
  it('should search in order', () => {
    const n1 = { tagName: 'ION-TABS', children: [] as any };
    const n2 = { tagName: 'DIV', children: [n1] };
    const n3 = { tagName: 'ION-NAV', children: [n2] };
    const n4 = { tagName: 'ION-TABS', children: [] as any };
    const n5 = { tagName: 'DIV', children: [n4] };
    const n6 = { tagName: 'DIV', children: [n5, n3] };
    const n7 = { tagName: 'DIV', children: [] as any };
    const n8 = { tagName: 'DIV', children: [n6] };
    const n9 = { tagName: 'DIV', children: [n8, n7] };

    expect(breadthFirstSearch(n9 as any)).toBe(n3);
    expect(breadthFirstSearch(n8 as any)).toBe(n3);
    expect(breadthFirstSearch(n7 as any)).toBe(null);
    expect(breadthFirstSearch(n6 as any)).toBe(n3);
    expect(breadthFirstSearch(n5 as any)).toBe(n4);
    expect(breadthFirstSearch(n4 as any)).toBe(n4);
    expect(breadthFirstSearch(n3 as any)).toBe(n3);
    expect(breadthFirstSearch(n2 as any)).toBe(n1);
    expect(breadthFirstSearch(n1 as any)).toBe(n1);
  });
});

