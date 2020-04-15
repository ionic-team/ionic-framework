// import React, { ReactElement } from 'react';

// import { DefaultIonLifeCycleContext } from '../contexts/IonLifeCycleContext';
// import { RouteInfo } from '../models/RouteInfo';
// // import { generateId } from '../utils/generateId';

// import { RouteManagerContext } from './RouteManagerContext';
// import { ViewItem } from './ViewItem';
// // import { ViewLifeCycleManager } from './ViewLifeCycleManager';

// export interface StackContextState {
//   registerIonPage: (page: HTMLElement, routeInfo: RouteInfo) => void;
// }

// export const StackContext = React.createContext<StackContextState>({
//   registerIonPage: () => undefined
// });

// interface StackManagerProps { }

// interface StackManagerState {
//   routeInfo?: RouteInfo;
// }

// export class StackManager extends React.Component<StackManagerProps, StackManagerState> {
//   ionLifeCycleContext = new DefaultIonLifeCycleContext();
//   context!: React.ContextType<typeof RouteManagerContext>;
//   pages: Map<string, ViewItem> = new Map();
//   leavingElement: HTMLElement | undefined;
//   ionRouterOutlet?: React.ReactElement;
//   routerOutletElement: HTMLIonRouterOutletElement | undefined;
//   pendingTransitions: RouteInfo[] = [];
//   isIonPageContainer = false;

//   constructor(props: StackManagerProps) {
//     super(props);
//     this.handlePageTransition = this.handlePageTransition.bind(this);
//     // this.setupFirstPage = this.setupFirstPage.bind(this);
//     this.registerIonPage = this.registerIonPage.bind(this);
//     this.transitionPage = this.transitionPage.bind(this);

//     this.state = {};

//     this.ionRouterOutlet = React.Children.only(this.props.children) as React.ReactElement;

//     // React.Children.forEach(this.ionRouterOutlet.props.children, child => {
//     //   const id = generateId();
//     //   const viewItem = {
//     //     id,
//     //     reactElement: React.cloneElement(child as any, { key: id }),
//     //     mount: true
//     //   };
//     //   this.pages.set(id, viewItem);
//     // });
//   }

//   componentDidMount() {
//     if (this.routerOutletElement) {
//       this.context.onRouteChange(this.handlePageTransition);
//       // this.setupFirstPage();
//     }
//   }

//   componentWillUnmount() {
//     // Todo: unregister events from nav context
//   }

//   shouldComponentUpdate(_nextProps: StackManagerProps, nextState: StackManagerState) {
//     if (nextState.routeInfo !== this.state.routeInfo) {
//       return true;
//     }
//     return false;
//   }

//   async handlePageTransition(routeInfo: RouteInfo) {
//     // If routerOutlet isn't quite ready, give it another try in a moment
//     if (!this.routerOutletElement || !this.routerOutletElement.commit) {
//       setTimeout(() => this.handlePageTransition(routeInfo), 10);
//     } else {
//       // const { currentRoute } = routeInfo;
//       // if (!this.pages.has(currentRoute)) {
//       //   this.pages.set(currentRoute, {
//       //     id: currentRoute,
//       //     // reactElement: ionRouterOutlet.props.children,
//       //     mount: true
//       //   });
//       // }
//       this.setState({
//         routeInfo
//       }, () => {
//         // this.forceUpdate();
//         this.transitionPage(routeInfo);
//       });
//     }
//   }

//   // async setupFirstPage() {
//   //   const { routeInfo } = this.state;
//   //   if (routeInfo) {
//   //     const enteringViewItem = this.pages.get(routeInfo.currentRoute);
//   //     if (enteringViewItem && enteringViewItem.ionPageElement && this.routerOutlet) {
//   //       if (!this.routerOutlet.commit) {
//   //         setTimeout(() => this.setupFirstPage(), 10);
//   //       } else {
//   //         await this.routerOutlet.commit(enteringViewItem.ionPageElement, undefined, {
//   //           deepWait: true,
//   //           duration: undefined,
//   //           direction: undefined,
//   //           showGoBack: false,
//   //           progressAnimation: false
//   //         });
//   //       }
//   //     }
//   //   }
//   // }

