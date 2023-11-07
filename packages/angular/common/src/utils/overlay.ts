// TODO(FW-2827): types

interface ControllerShape<Opts, HTMLElm> {
  create(options: Opts): Promise<HTMLElm>;
  dismiss(data?: any, role?: string, id?: string): Promise<boolean>;
  getTop(): Promise<HTMLElm | undefined>;
}

export class OverlayBaseController<Opts, Overlay> implements ControllerShape<Opts, Overlay> {
  constructor(private ctrl: ControllerShape<Opts, Overlay>) {}

  /**
   * Creates a new overlay
   */
  create(opts?: Opts): Promise<Overlay> {
    return this.ctrl.create((opts || {}) as any);
  }

  /**
   * When `id` is not provided, it dismisses the top overlay.
   */
  dismiss(data?: any, role?: string, id?: string): Promise<boolean> {
    return this.ctrl.dismiss(data, role, id);
  }

  /**
   * Returns the top overlay.
   */
  getTop(): Promise<Overlay | undefined> {
    return this.ctrl.getTop();
  }
}
