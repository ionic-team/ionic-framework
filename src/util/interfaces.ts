
export interface Ionic {
  emit: EventEmit;
  listener: {
    enable: EventListenerEnable;
    add: AddEventListenerApi;
  };
  theme: IonicTheme;
  controller?: IonicController;
  dom: DomControllerApi;
  config: ConfigApi;
  Animation?: Animation;
  isServer: boolean;
  isClient: boolean;
}


export interface IonicController {
  <LoadingController>(ctrlName: 'loading', opts: LoadingOptions): Promise<Loading>;
  <MenuController>(ctrlName: 'menu'): Promise<MenuController>;
  <ModalController>(ctrlName: 'modal', opts: ModalOptions): Promise<Modal>;
  (ctrlName: string, opts?: any): Promise<IonicControllerApi>;
}


export interface IonicControllerApi {
  load?: (opts?: any) => Promise<any>;
}


export interface IonicGlobal {
  staticDir?: string;
  components?: LoadComponentData[];
  defineComponents?: (coreVersion: number, bundleId: string, modulesImporterFn: ModulesImporterFn, cmp0?: ComponentModeData, cmp1?: ComponentModeData, cmp2?: ComponentModeData) => void;
  eventNameFn?: (eventName: string) => string;
  config?: Object;
  loadController?: (ctrlName: string, ctrl: any) => any;
  controllers?: {[ctrlName: string]: any};
  ConfigCtrl?: ConfigApi;
  DomCtrl?: DomControllerApi;
  QueueCtrl?: QueueApi;
  Animation?: any;
}


export interface Menu {
  setOpen(shouldOpen: boolean, animated?: boolean): Promise<boolean>;
  open(): Promise<boolean>;
  close(): Promise<boolean>;
  toggle(): Promise<boolean>;
  enable(shouldEnable: boolean): Menu;
  swipeEnable(shouldEnable: boolean): Menu;
  isAnimating: boolean;
  isOpen: boolean;
  isRightSide: boolean;
  enabled: boolean;
  side: string;
  id: string;
  maxEdgeStart: number;
  persistent: boolean;
  swipeEnabled: boolean;
  type: string;
  width(): number;
  getMenuElement(): HTMLElement;
  getContentElement(): HTMLElement;
  getBackdropElement(): HTMLElement;
}


export interface MenuType {
  ani: any;
  isOpening: boolean;
  setOpen(shouldOpen: boolean, animated: boolean, done: Function): void;
  setProgressStart(isOpen: boolean): void;
  setProgessStep(stepValue: number): void;
  setProgressEnd(shouldComplete: boolean, currentStepValue: number, velocity: number, done: Function): void;
  destroy(): void;
}


export interface MenuController {
  open(menuId?: string): Promise<boolean>;
  close(menuId?: string): Promise<boolean>;
  toggle(menuId?: string): Promise<boolean>;
  enable(shouldEnable: boolean, menuId?: string): void;
  swipeEnable(shouldEnable: boolean, menuId?: string): void;
  isOpen(menuId?: string): boolean;
  isEnabled(menuId?: string): boolean;
  get(menuId?: string): Menu;
  getOpen(): Menu;
  getMenus(): Menu[];
}


export interface Modal {
  component: string;
  componentProps?: any;
  id: string;
  style?: {
    zIndex: number;
  };
  showBackdrop: boolean;
  enableBackdropDismiss: boolean;
  enterAnimation: AnimationBuilder;
  exitAnimation: AnimationBuilder;
  cssClass: string;
  present: () => Promise<void>;
  dismiss: () => Promise<void>;
}


export interface ModalOptions {
  component: string;
  componentProps?: any;
  showBackdrop?: boolean;
  enableBackdropDismiss?: boolean;
  enterAnimation?: AnimationBuilder;
  exitAnimation?: AnimationBuilder;
  cssClass?: string;
}


export interface ModalEvent {
  detail: {
    modal: Modal;
  };
}


