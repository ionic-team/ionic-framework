
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
}


export interface EventEmit {
  (instance: any, eventName: string, data?: any): void;
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


export interface IonicGlobal {
  staticDir?: string;
  components?: LoadComponents;
  loadComponents?: {(bundleId: string): void};
  config?: Object;
  configCtrl?: ConfigApi;
  domCtrl?: DomControllerApi;
  nextTickCtrl?: NextTickApi;
  eventNamePrefix?: string;
}


export interface NextTickApi {
  nextTick: NextTick;
}


export interface NextTick {
  (cb: Function): void;
}


export interface DomRead {
  (cb: Function): void;
}


export interface DomWrite {
  (cb: Function): void;
}


export interface DomControllerApi {
  read: DomRead;
  write: DomWrite;
}


export interface RafCallback {
  (timeStamp?: number): void;
}


export interface RequestAnimationFrame {
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

  /**
   * import component function
   */
  [7]: ComponentModeImporterFn;
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


export interface ComponentModeImporterFn {
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
  (instance: any, cssClassName: string, vnodeData: VNodeData): VNodeData;
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
  hostCss?: string;
  componentModule?: any;
  modes: {[modeName: string]: ComponentMode};
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


export interface RendererApi {
  (oldVnode: VNode | Element, vnode: VNode): VNode;
}


export type Key = string | number;


export interface Hyperscript {
  (sel: any): VNode;
  (sel: Node, data: VNodeData): VNode;
  (sel: any, data: VNodeData): VNode;
  (sel: any, text: string): VNode;
  (sel: any, children: Array<any>): VNode;
  (sel: any, data: VNodeData, text: string): VNode;
  (sel: any, data: VNodeData, children: Array<any|string>): VNode;
  (sel: any, data: VNodeData, children: any): VNode;
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
  loadComponent: (bundleId: string, cb: Function) => void;
  nextTick: NextTick;
  domRead: DomRead;
  domWrite: DomWrite;

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
  $attachShadow: (elm: Element, cmpMode: ComponentMode, cmpModeId: string) => ShadowRoot;
}


export interface ServerInitConfig {
  staticDir: string;
  config?: Object;
}
