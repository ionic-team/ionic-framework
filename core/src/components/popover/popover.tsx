import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { CoreDelegate, attachComponent, detachComponent } from '@utils/framework-delegate';
import { addEventListener, raf, hasLazyBuild } from '@utils/helpers';
import { createLockController } from '@utils/lock-controller';
import { printIonWarning } from '@utils/logging';
import {
  BACKDROP,
  dismiss,
  eventMethod,
  focusFirstDescendant,
  prepareOverlay,
  present,
  setOverlayId,
} from '@utils/overlays';
import { isPlatform } from '@utils/platform';
import { getClassMap } from '@utils/theme';
import { deepReady, waitForMount } from '@utils/transition';

import { getIonTheme } from '../../global/ionic-global';
import type { AnimationBuilder, ComponentProps, ComponentRef, FrameworkDelegate } from '../../interface';
import type { OverlayEventDetail } from '../../utils/overlays-interface';

import { iosEnterAnimation } from './animations/ios.enter';
import { iosLeaveAnimation } from './animations/ios.leave';
import { mdEnterAnimation } from './animations/md.enter';
import { mdLeaveAnimation } from './animations/md.leave';
import type {
  PopoverInterface,
  PopoverSize,
  PositionAlign,
  PositionReference,
  PositionSide,
  TriggerAction,
} from './popover-interface';
import { configureDismissInteraction, configureKeyboardInteraction, configureTriggerInteraction } from './utils';

// TODO(FW-2832): types

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of components.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The visual appearance of the component.
 *
 * @slot - Content is placed inside of the `.popover-content` element.
 *
 * @part backdrop - The `ion-backdrop` element.
 * @part arrow - The arrow that points to the reference element. Only applies on `ios` mode.
 * @part content - The wrapper element for the default slot.
 */
@Component({
  tag: 'ion-popover',
  styleUrls: {
    ios: 'popover.ios.scss',
    md: 'popover.md.scss',
    ionic: 'popover.md.scss',
  },
  shadow: true,
})
export class Popover implements ComponentInterface, PopoverInterface {
  private usersElement?: HTMLElement;
  private triggerEl?: HTMLElement | null;
  private parentPopover: HTMLIonPopoverElement | null = null;
  private coreDelegate: FrameworkDelegate = CoreDelegate();
  private readonly lockController = createLockController();
  private destroyTriggerInteraction?: () => void;
  private destroyKeyboardInteraction?: () => void;
  private destroyDismissInteraction?: () => void;

  private inline = false;
  private workingDelegate?: FrameworkDelegate;

  private focusDescendantOnPresent = false;

  lastFocus?: HTMLElement;

  @State() presented = false;

  @Element() el!: HTMLIonPopoverElement;

  /** @internal */
  @Prop() hasController = false;

  /** @internal */
  @Prop() delegate?: FrameworkDelegate;

  /** @internal */
  @Prop() overlayIndex!: number;

  /**
   * Animation to use when the popover is presented.
   */
  @Prop() enterAnimation?: AnimationBuilder;

  /**
   * Animation to use when the popover is dismissed.
   */
  @Prop() leaveAnimation?: AnimationBuilder;

  /**
   * The component to display inside of the popover.
   * You only need to use this if you are not using
   * a JavaScript framework. Otherwise, you can just
   * slot your component inside of `ion-popover`.
   */
  @Prop() component?: ComponentRef;

  /**
   * The data to pass to the popover component.
   * You only need to use this if you are not using
   * a JavaScript framework. Otherwise, you can just
   * set the props directly on your component.
   */
  @Prop() componentProps?: ComponentProps;

  /**
   * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
   */
  @Prop() keyboardClose = true;

  /**
   * Additional classes to apply for custom CSS. If multiple classes are
   * provided they should be separated by spaces.
   * @internal
   */
  @Prop() cssClass?: string | string[];

  /**
   * If `true`, the popover will be dismissed when the backdrop is clicked.
   */
  @Prop() backdropDismiss = true;

  /**
   * The event to pass to the popover animation.
   */
  @Prop() event: any;

  /**
   * If `true`, a backdrop will be displayed behind the popover.
   * This property controls whether or not the backdrop
   * darkens the screen when the popover is presented.
   * It does not control whether or not the backdrop
   * is active or present in the DOM.
   */
  @Prop() showBackdrop = true;

