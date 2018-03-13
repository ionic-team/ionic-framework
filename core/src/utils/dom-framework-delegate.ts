
export interface FrameworkDelegate {
  attachViewToDom(container: any, component: any, propsOrDataObj?: any, cssClasses?: string[]): Promise<any>;
  removeViewFromDom(container: any, component: any): Promise<void>;
}
