import {
  ComponentRef
} from '@angular/core';

import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ActivationEnd,
  ChildActivationEnd,
  ChildrenOutletContexts,
  Event,
  RouteReuseStrategy,
  RouterState,
} from '@angular/router';

import {
  TreeNode,
  advanceActivatedRoute,
  forEach,
  nodeChildrenAsMap
} from './router-utils';

export class AsyncActivateRoutes {
  constructor(
      protected routeReuseStrategy: RouteReuseStrategy, protected futureState: RouterState,
      protected currState: RouterState, protected forwardEvent: (evt: Event) => void) {}

  activate(parentContexts: ChildrenOutletContexts): void | Promise<void> {
    const futureRoot = (this.futureState as any)._root;
    const currRoot = this.currState ? (this.currState as any)._root : null;

    const result = this.deactivateChildRoutes(futureRoot, currRoot, parentContexts);
    return Promise.resolve(result)
      .then(
        () => {
          advanceActivatedRoute(this.futureState.root);
          return this.activateChildRoutes(futureRoot, currRoot, parentContexts);
        }
      );

  }

  // De-activate the child route that are not re-used for the future state
  protected deactivateChildRoutes(
      futureNode: TreeNode<ActivatedRoute>, currNode: TreeNode<ActivatedRoute>|null,
      contexts: ChildrenOutletContexts): Promise<any> {

    const children: {[outletName: string]: TreeNode<ActivatedRoute>} = nodeChildrenAsMap(currNode);

    const promises = futureNode.children.map((futureChild: TreeNode<ActivatedRoute>) => {
      const childOutletName = futureChild.value.outlet;
      const promise = this.deactivateRoutes(futureChild, children[childOutletName], contexts);
      promise
        .then(
          () => {
            delete children[childOutletName];
          }
        );
      return promise;
    });

    return Promise.all(promises)
      .then(
        () => {
          const promises: Promise<void>[] = [];
          // De-activate the routes that will not be re-used
          forEach(children, (v: TreeNode<ActivatedRoute>) => {
            promises.push(this.deactivateRouteAndItsChildren(v, contexts));
          });

          return Promise.all(promises);
        }
      );
  }

  protected deactivateRoutes(
      futureNode: TreeNode<ActivatedRoute>, currNode: TreeNode<ActivatedRoute>,
      parentContext: ChildrenOutletContexts): Promise<void> {
    const future = futureNode.value;
    const curr = currNode ? currNode.value : null;

    if (future === curr) {
      // Reusing the node, check to see if the children need to be de-activated
      if (future.component) {
        // If we have a normal route, we need to go through an outlet.
        const context = parentContext.getContext(future.outlet);
        if (context) {
          return this.deactivateChildRoutes(futureNode, currNode, context.children);
        }
        return Promise.resolve();
      } else {
        // if we have a componentless route, we recurse but keep the same outlet map.
        return this.deactivateChildRoutes(futureNode, currNode, parentContext);
      }
    } else {
      if (curr) {
        // Deactivate the current route which will not be re-used
        return this.deactivateRouteAndItsChildren(currNode, parentContext);
      }
      return Promise.resolve();
    }
  }

  protected deactivateRouteAndItsChildren(
      route: TreeNode<ActivatedRoute>, parentContexts: ChildrenOutletContexts): Promise<void> {
    if (this.routeReuseStrategy.shouldDetach(route.value.snapshot)) {
      return this.detachAndStoreRouteSubtree(route, parentContexts);
    } else {
      return this.deactivateRouteAndOutlet(route, parentContexts);
    }
  }

  protected detachAndStoreRouteSubtree(
      route: TreeNode<ActivatedRoute>, parentContexts: ChildrenOutletContexts): Promise<void> {
    const context = parentContexts.getContext(route.value.outlet);
    if (context && context.outlet) {
      const componentRefOrPromise = context.outlet.detach();
      return Promise.resolve(componentRefOrPromise)
        .then(
          (componentRef: ComponentRef<any>) => {
            const contexts = context.children.onOutletDeactivated();
            this.routeReuseStrategy.store(route.value.snapshot, {componentRef, route, contexts});
          }
        );
    }
    return Promise.resolve();
  }