  /**
   * If `true`, the popover will be translucent.
   * Only applies when the mode is `"ios"` and the device supports
   * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
   */
  @Prop() translucent = false;

  /**
   * If `true`, the popover will animate.
   */
  @Prop() animated = true;

  /**
   * Additional attributes to pass to the popover.
   */
  @Prop() htmlAttributes?: { [key: string]: any };

  /**
   * Describes what kind of interaction with the trigger that
   * should cause the popover to open. Does not apply when the `trigger`
   * property is `undefined`.
   * If `"click"`, the popover will be presented when the trigger is left clicked.
   * If `"hover"`, the popover will be presented when a pointer hovers over the trigger.
   * If `"context-menu"`, the popover will be presented when the trigger is right
   * clicked on desktop and long pressed on mobile. This will also prevent your
   * device's normal context menu from appearing.
   */
  @Prop() triggerAction: TriggerAction = 'click';

  /**
   * An ID corresponding to the trigger element that
   * causes the popover to open. Use the `trigger-action`
   * property to customize the interaction that results in
   * the popover opening.
   */
  @Prop() trigger: string | undefined;

  /**
   * Describes how to calculate the popover width.
   * If `"cover"`, the popover width will match the width of the trigger.
   * If `"auto"`, the popover width will be set to a static default value.
   */
  @Prop() size: PopoverSize = 'auto';

  /**
   * If `true`, the popover will be automatically
   * dismissed when the content has been clicked.
   */
  @Prop() dismissOnSelect = false;

  /**
   * Describes what to position the popover relative to.
   * If `"trigger"`, the popover will be positioned relative
   * to the trigger button. If passing in an event, this is
   * determined via event.target.
   * If `"event"`, the popover will be positioned relative
   * to the x/y coordinates of the trigger action. If passing
   * in an event, this is determined via event.clientX and event.clientY.
   */
  @Prop() reference: PositionReference = 'trigger';

  /**
   * Describes which side of the `reference` point to position
   * the popover on. The `"start"` and `"end"` values are RTL-aware,
   * and the `"left"` and `"right"` values are not.
   */
  @Prop() side: PositionSide = 'bottom';

  /**
   * Describes how to align the popover content with the `reference` point.
   * Defaults to `"center"` for `ios` mode, and `"start"` for `md` mode.
   */
  @Prop({ mutable: true }) alignment?: PositionAlign;

  /**
   * If `true`, the popover will display an arrow that points at the
   * `reference` when running in `ios` mode. Does not apply in `md` mode.
   */
  @Prop() arrow = true;

  /**
   * If `true`, the popover will open. If `false`, the popover will close.
   * Use this if you need finer grained control over presentation, otherwise
   * just use the popoverController or the `trigger` property.
   * Note: `isOpen` will not automatically be set back to `false` when
   * the popover dismisses. You will need to do that in your code.
   */
  @Prop() isOpen = false;

  /**
   * @internal
   *
   * If `true` the popover will not register its own keyboard event handlers.
   * This allows the contents of the popover to handle their own keyboard interactions.
   *
   * If `false`, the popover will register its own keyboard event handlers for
   * navigating `ion-list` items within a popover (up/down/home/end/etc.).
   * This will also cancel browser keyboard event bindings to prevent scroll
   * behavior in a popover using a list of items.
   */
  @Prop() keyboardEvents = false;

  @Watch('trigger')
  @Watch('triggerAction')
  onTriggerChange() {
    this.configureTriggerInteraction();
  }

  @Watch('isOpen')
  onIsOpenChange(newValue: boolean, oldValue: boolean) {
    if (newValue === true && oldValue === false) {
      this.present();
    } else if (newValue === false && oldValue === true) {
      this.dismiss();
    }
  }

  /**
   * If `true`, the component passed into `ion-popover` will
   * automatically be mounted when the popover is created. The
   * component will remain mounted even when the popover is dismissed.
   * However, the component will be destroyed when the popover is
   * destroyed. This property is not reactive and should only be
   * used when initially creating a popover.
   *
   * Note: This feature only applies to inline popovers in JavaScript
   * frameworks such as Angular, React, and Vue.
   */
  @Prop() keepContentsMounted = false;

  /**
   * Emitted after the popover has presented.
   */
  @Event({ eventName: 'ionPopoverDidPresent' }) didPresent!: EventEmitter<void>;