export interface Loading {
  id: string;
  style?: {
    zIndex: number;
  };
  showBackdrop: boolean;
  enterAnimation: AnimationBuilder;
  exitAnimation: AnimationBuilder;
  cssClass: string;
  present: () => Promise<void>;
  dismiss: () => Promise<void>;
}


export interface LoadingOptions {
  spinner?: string;
  content?: string;
  cssClass?: string;
  showBackdrop?: boolean;
  dismissOnPageChange?: boolean;
  duration?: number;
}


export interface LoadingEvent {
  detail: {
    loading: Loading;
  };
}


export interface AddEventListenerApi {
  (elm: HTMLElement|HTMLDocument|Window, eventName: string, cb: (ev?: any) => void, opts?: ListenOptions): Function;
}


export interface EventEmit {
  (instance: any, eventName: string, data?: CustomEventOptions): void;
}


export interface CustomEventOptions {
  bubbles?: boolean;
  cancelable?: boolean;
  composed?: boolean;
  detail?: any;
}


export interface EventListenerEnable {
  (instance: any, eventName: string, enabled: boolean, attachTo?: string): void;
}


export interface EventListenerCallback {
  (ev?: any): void;
}


export interface GestureDetail {
  type?: string;
  event?: UIEvent;
  startX?: number;
  startY?: number;
  startTimeStamp?: number;
  currentX?: number;
  currentY?: number;
  velocityX?: number;
  velocityY?: number;
  deltaX?: number;
  deltaY?: number;
  directionX?: 'left'|'right';
  directionY?: 'up'|'down';
  velocityDirectionX?: 'left'|'right';
  velocityDirectionY?: 'up'|'down';
  timeStamp?: number;
}


export interface GestureCallback {
  (detail?: GestureDetail): boolean|void;
}


export interface ScrollDetail extends GestureDetail {
  scrollTop?: number;
  scrollLeft?: number;
  scrollHeight?: number;
  scrollWidth?: number;
  contentHeight?: number;
  contentWidth?: number;
  contentTop?: number;
  contentBottom?: number;
  domWrite?: DomControllerCallback;
  contentElement?: HTMLElement;
  fixedElement?: HTMLElement;
  scrollElement?: HTMLElement;
  headerElement?: HTMLElement;
  footerElement?: HTMLElement;
}


export interface ScrollCallback {
  (detail?: ScrollDetail): boolean|void;
}


export interface ContentDimensions {
  contentHeight: number;
  contentTop: number;
  contentBottom: number;

  contentWidth: number;
  contentLeft: number;

  scrollHeight: number;
  scrollTop: number;

  scrollWidth: number;
  scrollLeft: number;
}


export interface QueueApi {
  add: (cb: Function, priority?: number) => void;
  flush: (cb?: Function) => void;
}


export interface DomControllerApi {
  read: DomControllerCallback;
  write: DomControllerCallback;
  raf: DomControllerCallback;
}

export interface RafCallback {
  (timeStamp?: number): void;
}


export interface DomControllerCallback {
  (cb: RafCallback): void;
}


export interface LoadComponentData {
  /**
   * tag name (ion-badge)
   */
  [0]: string;

  /**
   * map of the modes and bundle ids
   */
  [1]: {
    [modeCode: string]: string;
  };

  /**
   * props
   */
  [2]: any[];

  /**
   * bundle priority
   */
  [3]: LoadPriority;
}


export type LoadPriority = number;


export interface Bundle {
  id?: string;
  components?: BundleComponent[];
  bundledJsModules?: string;
  content?: string;
  fileName?: string;
  filePath?: string;
  priority?: number;
}


export interface BundleComponent {
  component: ManifestComponentMeta;
  modeName: string;
  modeMeta: ModeMeta;
}


export interface ManifestComponentMeta extends ComponentMeta {
  componentClass: string;
  componentUrl: string;
}


export interface ComponentModeData {
  /**
   * tag name (ion-badge)
   */
  [0]: string;

  /**
   * props
   */
  [1]: any[][];

  /**
   * methods
   */
  [2]: MethodMeta[];

  /**
   * states
   */
  [3]: StateMeta[];

  /**
   * listeners
   */
  [4]: ComponentListenersData[];

