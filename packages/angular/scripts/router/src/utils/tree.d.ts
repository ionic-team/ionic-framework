/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare class Tree<T> {
    constructor(root: TreeNode<T>);
    readonly root: T;
}
export declare class TreeNode<T> {
    value: T;
    children: TreeNode<T>[];
    constructor(value: T, children: TreeNode<T>[]);
    toString(): string;
}
export declare function nodeChildrenAsMap<T extends {
    outlet: string;
}>(node: TreeNode<T> | null): {
    [outlet: string]: TreeNode<T>;
};
