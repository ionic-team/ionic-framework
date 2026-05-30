export type NavigationHookCallback = () => NavigationHookResult | Promise<NavigationHookResult>;
export type NavigationHookResult = boolean | NavigationHookOptions;
export interface NavigationHookOptions {
  redirect: string;
}