  protected deactivateRouteAndOutlet(
      route: TreeNode<ActivatedRoute>, parentContexts: ChildrenOutletContexts): Promise<void> {
    const context = parentContexts.getContext(route.value.outlet);

    if (context) {
      const children: {[outletName: string]: any} = nodeChildrenAsMap(route);
      const contexts = route.value.component ? context.children : parentContexts;

      const promises: Promise<void>[] = [];
      forEach(children, (v: any) => {
        promises.push(this.deactivateRouteAndItsChildren(v, contexts));
      });

      return Promise.all(promises)
        .then(
          () => {
            if (context.outlet) {
              // Destroy the component
              const result = context.outlet.deactivate();
              return Promise.resolve(result);
            }
            return Promise.resolve();
          }
        )
        .then(
          () => {
            context.children.onOutletDeactivated();
          }
        );
    }

    return Promise.resolve();
  }

  protected activateChildRoutes(
      futureNode: TreeNode<ActivatedRoute>, currNode: TreeNode<ActivatedRoute>|null,
      contexts: ChildrenOutletContexts): Promise<void> {

    const children: {[outlet: string]: any} = nodeChildrenAsMap(currNode);


    const promises = futureNode.children.map((c: TreeNode<ActivatedRoute>) => {
      const promise = this.activateRoutes(c, children[c.value.outlet], contexts);
      promise
        .then(
          () => {
            this.forwardEvent(new ActivationEnd(c.value.snapshot));
          }
        );
      return promise;
    });

    return Promise.all(promises)
      .then(
        () => {
          if (futureNode.children.length) {
            this.forwardEvent(new ChildActivationEnd(futureNode.value.snapshot));
          }
        }
      );
  }

  protected activateRoutes(
      futureNode: TreeNode<ActivatedRoute>, currNode: TreeNode<ActivatedRoute>,
      parentContexts: ChildrenOutletContexts): Promise<void> {
    const future = futureNode.value;
    const curr = currNode ? currNode.value : null;

    advanceActivatedRoute(future);

    // reusing the node
    if (future === curr) {
      if (future.component) {
        // If we have a normal route, we need to go through an outlet.
        const context = parentContexts.getOrCreateContext(future.outlet);
        return this.activateChildRoutes(futureNode, currNode, context.children);
      } else {
        // if we have a componentless route, we recurse but keep the same outlet map.
        return this.activateChildRoutes(futureNode, currNode, parentContexts);
      }
    } else {
      if (future.component) {
        // if we have a normal route, we need to place the component into the outlet and recurse.
        const context = parentContexts.getOrCreateContext(future.outlet);

        if (this.routeReuseStrategy.shouldAttach(future.snapshot)) {
          const stored =
              (<any>this.routeReuseStrategy.retrieve(future.snapshot));
          this.routeReuseStrategy.store(future.snapshot, null);
          context.children.onOutletReAttached(stored.contexts);
          context.attachRef = stored.componentRef;
          context.route = stored.route.value;
          if (context.outlet) {
            // Attach right away when the outlet has already been instantiated
            // Otherwise attach from `RouterOutlet.ngOnInit` when it is instantiated
            const result = context.outlet.attach(stored.componentRef, stored.route.value);
            return Promise.resolve(result)
              .then(
                () => {
                  return this.advanceActivatedRouteNodeAndItsChildren(stored.route);
                }
              );
          }

          return Promise.resolve(this.advanceActivatedRouteNodeAndItsChildren(stored.route));

        } else {
          const config = this.parentLoadedConfig(future.snapshot);
          const cmpFactoryResolver = config ? config.module.componentFactoryResolver : null;

          context.route = future;
          context.resolver = cmpFactoryResolver;
          if (context.outlet) {
            // Activate the outlet when it has already been instantiated
            // Otherwise it will get activated from its `ngOnInit` when instantiated
            const result = context.outlet.activateWith(future, cmpFactoryResolver);
            return Promise.resolve(result)
              .then(
                () => {
                  return this.activateChildRoutes(futureNode, null, context.children);
                }
              );
          }

          return this.activateChildRoutes(futureNode, null, context.children);
        }
      } else {
        // if we have a componentless route, we recurse but keep the same outlet map.
        return this.activateChildRoutes(futureNode, null, parentContexts);
      }
    }
  }

  advanceActivatedRouteNodeAndItsChildren(node: TreeNode<ActivatedRoute>): void {
    advanceActivatedRoute(node.value);
    node.children.forEach(this.advanceActivatedRouteNodeAndItsChildren);
  }

  parentLoadedConfig(snapshot: ActivatedRouteSnapshot): any|null {
    for (let s = snapshot.parent; s; s = s.parent) {
      const route = s.routeConfig as any;
      if (route && route._loadedConfig) return route._loadedConfig;
      if (route && route.component) return null;
    }

    return null;
  }
}