  /**
   * watchers
   */
  [5]: ComponentWatchersData[];

  /**
   * shadow
   */
  [6]: boolean;

  /**
   * host
   */
  [7]: any;

  /**
   * mode code, which is a number that'll
   * map to a mode name later (ios, md, wp)
   */
  [8]: number;


  /**
   * component mode styles
   */
  [9]: string;
}


export interface ComponentListenersData {
  /**
   * methodName
   */
  [0]: string;

  /**
   * eventName
   */
  [1]: string;

  /**
   * capture
   */
  [2]: number;

  /**
   * passive
   */
  [3]: number;

  /**
   * enabled
   */
  [4]: number;
}


export interface ComponentWatchersData {
  [methodName: string]: any;
}


export interface ModulesImporterFn {
  (importer: any, h: Function, Ionic: Ionic): void;
}


export interface ComponentDecorator {
  (opts?: ComponentOptions): any;
}


export interface ComponentOptions {
  tag: string;
  styleUrls?: string | string[] | ModeStyles;
  shadow?: boolean;
  host?: HostMeta;
}

export interface ModeStyles {
  [modeName: string]: string | string[];
}


export interface PropDecorator {
  (opts?: PropOptions): any;
}


export interface PropOptions {
  type?: number;
}


export interface PropMeta {
  propName?: string;
  propType?: any;
  attribName?: string;
  attribCase?: number;
}


export type MethodMeta = string;


export interface MethodDecorator {
  (opts?: MethodOptions): any;
}


export interface MethodOptions {}


export interface ListenDecorator {
  (eventName: string, opts?: ListenOptions): any;
}


export interface ListenOptions {
  eventName?: string;
  capture?: boolean;
  passive?: boolean;
  enabled?: boolean;
}


export interface ListenMeta extends ListenOptions {
  methodName?: string;
}


export interface StateDecorator {
  (): any;
}


export type StateMeta = string;


export interface WatchDecorator {
  (propName: string): any;
}


export interface WatchOpts {
  fn: string;
}


export interface WatchMeta extends WatchOpts {
  propName?: string;
}


export interface IonicTheme {
  (instance: any, cssClassName: string, vnodeData?: VNodeData): VNodeData;
}


export interface ConfigApi {
  get: (key: string, fallback?: any) => any;
  getBoolean: (key: string, fallback?: boolean) => boolean;
  getNumber: (key: string, fallback?: number) => number;
}


export interface ComponentMeta {
  // "Meta" suffix to ensure property renaming
  tagNameMeta?: string;
  methodsMeta?: MethodMeta[];
  propsMeta?: PropMeta[];
  listenersMeta?: ListenMeta[];
  watchersMeta?: WatchMeta[];
  statesMeta?: StateMeta[];
  modesMeta?: {[modeCode: string]: ModeMeta};
  isShadowMeta?: boolean;
  hostMeta?: HostMeta;
  hasSlotsMeta?: boolean;
  namedSlotsMeta?: string[];
  componentModuleMeta?: any;
  priorityMeta?: LoadPriority;
}


export interface ModeMeta {
  bundleId?: string;
  styles?: string;
  styleUrls?: string[];
}

export interface HostMeta {
  [key: string]: any;
}

export interface Component {
  ionViewWillLoad?: () => void;
  ionViewDidLoad?: () => void;
  ionViewWillUpdate?: () => void;
  ionViewDidUpdate?: () => void;
  ionViewDidUnload?: () => void;

  render?: () => VNode;
  hostData?: () => VNodeData;

  mode?: string;
  color?: string;

  // public properties
  $el?: HostElement;

  // private properties
  __values?: ComponentActiveValues;

  [memberName: string]: any;
}


export interface ComponentActiveListeners {
  [eventName: string]: Function;
}


export interface ComponentActiveWatchers {
  [propName: string]: Function;
}


export interface ComponentActiveValues {
  [propName: string]: any;
}


export interface BaseInputComponent extends Component {
  disabled: boolean;
  hasFocus: boolean;
  value: string;

