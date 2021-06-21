export interface RouterOptions {
  /**
   * Optional - Used for routing frameworks that need an 'as' parameter for routing.
   */
  as?: string;
  /**
   * Optional - If the component should be unmounted after it is transitioned away from. Defaults to false.
   */
  unmount?: boolean;
}