  /**
   * Emitted before the popover has presented.
   */
  @Event({ eventName: 'ionPopoverWillPresent' }) willPresent!: EventEmitter<void>;

  /**
   * Emitted before the popover has dismissed.
   */
  @Event({ eventName: 'ionPopoverWillDismiss' }) willDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the popover has dismissed.
   */
  @Event({ eventName: 'ionPopoverDidDismiss' }) didDismiss!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the popover has presented.
   * Shorthand for ionPopoverWillDismiss.
   */
  @Event({ eventName: 'didPresent' }) didPresentShorthand!: EventEmitter<void>;

  /**
   * Emitted before the popover has presented.
   * Shorthand for ionPopoverWillPresent.
   */
  @Event({ eventName: 'willPresent' }) willPresentShorthand!: EventEmitter<void>;

  /**
   * Emitted before the popover has dismissed.
   * Shorthand for ionPopoverWillDismiss.
   */
  @Event({ eventName: 'willDismiss' }) willDismissShorthand!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted after the popover has dismissed.
   * Shorthand for ionPopoverDidDismiss.
   */
  @Event({ eventName: 'didDismiss' }) didDismissShorthand!: EventEmitter<OverlayEventDetail>;

  /**
   * Emitted before the popover has presented, but after the component
   * has been mounted in the DOM.
   * This event exists for ion-popover to resolve an issue with the
   * popover and the lazy build, that the transition is unable to get
   * the correct dimensions of the popover with auto sizing.
   * This is not required for other overlays, since the existing
   * overlay transitions are not effected by auto sizing content.
   *
   * @internal
   */
  @Event() ionMount!: EventEmitter<void>;

  connectedCallback() {
    const { configureTriggerInteraction, el } = this;

    prepareOverlay(el);
    configureTriggerInteraction();
  }

  disconnectedCallback() {
    const { destroyTriggerInteraction } = this;

    if (destroyTriggerInteraction) {
      destroyTriggerInteraction();
    }
  }

  componentWillLoad() {
    const { el } = this;
    const popoverId = setOverlayId(el);

    this.parentPopover = el.closest(`ion-popover:not(#${popoverId})`) as HTMLIonPopoverElement | null;

    if (this.alignment === undefined) {
      this.alignment = getIonTheme(this) === 'ios' ? 'center' : 'start';
    }
  }

  componentDidLoad() {
    const { parentPopover, isOpen } = this;

    /**
     * If popover was rendered with isOpen="true"
     * then we should open popover immediately.
     */
    if (isOpen === true) {
      raf(() => this.present());
    }

    if (parentPopover) {
      addEventListener(parentPopover, 'ionPopoverWillDismiss', () => {
        this.dismiss(undefined, undefined, false);
      });
    }

    /**
     * When binding values in frameworks such as Angular
     * it is possible for the value to be set after the Web Component
     * initializes but before the value watcher is set up in Stencil.
     * As a result, the watcher callback may not be fired.
     * We work around this by manually calling the watcher
     * callback when the component has loaded and the watcher
     * is configured.
     */
    this.configureTriggerInteraction();
  }

  /**
   * When opening a popover from a trigger, we should not be
   * modifying the `event` prop from inside the component.
   * Additionally, when pressing the "Right" arrow key, we need
   * to shift focus to the first descendant in the newly presented
   * popover.
   *
   * @internal
   */
  @Method()
  async presentFromTrigger(event?: any, focusDescendant = false) {
    this.focusDescendantOnPresent = focusDescendant;

    await this.present(event);

    this.focusDescendantOnPresent = false;
  }

  /**
   * Determines whether or not an overlay
   * is being used inline or via a controller/JS
   * and returns the correct delegate.
   * By default, subsequent calls to getDelegate
   * will use a cached version of the delegate.
   * This is useful for calling dismiss after
   * present so that the correct delegate is given.
   */
  private getDelegate(force = false) {
    if (this.workingDelegate && !force) {
      return {
        delegate: this.workingDelegate,
        inline: this.inline,
      };
    }

    /**
     * If using overlay inline
     * we potentially need to use the coreDelegate
     * so that this works in vanilla JS apps.
     * If a developer has presented this component
     * via a controller, then we can assume
     * the component is already in the
     * correct place.
     */
    const parentEl = this.el.parentNode as HTMLElement | null;
    const inline = (this.inline = parentEl !== null && !this.hasController);
    const delegate = (this.workingDelegate = inline ? this.delegate || this.coreDelegate : this.delegate);

    return { inline, delegate };
  }