//   registerIonPage(page: HTMLElement, routeInfo: RouteInfo) {
//     // this.isIonPageContainer = true;
//     const matchedNode = this.context.matchComponent(this.ionRouterOutlet!.props.children, routeInfo) as React.ReactElement;
//     // const nodes = Array.from(this.pages.values()).map(p => p.reactElement);
//     // const matchedNode = this.context.matchComponent(nodes, routeInfo) as React.ReactElement;
//     // const key = matchedNode.key?.toString()!;
//     const key = routeInfo.currentRoute;
//     if (matchedNode) {
//       if (this.pages.has(key)) {
//         this.pages.get(key)!.ionPageElement = page;
//         this.pages.get(key)!.reactElement = matchedNode as any;
//       } else {
//         const viewItem = this.context.createViewItem(page, matchedNode);
//         this.pages.set(key, viewItem);
//       }
//       if (this.pendingTransitions.length > 0) {
//         const pendingRouteInfo = this.pendingTransitions.find(x => x.currentRoute === routeInfo.currentRoute);
//         if (pendingRouteInfo) {
//           this.transitionPage(pendingRouteInfo);
//           this.pendingTransitions = [];
//         }
//       }
//     }
//   }

//   renderChildren(ionRouterOutlet: ReactElement) {

//     const children: React.ReactNode[] = [];
//     const views = Array.from(this.pages.values());

//     React.Children.forEach(ionRouterOutlet!.props.children, child => {
//       const foundView = views.find(x => x.reactElement === child);
//       if (foundView) {
//         children.push(foundView.reactElement);
//       } else {
//         children.push(child);
//       }
//     });

//     // const viewItems = Array.from(this.pages.values()).filter(v => v.mount && v.reactElement);
//     const component = React.cloneElement(ionRouterOutlet as any, {
//       ref: (node: HTMLIonRouterOutletElement) => {
//         this.routerOutletElement = node;
//         const { ref } = ionRouterOutlet as any;
//         if (typeof ref === 'function') {
//           ref(node);
//         }
//       }
//     },
//       children
//       // viewItems.map(v => {
//       //   return (
//       //     // <ViewLifeCycleManager key={v.id}>
//       //     React.cloneElement(v.reactElement!, {
//       //       key: v.id
//       //     })
//       //     // </ViewLifeCycleManager>
//       //   );
//       // }
//       // )
//     );
//     return component;
//   }

//   // Original
//   // renderChildren(ionRouterOutlet: ReactNode) {
//   //   const viewItems = Array.from(this.pages.values()).filter(v => v.mount);
//   //   const component = React.cloneElement(ionRouterOutlet as any, {
//   //     ref: (node: HTMLIonRouterOutletElement) => {
//   //       this.routerOutlet = node;
//   //       const { ref } = ionRouterOutlet as any;
//   //       if (typeof ref === 'function') {
//   //         ref(node);
//   //       }
//   //     }
//   //   },
//   //     viewItems.map(v => {
//   //       return (
//   //         <ViewLifeCycleManager key={v.id}>
//   //           {v.reactElement}
//   //         </ViewLifeCycleManager>
//   //       );
//   //     }
//   //     )
//   //   );
//   //   return component;
//   // }

//   async transitionPage(routeInfo: RouteInfo) {
//     // const { router } = this.context;
//     const enteringViewItem = this.pages.get(routeInfo.currentRoute);
//     const leavingViewItem = this.pages.get(routeInfo.lastRoute!);

//     if (!enteringViewItem || !enteringViewItem.ionPageElement) {
//       this.pendingTransitions.push(routeInfo);
//     }

