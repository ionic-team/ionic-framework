export function nodeChildrenAsMap<T extends{outlet: string}>(node: TreeNode<T>| null) {
  const map: {[outlet: string]: TreeNode<T>} = {};

  if (node) {
    node.children.forEach(child => map[child.value.outlet] = child);
  }

  return map;
}

export function forEach<K, V>(map: {[key: string]: V}, callback: (v: V, k: string) => void): void {
  for (const prop in map) {
    if (map.hasOwnProperty(prop)) {
      callback(map[prop], prop);
    }
  }
}

export class TreeNode<T> {
  constructor(public value: T, public children: TreeNode<T>[]) {}

  toString(): string { return `TreeNode(${this.value})`; }
}

/**
 * The expectation is that the activate route is created with the right set of parameters.
 * So we push new values into the observables only when they are not the initial values.
 * And we detect that by checking if the snapshot field is set.
 */
export function advanceActivatedRoute(route: any): void {
  if (route.snapshot) {
    const currentSnapshot = route.snapshot;
    const nextSnapshot = (route as any)._futureSnapshot;
    route.snapshot = nextSnapshot;
    if (!shallowEqual(currentSnapshot.queryParams, nextSnapshot.queryParams)) {
      (<any>route.queryParams).next(nextSnapshot.queryParams);
    }
    if (currentSnapshot.fragment !== nextSnapshot.fragment) {
      (<any>route.fragment).next(nextSnapshot.fragment);
    }
    if (!shallowEqual(currentSnapshot.params, nextSnapshot.params)) {
      (<any>route.params).next(nextSnapshot.params);
    }
    if (!shallowEqualArrays(currentSnapshot.url, nextSnapshot.url)) {
      (<any>route.url).next(nextSnapshot.url);
    }
    if (!shallowEqual(currentSnapshot.data, nextSnapshot.data)) {
      (<any>route.data).next(nextSnapshot.data);
    }
  } else {
    route.snapshot = (route as any)._futureSnapshot;

    // this is for resolved data
    (<any>route.data).next((route as any)._futureSnapshot.data);
  }
}

export function shallowEqualArrays(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; ++i) {
    if (!shallowEqual(a[i], b[i])) return false;
  }
  return true;
}

export function shallowEqual(a: {[x: string]: any}, b: {[x: string]: any}): boolean {
  const k1 = Object.keys(a);
  const k2 = Object.keys(b);
  if (k1.length != k2.length) {
    return false;
  }
  let key: string;
  for (let i = 0; i < k1.length; i++) {
    key = k1[i];
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

export function flatten<T>(arr: T[][]): T[] {
  return Array.prototype.concat.apply([], arr);
}