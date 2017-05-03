
export interface Ionic {
  emit: EventEmit;
  listener: {
    enable: EventListenerEnable;
  };
  theme: IonicTheme;
  controllers: {
    gesture?: any;
  };
  dom: DomControllerApi;
  config: ConfigApi;
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
  (instance: any, eventName: string, enabled: boolean, listenOn?: string): void;
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


export interface IonicGlobal {
  staticDir?: string;
  components?: LoadComponents;
  loadComponents?: {(bundleId: string, modulesImporterFn: ModulesImporterFn, cmp0?: ComponentModeData, cmp1?: ComponentModeData, cmp2?: ComponentModeData): void};
  eventNameFn?: {(eventName: string): string};
  config?: Object;
  ConfigCtrl?: ConfigApi;
  DomCtrl?: DomControllerApi;
  NextTickCtrl?: NextTickApi;
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
   * component class name (Badge)
   */
  [1]: string;

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


export interface Props {
  [propName: string]: PropOptions;
}


export interface ListenDecorator {
  (eventName: string, opts?: ListenOpts): any;
}


export interface ComponentMetaListeners {
  [methodName: string]: ListenOpts;
}


export interface ListenOpts {
  eventName?: string;
  capture?: boolean;
  passive?: boolean;
  enabled?: boolean;
}


export interface WatchDecorator {
  (propName: string): any;
}


export interface WatchOpts {
  fn: string;
}


export interface Watchers {
  [propName: string]: WatchOpts;
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
  props?: Props;
  listeners?: ComponentMetaListeners;
  watchers?: Watchers;
  shadow?: boolean;
  obsAttrs?: string[];
  componentModule?: any;
  modes: {[modeName: string]: ComponentMode};
  priority?: 'high'|'low';
}


export interface ComponentMode {
  bundleId?: string;
  styles?: string;
  styleUrls?: string[];
  styleElm?: HTMLElement;
}


export interface Component {
  ionViewDidLoad?: {(): void};
  ionViewWillUnload?: {(): void};

  render?: {(): VNode};

  mode?: string;
  color?: string;

  $el?: ProxyElement;
  $meta?: ComponentMeta;
  $listeners?: ComponentActiveListeners;
  $root?: HTMLElement | ShadowRoot;
  $vnode?: VNode;

  [memberName: string]: any;
}


export interface ComponentActiveListeners {
  [eventName: string]: Function;
}


export interface BaseInputComponent extends Component {
  disabled: boolean;
  hasFocus: boolean;
  value: string;

  fireFocus: {(): void};
  fireBlur: {(): void};
}


export interface BooleanInputComponent extends BaseInputComponent {
  checked: boolean;
  toggle: {(ev: UIEvent): void};
}


export interface ComponentModule {
  new (): Component;
}


export interface ComponentRegistry {
  [tag: string]: ComponentMeta;
}


export interface ProxyElement extends HTMLElement {
  connectedCallback: {(): void};
  attributeChangedCallback: {(attrName: string, oldVal: string, newVal: string, namespace: string): void};
  disconnectedCallback: {(): void};

  $queued?: boolean;
  $instance?: Component;

  [memberName: string]: any;
}


export type Side = 'left' | 'right' | 'start' | 'end';


export interface RendererApi {
  (oldVnode: VNode | Element, vnode: VNode, manualSlotProjection?: boolean): VNode;
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


export interface VNodeData {
  props?: any;
  attrs?: any;
  class?: any;
  style?: any;
  dataset?: any;
  on?: any;
  attachData?: any;
  vkey?: Key;
  vns?: string; // for SVGs
  [key: string]: any; // for any other 3rd party module
}


export interface PlatformApi {
  registerComponent: (tag: string, data: any[]) => ComponentMeta;
  getComponentMeta: (tag: string) => ComponentMeta;
  loadComponent: (bundleId: string, priority: string, cb: Function) => void;
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