//     if (routeInfo.routeAction === 'push' && routeInfo.routeDirection === 'forward') {
//       // enteringViewItem.prevId = leavingViewItem.id;
//     } else {
//       const shouldLeavingViewBeRemoved = routeInfo.routeDirection !== 'none' && leavingViewItem && (enteringViewItem !== leavingViewItem);
//       if (shouldLeavingViewBeRemoved) {
//         this.pages.delete(routeInfo.lastRoute!);
//         // routeInfo.lastPathname = undefined;
//       }

//     }

//     const direction = (routeInfo.routeDirection === 'none' || routeInfo.routeDirection === 'root')
//       ? undefined
//       : routeInfo.routeDirection;

//     if (enteringViewItem && enteringViewItem.ionPageElement && this.routerOutletElement) {
//       if (leavingViewItem && leavingViewItem.ionPageElement && (enteringViewItem === leavingViewItem)) {
//         // If a page is transitioning to another version of itself
//         // we clone it so we can have an animation to show
//         const newLeavingElement = clonePageElement(leavingViewItem.ionPageElement.outerHTML);
//         if (newLeavingElement) {
//           this.routerOutletElement.appendChild(newLeavingElement);
//           await this.routerOutletElement.commit(enteringViewItem.ionPageElement, newLeavingElement, {
//             deepWait: true,
//             // duration: 1500,
//             duration: direction === undefined ? 0 : undefined,
//             direction: direction as any,
//             showGoBack: direction === 'forward',
//             progressAnimation: false
//           });
//           this.routerOutletElement.removeChild(newLeavingElement);
//         }
//       } else {
//         await this.routerOutletElement.commit(enteringViewItem.ionPageElement, leavingViewItem?.ionPageElement, {
//           deepWait: true,
//           // duration: 1500,
//           duration: direction === undefined ? 0 : undefined,
//           direction: direction as any,
//           showGoBack: direction === 'forward',
//           progressAnimation: false
//         });
//         if (leavingViewItem && leavingViewItem.ionPageElement) {
//           leavingViewItem.ionPageElement.classList.add('ion-page-hidden');
//           leavingViewItem.ionPageElement.setAttribute('aria-hidden', 'true');
//         }
//       }
//     }

//     // this.forceUpdate();
//   }

//   render() {
//     // console.log(this.context);
//     const { children } = this.props;
//     // const { routeInfo } = this.state;
//     // const currentRoute = routeInfo?.currentRoute || '';
//     const ionRouterOutlet = React.Children.only(children) as React.ReactElement;
//     this.ionRouterOutlet = ionRouterOutlet;

//     let components: any;
//     // if (this.isIonPageContainer) {
//     // if (!this.pages.has(currentRoute)) {
//     //   this.pages.set(currentRoute, {
//     //     id: currentRoute,
//     //     mount: true
//     //   });
//     // }
//     components = this.renderChildren(ionRouterOutlet);
//     // } else {
//     // components = React.cloneElement(ionRouterOutlet, {
//     //   ref: (node: HTMLIonRouterOutletElement) => {
//     //     this.routerOutletElement = node;
//     //     const { ref } = ionRouterOutlet as any;
//     //     if (typeof ref === 'function') {
//     //       ref(node);
//     //     }
//     //   }
//     // });
//     // });

//     // const { children } = this.props;
//     // const ionRouterOutlet = React.Children.only(children) as React.ReactElement;
//     // const clonedRouterOutlet = React.cloneElement(ionRouterOutlet, {
//     //   ref: (node: HTMLIonRouterOutletElement) => {
//     //     this.routerOutlet = node;
//     //     const { ref } = ionRouterOutlet as any;
//     //     if (typeof ref === 'function') {
//     //       ref(node);
//     //     }
//     //   }
//     // });

//     return (
//       <StackContext.Provider value={{ registerIonPage: this.registerIonPage }}>
//         {components}
//       </StackContext.Provider>
//     );
//   }

