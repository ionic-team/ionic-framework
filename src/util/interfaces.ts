
export interface Ionic {
  emit: EventEmit;
  listener: {
    enable: EventListenerEnable;
    add: AddEventListenerApi;
  };
  theme: IonicTheme;
  controllers: {
    gesture?: any;
  };
  dom: DomControllerApi;
  config: ConfigApi;
  modal: ModalControllerApi;
  Animation: Animation;
}


export interface IonicGlobal {
  staticDir?: string;
  components?: LoadComponents;
  loadComponents?: (coreVersion: number, bundleId: string, modulesImporterFn: ModulesImporterFn, cmp0?: ComponentModeData, cmp1?: ComponentModeData, cmp2?: ComponentModeData) => void;
  eventNameFn?: (eventName: string) => string;
  config?: Object;
  ConfigCtrl?: ConfigApi;
  DomCtrl?: DomControllerApi;
  NextTickCtrl?: NextTickApi;
  Animation: any;
}


export interface ModalControllerApi {
  create: (component: string, params?: any, opts?: ModalOptions) => Promise<Modal>;
}


export interface ModalControllerInternalApi extends ModalControllerApi {
  _create?: any[];
}


export interface Modal {
  component: string;
  id: string;
  style?: {
    zIndex: number;
  };
  showBackdrop: boolean;
  enableBackdropDismiss: boolean;
  enterAnimation: AnimationBuilder;
  exitAnimation: AnimationBuilder;
  cssClass: string;
  params: any;
  present: (done?: Function) => void;
  dismiss: (done?: Function) => void;
}


export interface ModalOptions {
  showBackdrop?: boolean;
  enableBackdropDismiss?: boolean;
  enterAnimation?: AnimationBuilder;
  exitAnimation?: AnimationBuilder;
  cssClass?: string;
}


export interface ModalEvent extends Event {
  detail: {
    modal: Modal;
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


export interface NextTickApi {
  nextTick: NextTick;
}


export interface NextTick {
  (cb: Function): void;
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


export interface LoadComponents {
  [tag: string]: any[];
}


export interface ComponentModeData {
  /**
   * tag name (ion-badge)
   */
  [0]: string;

  /**
   * methods
   */
  [1]: Methods;

  /**
   * listeners
   */
  [2]: ComponentListenersData[];

  /**
   * watchers
   */
  [3]: ComponentWatchersData[];

  /**
   * shadow
   */
  [4]: boolean;

  /**
   * mode name (ios, md, wp)
   */
  [5]: string;

  /**
   * component mode styles
   */
  [6]: string;
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
  (importer: any, h: Hyperscript, Ionic: Ionic): void;
}


export interface ComponentDecorator {
  (opts?: ComponentOptions): any;
}


export interface ComponentOptions {
  tag: string;
  styleUrls?: string[] | ModeStyles;
  shadow?: boolean;
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
}


export type Methods = string[];


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
  tag?: string;
  methods?: Methods;
  props?: PropMeta[];
  listeners?: ListenMeta[];
  watchers?: WatchMeta[];
  modes: ModeMeta[];
  shadow?: boolean;
  namedSlots?: string[];
  obsAttrs?: string[];
  componentModule?: any;
  priority?: 'high'|'low';
}


export interface ModeMeta {
  modeName?: string;
  bundleId?: string;
  styles?: string;
  styleUrls?: string[];
  styleElm?: HTMLElement;
}


export interface Component {
  ionViewDidLoad?: () => void;
  ionViewWillUnload?: () => void;

  render?: () => VNode;

  mode?: string;
  color?: string;

  $el?: ProxyElement;
  $meta?: ComponentMeta;
  $listeners?: ComponentActiveListeners;
  $watchers?: ComponentActiveWatchers;
  $root?: HTMLElement | ShadowRoot;
  $vnode?: VNode;
  $values?: ComponentActiveValues;

  [memberName: string]: any;
}


export interface ComponentActiveListeners {
  [eventName: string]: Function;
}


export type ComponentActiveWatchers = Function[];


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


export interface ProxyElement extends HTMLElement {
  connectedCallback: () => void;
  attributeChangedCallback: (attrName: string, oldVal: string, newVal: string, namespace: string) => void;
  disconnectedCallback: () => void;
  $queueUpdate: () => void;

  $queued?: boolean;
  $instance?: Component;
  $hostContent?: HostContentNodes;
  $tmpDisconnected?: boolean;

  [memberName: string]: any;
}


export type QueueHandlerId = number;


export type Side = 'left' | 'right' | 'start' | 'end';


export interface RendererApi {
  (oldVnode: VNode | Element, vnode: VNode, hostContentNodes?: HostContentNodes): VNode;
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
  sel: string | undefined;
  vdata: VNodeData | undefined;
  vchildren: Array<VNode | string> | undefined;
  elm: Node | undefined;
  vtext: string | undefined;
  vkey: Key;
}


export interface HostContentNodes {
  $defaultSlot: Node[];
  $namedSlots?: {[slotName: string]: Node[]};
}


export interface VNodeData {
  props?: any;
  attrs?: any;
  class?: any;
  style?: any;
  dataset?: any;
  on?: any;
  ref?: (elm: any) => void;
  vkey?: Key;
  vns?: string; // for SVGs
  [key: string]: any; // for any other 3rd party module
}


export interface PlatformApi {
  registerComponent: (tag: string, data: any[]) => ComponentMeta;
  getComponentMeta: (tag: string) => ComponentMeta;
  loadBundle: (bundleId: string, priority: string, cb: Function) => void;
  nextTick: NextTick;

  isElement: (node: Node) => node is Element;
  isText: (node: Node) => node is Text;
  isComment: (node: Node) => node is Comment;

  $createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
  $createElementNS: (namespaceURI: string, qualifiedName: string) => Element;
  $createTextNode: (text: string) => Text;
  $createComment: (text: string) => Comment;
  $insertBefore: (parentNode: Node, newNode: Node, referenceNode: Node | null) => void;
  $removeChild: (parentNode: Node, childNode: Node) => void;
  $appendChild: (parentNode: Node, childNode: Node) => void;
  $parentNode: (node: Node) => Node;
  $nextSibling: (node: Node) => Node;
  $tagName: (elm: Element) => string;
  $setTextContent: (node: Node, text: string | null) => void;
  $getTextContent: (node: Node) => string | null;
  $getAttribute: (elm: Element, attrName: string) => string;
  $attachComponent: (elm: Element, cmpMeta: ComponentMeta, instance: Component) => void;
}


export interface PlatformConfig {
  name: string;
  isMatch?: {(url: string, userAgent: string): boolean};
  settings?: any;
}


export interface ServerInitConfig {
  staticDir: string;
  config?: Object;
}


export interface Animation {
  new(elm?: Node|Node[]|NodeList): Animation;
  addChildAnimation: (childAnimation: Animation) => Animation;
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
  easing: (name: string) => Animation;
  from: (prop: string, val: any) => Animation;
  fromTo: (prop: string, fromVal: any, toVal: any, clearProperyAfterTransition?: boolean) => Animation;
  hasCompleted: boolean;
  isPlaying: boolean;
  onFinish: (callback: (animation?: Animation) => void, opts?: {oneTimeCallback: boolean, clearExistingCallacks: boolean}) => Animation;
  play: (opts?: PlayOptions) => void;
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
  (callback: IdleCallback): number;
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