  fireFocus: () => void;
  fireBlur: () => void;
}


export interface BooleanInputComponent extends BaseInputComponent {
  checked: boolean;
  toggle: (ev: UIEvent) => void;
}


export interface ComponentModule {
  new (): Component;
}


export interface ComponentRegistry {
  [tag: string]: ComponentMeta;
}


export interface HostElement extends HTMLElement {
  // web component APIs
  connectedCallback: () => void;
  attributeChangedCallback?: (attribName: string, oldVal: string, newVal: string, namespace: string) => void;
  disconnectedCallback?: () => void;

  // public properties
  $instance?: Component;

  // private methods
  _render: (isInitialRender: boolean) => void;
  _initLoad: () => void;
  _queueUpdate: () => void;

  // private properties
  _activelyLoadingChildren?: HostElement[];
  _ancestorHostElement?: HostElement;
  _hasConnected?: boolean;
  _hasDestroyed?: boolean;
  _hasLoaded?: boolean;
  _hostContentNodes?: HostContentNodes;
  _isQueuedForUpdate?: boolean;
  _listeners?: ComponentActiveListeners;
  _root?: HTMLElement | ShadowRoot;
  _vnode: VNode;
  _watchers?: ComponentActiveWatchers;
}


export interface RendererApi {
  (oldVnode: VNode | Element, vnode: VNode, hostContentNodes?: HostContentNodes, hydrating?: boolean): VNode;
}


export interface DomApi {
  $head: HTMLHeadElement;
  $body: HTMLElement;
  $isElement(node: any): boolean;
  $isText(node: any): boolean;
  $isComment(node: any): boolean;
  $createEvent(): CustomEvent;
  $createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
  $createElement(tagName: string): HTMLElement;
  $createElementNS(namespace: string, tagName: string): any;
  $createTextNode(text: string): Text;
  $createComment(text: string): Comment;
  $insertBefore(parentNode: Node, newNode: Node, referenceNode: Node): void;
  $removeChild(node: Node, child: Node): void;
  $appendChild(node: Node, child: Node): void;
  $parentNode(node: Node): Node;
  $nextSibling(node: Node): Node;
  $tagName(elm: any): string;
  $getTextContent(node: any): string;
  $setTextContent(node: Node, text: string): void;
  $getAttribute(elm: any, key: string): string;
  $setAttribute(elm: any, key: string, val: string): void;
  $setAttributeNS(elm: any, namespaceURI: string, qualifiedName: string, value: string): void;
  $removeAttribute(elm: any, key: string): void;
}

export type Key = string | number;


export interface Hyperscript {
  (sel: any): VNode;
  (sel: Node, data: VNodeData): VNode;
  (sel: any, data: VNodeData): VNode;
  (sel: any, text: string): VNode;
  (sel: any, children: Array<VNode | undefined | null>): VNode;
  (sel: any, data: VNodeData, text: string): VNode;
  (sel: any, data: VNodeData, children: Array<VNode | undefined | null>): VNode;
  (sel: any, data: VNodeData, children: VNode): VNode;
}


export interface VNode {
  sel?: string | undefined;
  vdata?: VNodeData | undefined;
  vchildren?: Array<VNode | string> | undefined;
  elm?: Node | undefined | HostElement;
  vtext?: string | undefined;
  vkey?: Key;
}


export interface HostContentNodes {
  defaultSlot?: Node[];
  namedSlots?: {[slotName: string]: Node[]};
}

export type CssClassObject = { [className: string]: boolean };

export interface VNodeData {
  props?: any;
  attrs?: any;
  class?: CssClassObject;
  style?: any;
  dataset?: any;
  on?: any;
  vkey?: Key;
  vns?: string; // for SVGs
  [key: string]: any; // for any other 3rd party module
}


