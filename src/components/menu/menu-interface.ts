
export interface Menu {
  setOpen(shouldOpen: boolean, animated: boolean): Promise<boolean>;
  open(): Promise<boolean>;
  close(): Promise<boolean>;
  toggle(): Promise<boolean>;
  enable(shouldEnable: boolean, menuId?: string): Menu;
  swipeEnable(shouldEnable: boolean): Menu;
  isOpen: boolean;
  enabled: boolean;
  side: string;
  id: string;
  isAnimating(): boolean;
  width(): number;
  getContentElement(): HTMLElement;
  getMenuElement(): HTMLElement;
  getBackdropElement(): HTMLElement;
  _canOpen(): boolean;
  persistent: boolean;
};
