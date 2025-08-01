// The interfaces in this file are used to make sure our components
// have the correct properties defined that are needed to pass to
// the native HTML elements they render. The HTMLStencilElement interface
// extends HTMLElement to provide Stencil-specific functionality like
// componentOnReady() and proper children handling.

export interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>;
  /**
   * Stencil patches `el.children` to behave like calling `el.children` on an
   * element with shadow DOM even though the component is not a shadow DOM element.
   * To allow components to work properly we need to access the original accessor
   * for this property which is `__children`.
   */
  __children?: HTMLCollection;
}

export interface AnchorInterface {
  href: string | undefined;
  target: string | undefined;
  rel: string | undefined;
  download: string | undefined;
}

export interface ButtonInterface {
  type: 'submit' | 'reset' | 'button';
  disabled: boolean;
}