  /**
   * Present the popover overlay after it has been created.
   * Developers can pass a mouse, touch, or pointer event
   * to position the popover relative to where that event
   * was dispatched.
   */
  @Method()
  async present(event?: MouseEvent | TouchEvent | PointerEvent | CustomEvent): Promise<void> {
    const unlock = await this.lockController.lock();

    if (this.presented) {
      unlock();
      return;
    }

    const { el } = this;

    const { inline, delegate } = this.getDelegate(true);

    /**
     * Emit ionMount so JS Frameworks have an opportunity
     * to add the child component to the DOM. The child
     * component will be assigned to this.usersElement below.
     */
    this.ionMount.emit();

    this.usersElement = await attachComponent(
      delegate,
      el,
      this.component,
      ['popover-viewport'],
      this.componentProps,
      inline
    );

    if (!this.keyboardEvents) {
      this.configureKeyboardInteraction();
    }
    this.configureDismissInteraction();

    /**
     * When using the lazy loaded build of Stencil, we need to wait
     * for every Stencil component instance to be ready before presenting
     * otherwise there can be a flash of unstyled content. With the
     * custom elements bundle we need to wait for the JS framework
     * mount the inner contents of the overlay otherwise WebKit may
     * get the transition incorrect.
     */
    if (hasLazyBuild(el)) {
      await deepReady(this.usersElement);
      /**
       * If keepContentsMounted="true" then the
       * JS Framework has already mounted the inner
       * contents so there is no need to wait.
       * Otherwise, we need to wait for the JS
       * Framework to mount the inner contents
       * of this component.
       */
    } else if (!this.keepContentsMounted) {
      await waitForMount();
    }

    await present<PopoverPresentOptions>(this, 'popoverEnter', iosEnterAnimation, mdEnterAnimation, {
      event: event || this.event,
      size: this.size,
      trigger: this.triggerEl,
      reference: this.reference,
      side: this.side,
      align: this.alignment,
    });

    /**
     * If popover is nested and was
     * presented using the "Right" arrow key,
     * we need to move focus to the first
     * descendant inside of the popover.
     */
    if (this.focusDescendantOnPresent) {
      focusFirstDescendant(this.el, this.el);
    }

    unlock();
  }

  /**
   * Dismiss the popover overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the popover. For example, 'cancel' or 'backdrop'.
   * @param dismissParentPopover If `true`, dismissing this popover will also dismiss
   * a parent popover if this popover is nested. Defaults to `true`.
   *
   * This is a no-op if the overlay has not been presented yet. If you want
   * to remove an overlay from the DOM that was never presented, use the
   * [remove](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) method.
   */
  @Method()
  async dismiss(data?: any, role?: string, dismissParentPopover = true): Promise<boolean> {
    const unlock = await this.lockController.lock();

    const { destroyKeyboardInteraction, destroyDismissInteraction } = this;
    if (dismissParentPopover && this.parentPopover) {
      this.parentPopover.dismiss(data, role, dismissParentPopover);
    }

    const shouldDismiss = await dismiss<PopoverDismissOptions>(
      this,
      data,
      role,
      'popoverLeave',
      iosLeaveAnimation,
      mdLeaveAnimation,
      this.event
    );

    if (shouldDismiss) {
      if (destroyKeyboardInteraction) {
        destroyKeyboardInteraction();
        this.destroyKeyboardInteraction = undefined;
      }
      if (destroyDismissInteraction) {
        destroyDismissInteraction();
        this.destroyDismissInteraction = undefined;
      }

      /**
       * If using popover inline
       * we potentially need to use the coreDelegate
       * so that this works in vanilla JS apps
       */
      const { delegate } = this.getDelegate();
      await detachComponent(delegate, this.usersElement);
    }

    unlock();

    return shouldDismiss;
  }

  /**
   * @internal
   */
  @Method()
  async getParentPopover(): Promise<HTMLIonPopoverElement | null> {
    return this.parentPopover;
  }

  /**
   * Returns a promise that resolves when the popover did dismiss.
   */
  @Method()
  onDidDismiss<T = any>(): Promise<OverlayEventDetail<T>> {
    return eventMethod(this.el, 'ionPopoverDidDismiss');
  }