export interface PlatformApi {
  registerComponents: (components?: LoadComponentData[]) => ComponentMeta[];
  defineComponent: (cmpMeta: ComponentMeta, HostElementConstructor?: any) => void;
  getComponentMeta: (elm: Element) => ComponentMeta;
  loadBundle: (bundleId: string, priority: LoadPriority, cb: Function) => void;
  render?: RendererApi;
  config: ConfigApi;
  collectHostContent: (elm: HostElement, validNamedSlots: string[]) => void;
  queue: QueueApi;
  css?: {[cmpModeId: string]: string};
  isServer?: boolean;
  attachStyles: (cmpMeta: ComponentMeta, elm: HostElement, instance: Component) => void;
  getMode: (elm: Element) => string;
  appRoot?: HostElement;
  hasAppLoaded?: boolean;
  appLoaded: () => void;
  tmpDisconnected?: boolean;
  onReady?: Promise<any>;
}

export interface PlatformConfig {
  name: string;
  isMatch?: {(url: string, userAgent: string): boolean};
  settings?: any;
}


export interface ServerInitConfig {
  staticDir: string;
  sys?: UniversalSys;
  config?: Object;
}

export interface HydrateConfig {
  req?: any;
  url?: string;
  referrer?: string;
  userAgent?: string;
  cookie?: string;
  config?: Object;
}


export interface UniversalSys {
  fs?: {
    readdirSync?(path: string | Buffer): string[];
    readFileSync?(filename: string, encoding: string): string;
    statSync?(path: string | Buffer): {
      isDirectory?(): boolean;
    }
  };
  path?: {
    join?: (...paths: string[]) => string;
  };
  isValidComponent?: (fileName: string) => boolean;
}


export interface Animation {
  new(elm?: Node|Node[]|NodeList): Animation;
  add: (childAnimation: Animation) => Animation;
  addElement: (elm: Node|Node[]|NodeList) => Animation;
  afterAddClass: (className: string) => Animation;
  afterClearStyles: (propertyNames: string[]) => Animation;
  afterRemoveClass: (className: string) => Animation;
  afterStyles: (styles: { [property: string]: any; }) => Animation;
  beforeAddClass: (className: string) => Animation;
  beforeClearStyles: (propertyNames: string[]) => Animation;
  beforeRemoveClass: (className: string) => Animation;
  beforeStyles: (styles: { [property: string]: any; }) => Animation;
  destroy: () => void;
  duration: (milliseconds: number) => Animation;
  getDuration(opts?: PlayOptions): number;
  easing: (name: string) => Animation;
  easingReverse: (name: string) => Animation;
  from: (prop: string, val: any) => Animation;
  fromTo: (prop: string, fromVal: any, toVal: any, clearProperyAfterTransition?: boolean) => Animation;
  hasCompleted: boolean;
  isPlaying: boolean;
  onFinish: (callback: (animation: Animation) => void, opts?: {oneTimeCallback?: boolean, clearExistingCallacks?: boolean}) => Animation;
  play: (opts?: PlayOptions) => void;
  syncPlay: () => void;
  progressEnd: (shouldComplete: boolean, currentStepValue: number, dur: number) => void;
  progressStep: (stepValue: number) => void;
  progressStart: () => void;
  reverse: (shouldReverse?: boolean) => Animation;
  stop: (stepValue?: number) => void;
  to: (prop: string, val: any, clearProperyAfterTransition?: boolean) => Animation;
}


export interface AnimationBuilder {
  (elm?: HTMLElement): Animation;
}


export interface AnimationOptions {
  animation?: string;
  duration?: number;
  easing?: string;
  direction?: string;
  isRTL?: boolean;
  ev?: any;
}


export interface PlayOptions {
  duration?: number;
  promise?: boolean;
}


export interface EffectProperty {
  effectName: string;
  trans: boolean;
  wc?: string;
  to?: EffectState;
  from?: EffectState;
  [state: string]: any;
}


export interface EffectState {
  val: any;
  num: number;
  effectUnit: string;
}


export interface RequestIdleCallback {
  (callback: IdleCallback, options?: { timeout?: number }): number;
}


export interface IdleCallback {
  (deadline: IdleDeadline, options?: IdleOptions): void;
}


export interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}


export interface IdleOptions {
  timeout?: number;
}


export interface BundleCallbacks {
  [bundleId: string]: Function[];
}