//   // render() {
//   //   const { children } = this.props;
//   //   const ionRouterOutlet = React.Children.only(children) as React.ReactElement;
//   //   // if (ionRouterOutlet.props.ionPageContainer) {
//   //   // if (!this.pages.has(this.context.routerInfo.currentRoute)) {
//   //   //   this.pages.set(this.context.routerInfo.currentRoute, {
//   //   //     id: this.context.routerInfo.currentRoute,
//   //   //     reactElement: ionRouterOutlet.props.children,
//   //   //     mount: true
//   //   //   });
//   //   // }
//   //   const routerOutletChildren = React.Children.toArray(ionRouterOutlet.props.children);
//   //   const viewItems = Array.from(this.pages.values()).filter(v => v.mount);
//   //   const pageChildren = viewItems.map(v => {
//   //     return (
//   //       <ViewLifeCycleManager key={v.id}>
//   //         {v.reactElement}
//   //       </ViewLifeCycleManager>
//   //     );
//   //   }
//   //   );
//   //   const childrenToRender = [...routerOutletChildren, ...pageChildren];
//   //   return (
//   //     <StackContext.Provider value={{ registerIonPage: this.registerIonPage }}>
//   //       {/* {this.renderChildren(ionRouterOutlet)} */}
//   //       {
//   //         React.cloneElement(ionRouterOutlet, {
//   //           ref: (node: HTMLIonRouterOutletElement) => {
//   //             this.routerOutlet = node;
//   //             const { ref } = ionRouterOutlet as any;
//   //             if (typeof ref === 'function') {
//   //               ref(node);
//   //             }
//   //           }
//   //         }, childrenToRender)

//   //       }
//   //     </StackContext.Provider>
//   //   );
//   //   // } else {
//   //   //   return React.cloneElement(ionRouterOutlet, {
//   //   //     ref: (node: HTMLIonRouterOutletElement) => {
//   //   //       this.routerOutlet = node;
//   //   //       const { ref } = ionRouterOutlet as any;
//   //   //       if (typeof ref === 'function') {
//   //   //         ref(node);
//   //   //       }
//   //   //     }
//   //   //   });
//   //   // }
//   // }

//   // Original
//   // render() {
//   //   const { children } = this.props;
//   //   const ionRouterOutlet = React.Children.only(children) as React.ReactElement;
//   //   if (ionRouterOutlet.props.ionPageContainer) {
//   //     if (!this.pages.has(this.context.routerInfo.currentRoute)) {
//   //       this.pages.set(this.context.routerInfo.currentRoute, {
//   //         id: this.context.routerInfo.currentRoute,
//   //         reactElement: React.Children.only(ionRouterOutlet.props.children),
//   //         mount: true
//   //       });
//   //     }
//   //     return (
//   //       <StackContext.Provider value={{ registerIonPage: this.registerIonPage }}>
//   //         {this.renderChildren(ionRouterOutlet)}
//   //       </StackContext.Provider>
//   //     );
//   //   } else {
//   //     return React.cloneElement(ionRouterOutlet, {
//   //       ref: (node: HTMLIonRouterOutletElement) => {
//   //         this.routerOutlet = node;
//   //         const { ref } = ionRouterOutlet as any;
//   //         if (typeof ref === 'function') {
//   //           ref(node);
//   //         }
//   //       }
//   //     });
//   //   }
//   // }

//   static get contextType() {
//     return RouteManagerContext;
//   }
// }
// export default StackManager;

// function clonePageElement(leavingViewHtml: string) {
//   if (document) {
//     const newEl = document.createElement('div');
//     newEl.innerHTML = leavingViewHtml;
//     newEl.style.zIndex = '';
//     // Remove an existing back button so the new element doesn't get two of them
//     const ionBackButton = newEl.getElementsByTagName('ion-back-button');
//     if (ionBackButton[0]) {
//       ionBackButton[0].innerHTML = '';
//     }
//     return newEl.firstChild as HTMLElement;
//   }
//   return undefined;
// }
