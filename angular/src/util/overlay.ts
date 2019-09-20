
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
  create(opts?: Opts) {
    // TODO: next major release opts is not optional
    return this.ctrl.create((opts || {}) as any);
  }

  /**
   * When `id` is not provided, it dismisses the top overlay.
   */
  dismiss(data?: any, role?: string, id?: string) {
    return this.ctrl.dismiss(data, role, id);
  }

  /**
   * Returns the top overlay.
   */
  getTop() {
    return this.ctrl.getTop();
  }
}