  /**
   * Returns a promise that resolves when the popover will dismiss.
   */
  @Method()
  onWillDismiss<T = any>(): Promise<OverlayEventDetail<T>> {
    return eventMethod(this.el, 'ionPopoverWillDismiss');
  }

  private onBackdropTap = () => {
    this.dismiss(undefined, BACKDROP);
  };

  private onLifecycle = (modalEvent: CustomEvent) => {
    const el = this.usersElement;
    const name = LIFECYCLE_MAP[modalEvent.type];
    if (el && name) {
      const event = new CustomEvent(name, {
        bubbles: false,
        cancelable: false,
        detail: modalEvent.detail,
      });
      el.dispatchEvent(event);
    }
  };

  private configureTriggerInteraction = () => {
    const { trigger, triggerAction, el, destroyTriggerInteraction } = this;

    if (destroyTriggerInteraction) {
      destroyTriggerInteraction();
    }

    if (trigger === undefined) {
      return;
    }

    const triggerEl = (this.triggerEl = trigger !== undefined ? document.getElementById(trigger) : null);
    if (!triggerEl) {
      printIonWarning(
        `A trigger element with the ID "${trigger}" was not found in the DOM. The trigger element must be in the DOM when the "trigger" property is set on ion-popover.`,
        this.el
      );
      return;
    }

    this.destroyTriggerInteraction = configureTriggerInteraction(triggerEl, triggerAction, el);
  };

  private configureKeyboardInteraction = () => {
    const { destroyKeyboardInteraction, el } = this;

    if (destroyKeyboardInteraction) {
      destroyKeyboardInteraction();
    }

    this.destroyKeyboardInteraction = configureKeyboardInteraction(el);
  };

  private configureDismissInteraction = () => {
    const { destroyDismissInteraction, parentPopover, triggerAction, triggerEl, el } = this;

    if (!parentPopover || !triggerEl) {
      return;
    }

    if (destroyDismissInteraction) {
      destroyDismissInteraction();
    }

    this.destroyDismissInteraction = configureDismissInteraction(triggerEl, triggerAction, el, parentPopover);
  };

  render() {
    const theme = getIonTheme(this);
    const { onLifecycle, parentPopover, dismissOnSelect, side, arrow, htmlAttributes } = this;
    const desktop = isPlatform('desktop');
    const enableArrow = arrow && !parentPopover;

    return (
      <Host
        aria-modal="true"
        no-router
        tabindex="-1"
        {...(htmlAttributes as any)}
        style={{
          zIndex: `${20000 + this.overlayIndex}`,
        }}
        class={{
          ...getClassMap(this.cssClass),
          [theme]: true,
          'popover-translucent': this.translucent,
          'overlay-hidden': true,
          'popover-desktop': desktop,
          [`popover-side-${side}`]: true,
          'popover-nested': !!parentPopover,
        }}
        onIonPopoverDidPresent={onLifecycle}
        onIonPopoverWillPresent={onLifecycle}
        onIonPopoverWillDismiss={onLifecycle}
        onIonPopoverDidDismiss={onLifecycle}
        onIonBackdropTap={this.onBackdropTap}
      >
        {!parentPopover && <ion-backdrop tappable={this.backdropDismiss} visible={this.showBackdrop} part="backdrop" />}

        <div class="popover-wrapper ion-overlay-wrapper" onClick={dismissOnSelect ? () => this.dismiss() : undefined}>
          {enableArrow && <div class="popover-arrow" part="arrow"></div>}
          <div class="popover-content" part="content">
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}

const LIFECYCLE_MAP: any = {
  ionPopoverDidPresent: 'ionViewDidEnter',
  ionPopoverWillPresent: 'ionViewWillEnter',
  ionPopoverWillDismiss: 'ionViewWillLeave',
  ionPopoverDidDismiss: 'ionViewDidLeave',
};

interface PopoverPresentOptions {
  /**
   * The original target event that presented the popover.
   */
  event: Event;
  /**
   * Describes how to calculate the popover width.
   */
  size: PopoverSize;
  /**
   * The element that causes the popover to open.
   */
  trigger?: HTMLElement | null;
  /**
   * Describes what to position the popover relative to.
   */
  reference: PositionReference;
  /**
   * Side of the `reference` point to position the popover on.
   */
  side: PositionSide;
  /**
   * Describes how to align the popover content with the `reference` point.
   */
  align?: PositionAlign;
}

type PopoverDismissOptions = Event;
