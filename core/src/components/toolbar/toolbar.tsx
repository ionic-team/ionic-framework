import type { ComponentInterface } from '@stencil/core';
import {
  Component,
  Element,
  forceUpdate,
  h,
  Host,
  Listen,
  Prop,
  readTask,
  State,
  Watch,
  writeTask,
} from '@stencil/core';
import { findIonContent, getScrollElement } from '@utils/content';
import { createColorClasses, hostContext } from '@utils/theme';

import { getIonTheme } from '../../global/ionic-global';
import type { Color, CssClassMap, StyleEventDetail } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the toolbar text in LTR, and to the right in RTL.
 * @slot secondary - Content is placed to the left of the toolbar text in the `"ios"` theme, and directly to the right in the `"md"` theme.
 * @slot primary - Content is placed to the right of the toolbar text in the `"ios"` theme, and to the far right in the `"md"` theme.
 * @slot end - Content is placed to the right of the toolbar text in LTR, and to the left in RTL.
 *
 * @part background - The background of the toolbar, covering the entire area behind the toolbar content.
 * @part container - The container that wraps all toolbar content, including the default slot and named slot content.
 * @part content - The container for the default slot, wrapping content provided without a named slot.
 */
@Component({
  tag: 'ion-toolbar',
  styleUrls: {
    ios: 'toolbar.ios.scss',
    md: 'toolbar.md.scss',
    ionic: 'toolbar.ionic.scss',
  },
  shadow: true,
})
export class Toolbar implements ComponentInterface {
  /** Minimum cumulative downward scroll (px) before hiding the toolbar. */
  private static readonly HIDE_ON_SCROLL_THRESHOLD = 24;

  /** Debounce interval for container `ResizeObserver` callbacks. */
  private static readonly CONTAINER_RESIZE_DEBOUNCE_MS = 100;

  /**
   * Refcount attribute on `ion-header` / `ion-footer` for `*-scroll-hidden` classes.
   * Store how many hideOnScroll toolbars in the same header/footer are currently hidden.
   */
  private static readonly TOOLBAR_HIDE_COUNT_ATTR = 'data-toolbar-hide-count';

  /** Refcount attributes on `ion-content` for offset coordination classes. */
  private static readonly TOOLBAR_HIDE_OFFSET_TOP_COUNT_ATTR = 'data-toolbar-hide-offset-top-count';
  private static readonly TOOLBAR_HIDE_OFFSET_BOTTOM_COUNT_ATTR = 'data-toolbar-hide-offset-bottom-count';

  /**
   * Scroll elements being adjusted programmatically.
   * Ignored by scroll handlers to prevent hide/show feedback loops.
   */
  private static readonly programmaticScrollTargets = new WeakSet<HTMLElement>();

  /**
   * Shared scroll position per scroll element. Used when multiple toolbars on the
   * same page listen to one `ion-content` scroll target.
   */
  private static readonly scrollLastTopByElement = new WeakMap<HTMLElement, number>();

  /**
   * One passive scroll listener per scroll element; fans out to every toolbar
   * with `hideOnScroll` on the same page.
   */
  private static readonly scrollListeners = new WeakMap<
    HTMLElement,
    { callback: () => void; toolbars: Set<Toolbar> }
  >();

  private childrenStyles = new Map<string, CssClassMap>();
  private scrollEl?: HTMLElement;
  private contentEl?: HTMLElement;
  private cumulativeDownDelta = 0;
  private containerEl?: HTMLElement;
  private position: 'top' | 'bottom' = 'top';
  private hideOnScrollActive = false;
  private containerResizeObserver?: ResizeObserver;
  private containerResizeDebounceId?: number;
  private readonly slotClasses = [
    'has-start-content',
    'has-end-content',
    'has-primary-content',
    'has-secondary-content',
  ];
  private readonly showClasses = ['show-start', 'show-end', 'show-primary', 'show-secondary'];
  private readonly slotSizeVars = ['--start-end-size', '--primary-secondary-size'];

  @Element() el!: HTMLIonToolbarElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * Where to place the title relative to the other toolbar content.
   * `"start"`: The title will appear to the left of the toolbar content in LTR and to the right in RTL.
   * `"center"`: The title will appear in the center of the toolbar.
   * `"end"`: The title will appear to the right of the toolbar content in LTR and to the left in RTL.
   *
   * Only applies in the `ionic` theme.
   */
  @Prop() titlePlacement?: 'start' | 'center' | 'end';

  /**
   * If `true`, the toolbar will be hidden when the user scrolls down
   * and shown when the user scrolls up.
   *
   * Applies when the toolbar is inside an `ion-header` or `ion-footer`
   * and a sibling `ion-content` exists on the same page. The header
   * slides up and fades; the footer slides down.
   * `ion-content` scroll insets are coordinated per edge so top and bottom toolbars can hide
   * independently.
   *
   * When the theme is `"ios"`, this takes precedence over
   * `ion-header[collapse="condense" | "fade"]` if both are set on the
   * same header.
   */
  @Prop() hideOnScroll = false;

  @State() scrollHidden = false;

  @Watch('hideOnScroll')
  hideOnScrollChanged() {
    this.destroyHideOnScroll();
    void this.setupHideOnScroll();
  }

  componentWillLoad() {
    const buttons = Array.from(this.el.querySelectorAll('ion-buttons'));

    const firstButtons = buttons.find((button) => {
      return button.slot === 'start';
    });
    if (firstButtons) {
      firstButtons.classList.add('buttons-first-slot');
    }

    const buttonsReversed = buttons.reverse();
    const lastButtons =
      buttonsReversed.find((button) => button.slot === 'end') ||
      buttonsReversed.find((button) => button.slot === 'primary') ||
      buttonsReversed.find((button) => button.slot === 'secondary');
    if (lastButtons) {
      lastButtons.classList.add('buttons-last-slot');
    }

    this.updateSlotClasses();
  }

  componentDidLoad() {
    this.updateSlotClasses();
    this.updateSlotWidths();
    void this.setupHideOnScroll();
  }

  disconnectedCallback() {
    this.destroyHideOnScroll();
  }

  @Watch('titlePlacement')
  titlePlacementChanged() {
    this.updateSlotClasses();
  }

  /**
   * Gets the title placement.
   * Returns the title placement if it is set, otherwise returns `"center"`
   * for `ionic` and `ios`, and `"start"` for `md`.
   */
  private getTitlePlacement(): 'start' | 'center' | 'end' {
    if (this.titlePlacement !== undefined) {
      return this.titlePlacement;
    }

    return getIonTheme(this) === 'ionic' || getIonTheme(this) === 'ios' ? 'center' : 'start';
  }

  /**
   * Updates the CSS custom properties for slot widths
   * This ensures that slots shown by their met conditions
   * have a minimum width matching their required slot
   */
  private updateSlotWidths(tries: number = 0) {
    // Set timeout to try to execute after everything is rendered
    setTimeout(() => {
      // Attempt to measure and update
      const success = this.measureAndUpdateSlots();

      // If not all measurements were successful, try again in 100 ms
      // cap recursion at 5 tries for safety
      if (!success && tries < 5) {
        setTimeout(() => {
          this.updateSlotWidths(tries + 1);
        }, 100);
      }
    });
  }

  /**
   * Measure the widths of the slots and update the CSS custom properties
   * for the minimum width of each pair of slots based on the largest width in each pair.
   * Returns whether we successfully measured all of the slots we expect to have content.
   * If not, the content probably hasn't rendered yet and we need to try again.
   */
  private measureAndUpdateSlots(): boolean {
    // Define the relationship between slots based on the conditions array
    // Group slots that should have the same width
    const slotPairs = [
      { name: 'start-end', slots: ['start', 'end'] },
      { name: 'primary-secondary', slots: ['primary', 'secondary'] },
    ];

    // First, measure all slot widths
    const slotWidths = new Map<string, number>();
    let allMeasurementsSuccessful = true;

    // Measure all slots with content
    const slots = ['start', 'end', 'primary', 'secondary'];
    slots.forEach((slot) => {
      if (this.el.classList.contains(`has-${slot}-content`)) {
        const slotElement = this.el.shadowRoot?.querySelector(`slot[name="${slot}"]`) as HTMLSlotElement | null;
        if (slotElement) {
          // Check if the slot contains an img or ion-img
          const assignedElements = slotElement.assignedElements({ flatten: true });
          const hasImg = assignedElements.some((el) => {
            if (el.tagName === 'IMG' || el.tagName === 'ION-IMG') {
              return true;
            }
            // Check for nested images
            return el.querySelector('img, ion-img');
          });

          // Temporarily allow slot to size to content by setting flex-basis
          // to 'auto'. This ensures that slotted images can render at their
          // intrinsic width for measurement.
          if (hasImg) {
            const { name } = slotPairs.find((pair) => pair.slots.includes(slot))!;
            this.el.style.setProperty(`--${name}-size`, 'auto');
          }

          const width = slotElement.offsetWidth;

          if (width > 0) {
            slotWidths.set(slot, width);
          } else {
            allMeasurementsSuccessful = false;
          }
        }
      }
    });

    // Then set the CSS custom properties based on the largest width in each pair
    slotPairs.forEach(({ name, slots }) => {
      // Find the maximum width among the slots in this pair
      let maxWidth = 0;
      let hasAnyContent = false;

      slots.forEach((slot) => {
        if (slotWidths.has(slot)) {
          hasAnyContent = true;
          maxWidth = Math.max(maxWidth, slotWidths.get(slot) ?? 0);
        }
      });

      // If at least one slot in the pair has content, set the min-width for the pair
      if (hasAnyContent && maxWidth > 0) {
        // Set a single CSS variable for the pair
        this.el.style.setProperty(`--${name}-size`, `${maxWidth}px`);
      }
    });

    return allMeasurementsSuccessful;
  }

  /**
   * Removes all slot visibility classes and slot width CSS variables.
   */
  private removeSlotClasses() {
    this.el.classList.remove(...this.slotClasses, ...this.showClasses);
    this.slotSizeVars.forEach((cssVar) => this.el.style.removeProperty(cssVar));
  }

  private updateSlotClasses() {
    const titlePlacement = this.getTitlePlacement();
    if (titlePlacement !== 'center') {
      this.removeSlotClasses();
      return;
    }

    // Check if slots have content
    const slots = ['start', 'end', 'primary', 'secondary'];

    const classesToAdd: string[] = [];
    const classesToRemove: string[] = [];
    slots.forEach((slot) => {
      const slotHasContent = this.hasSlotContent(slot);
      const slotClass = `has-${slot}-content`;
      if (slotHasContent) {
        classesToAdd.push(slotClass);
      } else {
        classesToRemove.push(slotClass);
      }
    });

    // Force visibilities in certain conditions. This works by adding a class to the toolbar
    // named `show-{slot}`. This class will be added if the toolbar has the required slots
    // and does not have any of the excluded slots, otherwise it will be removed.
    // This is useful to enforce centering of the toolbar content when there are different amounts
    // of slots on either side of the toolbar.
    const conditions = [
      { name: 'end', requiredSlots: ['start'], excludeSlots: ['end', 'primary'] },
      { name: 'start', requiredSlots: ['end'], excludeSlots: ['start', 'secondary'] },
      { name: 'secondary', requiredSlots: ['primary'], excludeSlots: ['secondary', 'start'] },
      { name: 'primary', requiredSlots: ['secondary'], excludeSlots: ['primary', 'end'] },
    ];
    conditions.forEach((condition) => {
      const hasRequiredSlots = condition.requiredSlots.every((slot) => classesToAdd.includes(`has-${slot}-content`));
      const hasExcludedSlots = condition.excludeSlots.some((slot) => classesToAdd.includes(`has-${slot}-content`));
      const className = `show-${condition.name}`;

      if (hasRequiredSlots && !hasExcludedSlots) {
        classesToAdd.push(className);
      } else {
        classesToRemove.push(className);
      }
    });

    // Add classes to the toolbar element
    this.el.classList.add(...classesToAdd);
    this.el.classList.remove(...classesToRemove);

    // Update slot widths after classes have been updated
    this.updateSlotWidths();
  }

  private hasSlotContent(slotName: string): boolean {
    const slotNode = this.el.shadowRoot?.querySelector(`slot[name="${slotName}"]`) as HTMLSlotElement | null;
    return !!slotNode && slotNode.assignedNodes().length > 0;
  }

  // ---------------------------------------------------------------------------
  // Hide on scroll
  // ---------------------------------------------------------------------------

  /**
   * Locates the page `ion-content` used for scroll detection and inset coordination.
   */
  private findPageContent(): HTMLElement | null {
    if (!this.containerEl) {
      return null;
    }

    const pageEl = this.containerEl.closest('ion-page, .ion-page');
    if (pageEl) {
      return findIonContent(pageEl);
    }

    const parent = this.containerEl.parentElement;
    if (parent) {
      return findIonContent(parent);
    }

    return null;
  }

  /**
   * Initializes scroll listening and coordinates `ion-content` insets when
   * `hideOnScroll` is enabled inside `ion-header` or `ion-footer`.
   */
  private async setupHideOnScroll() {
    if (!this.hideOnScroll) {
      return;
    }

    const headerEl = this.el.closest('ion-header');
    const footerEl = this.el.closest('ion-footer');

    if (headerEl) {
      this.containerEl = headerEl;
      this.position = 'top';
    } else if (footerEl) {
      this.containerEl = footerEl;
      this.position = 'bottom';
    } else {
      return;
    }

    const contentEl = this.findPageContent();

    if (!contentEl) {
      return;
    }

    this.contentEl = contentEl;
    this.hideOnScrollActive = true;

    const containerClass = this.position === 'top' ? 'ion-header-hide-on-scroll' : 'ion-footer-hide-on-scroll';
    this.containerEl.classList.add(containerClass);

    this.enableContentOffsetCoordination(true);
    writeTask(() => this.updateContentOffsetSize());
    this.observeContainerResize();

    await this.initScrollListener(contentEl);
  }

  /**
   * Keeps `--toolbar-hide-offset-*` in sync when the header/footer height changes.
   */
  private observeContainerResize() {
    if (typeof ResizeObserver === 'undefined' || !this.containerEl) {
      return;
    }

    this.containerResizeObserver = new ResizeObserver(() => {
      if (this.containerResizeDebounceId !== undefined) {
        clearTimeout(this.containerResizeDebounceId);
      }

      this.containerResizeDebounceId = window.setTimeout(() => {
        this.containerResizeDebounceId = undefined;
        writeTask(() => this.updateContentOffsetSize());
      }, Toolbar.CONTAINER_RESIZE_DEBOUNCE_MS);
    });
    this.containerResizeObserver.observe(this.containerEl);
  }

  /** Get last known `scrollTop` for `scrollEl`. */
  private static getScrollLastTop(scrollEl: HTMLElement) {
    let lastScrollTop = Toolbar.scrollLastTopByElement.get(scrollEl);
    if (lastScrollTop === undefined) {
      lastScrollTop = scrollEl.scrollTop;
      Toolbar.scrollLastTopByElement.set(scrollEl, lastScrollTop);
    }
    return lastScrollTop;
  }

  /** Update `scrollTop` after each scroll event for the given scroll element. */
  private static setScrollLastTop(scrollEl: HTMLElement, scrollTop: number) {
    Toolbar.scrollLastTopByElement.set(scrollEl, scrollTop);
  }

  /** Get element with the scrollable content inside `ion-content` and register it to the scroll listener. */
  private async initScrollListener(contentEl: HTMLElement) {
    const scrollEl = (this.scrollEl = await getScrollElement(contentEl));
    this.registerScrollListener(scrollEl);
  }

  /**
   * Register a scroll listener per scroll element and notify each toolbar that's active.
   */
  private registerScrollListener(scrollEl: HTMLElement) {
    let entry = Toolbar.scrollListeners.get(scrollEl);

    if (!entry) {
      Toolbar.setScrollLastTop(scrollEl, scrollEl.scrollTop);

      const callback = () => {
        readTask(() => {
          const scrollTop = scrollEl.scrollTop;

          if (Toolbar.programmaticScrollTargets.has(scrollEl)) {
            Toolbar.setScrollLastTop(scrollEl, scrollTop);
            return;
          }

          const lastScrollTop = Toolbar.getScrollLastTop(scrollEl);
          const deltaY = scrollTop - lastScrollTop;
          Toolbar.setScrollLastTop(scrollEl, scrollTop);

          Toolbar.scrollListeners.get(scrollEl)?.toolbars.forEach((toolbar) => {
            toolbar.handleHideOnScrollDelta(deltaY);
          });
        });
      };

      scrollEl.addEventListener('scroll', callback, { passive: true });
      entry = { callback, toolbars: new Set() };
      Toolbar.scrollListeners.set(scrollEl, entry);
    }

    entry.toolbars.add(this);
  }

  /** Unset the scroll listener for the given scroll element. */
  private unregisterScrollListener() {
    if (!this.scrollEl) {
      return;
    }

    const entry = Toolbar.scrollListeners.get(this.scrollEl);
    if (!entry) {
      return;
    }

    entry.toolbars.delete(this);

    if (entry.toolbars.size === 0) {
      this.scrollEl.removeEventListener('scroll', entry.callback);
      Toolbar.scrollListeners.delete(this.scrollEl);
      Toolbar.scrollLastTopByElement.delete(this.scrollEl);
    }
  }

  /**
   * Applies scroll delta for this toolbar (called from the shared listener).
   */
  private handleHideOnScrollDelta(deltaY: number) {
    if (!this.hideOnScrollActive) {
      return;
    }

    const shouldHide = this.checkScrollStatus(deltaY);

    if (shouldHide !== this.scrollHidden) {
      writeTask(() => {
        this.setScrollHidden(shouldHide);
      });
    }
  }

  /**
   * Remove scroll listeners, classes, and update state.
   */
  private destroyHideOnScroll() {
    this.unregisterScrollListener();
    this.scrollEl = undefined;

    if (this.scrollHidden) {
      this.setScrollHidden(false);
    } else {
      this.scrollHidden = false;
    }

    if (this.hideOnScrollActive && this.containerEl) {
      const containerClass = this.position === 'top' ? 'ion-header-hide-on-scroll' : 'ion-footer-hide-on-scroll';
      this.containerEl.classList.remove(containerClass);
      this.containerEl.removeAttribute(Toolbar.TOOLBAR_HIDE_COUNT_ATTR);
    }

    this.enableContentOffsetCoordination(false);

    if (this.containerResizeObserver) {
      this.containerResizeObserver.disconnect();
      this.containerResizeObserver = undefined;
    }

    if (this.containerResizeDebounceId !== undefined) {
      clearTimeout(this.containerResizeDebounceId);
      this.containerResizeDebounceId = undefined;
    }

    this.contentEl = undefined;
    this.containerEl = undefined;
    this.hideOnScrollActive = false;
    this.cumulativeDownDelta = 0;
  }

  /**
   * Update hidden state, scroll insets, and container/content classes.
   */
  private setScrollHidden(hidden: boolean) {
    if (hidden === this.scrollHidden) {
      return;
    }

    this.compensateScrollForInsetChange(hidden);
    this.scrollHidden = hidden;
    this.updateContainerAndContentClasses(hidden);
  }

  /**
   * Adjust scroll position when the inset animates so visible content does not jump.
   */
  private compensateScrollForInsetChange(hidden: boolean) {
    if (!this.scrollEl || !this.containerEl) {
      return;
    }

    const insetDelta = this.containerEl.offsetHeight;
    if (insetDelta <= 0) {
      return;
    }

    const scrollEl = this.scrollEl;
    Toolbar.programmaticScrollTargets.add(scrollEl);

    if (this.position === 'top') {
      if (hidden) {
        scrollEl.scrollTop = Math.max(0, scrollEl.scrollTop - insetDelta);
      } else {
        scrollEl.scrollTop += insetDelta;
      }
      Toolbar.setScrollLastTop(scrollEl, scrollEl.scrollTop);
    } else if (hidden) {
      const maxScrollTop = scrollEl.scrollHeight - scrollEl.clientHeight;
      scrollEl.scrollTop = Math.min(scrollEl.scrollTop, Math.max(0, maxScrollTop));
      Toolbar.setScrollLastTop(scrollEl, scrollEl.scrollTop);
    }

    requestAnimationFrame(() => {
      Toolbar.programmaticScrollTargets.delete(scrollEl);
    });
  }

  /**
   * Turns `ion-content` scroll inset coordination on or off for top/bottom.
   *
   * The header/footer overlays the viewport, so content needs extra padding.
   * Top and bottom are counted separately so a page can have both header and footer
   * `hideOnScroll` toolbars without one disabling the other.
   */
  private enableContentOffsetCoordination(enable: boolean) {
    if (!this.contentEl || !this.containerEl) {
      return;
    }

    const isTop = this.position === 'top';
    // How many hide-on-scroll toolbars on this top/bottom
    const countAttr = isTop
      ? Toolbar.TOOLBAR_HIDE_OFFSET_TOP_COUNT_ATTR
      : Toolbar.TOOLBAR_HIDE_OFFSET_BOTTOM_COUNT_ATTR;
    // CSS class for top/bottom ion-content
    const contentClass = isTop ? 'content-toolbar-hide-offset-top' : 'content-toolbar-hide-offset-bottom';
    // CSS variable for height from header/footer
    const offsetVar = isTop ? '--toolbar-hide-offset-top' : '--toolbar-hide-offset-bottom';
    // CSS class for scroll-hidden state on ion-content
    const hiddenClass = isTop ? 'content-header-scroll-hidden' : 'content-footer-scroll-hidden';

    // How many hide-on-scroll toolbars on this top/bottom
    const prevCount = parseInt(this.contentEl.getAttribute(countAttr) || '0', 10);
    // Increment/decrement the count
    const newCount = enable ? prevCount + 1 : Math.max(0, prevCount - 1);
    this.contentEl.setAttribute(countAttr, String(newCount));

    // First toolbar on this top/bottom
    if (enable && prevCount === 0) {
      this.contentEl.classList.add(contentClass);
      this.updateContentOffsetSize();
    } else if (!enable && newCount === 0) {
      // Last toolbar on this top/bottom
      this.contentEl.classList.remove(contentClass, hiddenClass);
      this.contentEl.style.removeProperty(offsetVar);
      this.contentEl.removeAttribute(countAttr);
    }
  }

  /**
   * Writes measured header/footer height to CSS variables on `ion-content`.
   */
  private updateContentOffsetSize() {
    if (!this.contentEl || !this.containerEl) {
      return;
    }

    const heightPx = this.containerEl.offsetHeight;
    if (heightPx <= 0) {
      return;
    }

    const offsetVar = this.position === 'top' ? '--toolbar-hide-offset-top' : '--toolbar-hide-offset-bottom';
    const nextValue = `${heightPx}px`;
    const currentValue = this.contentEl.style.getPropertyValue(offsetVar);

    if (currentValue === nextValue) {
      return;
    }

    this.contentEl.style.setProperty(offsetVar, nextValue);
  }

  /**
   * Applies scroll-hidden UI for this toolbar's edge (header or footer).
   *
   * Uses `data-toolbar-hide-count` on the container so multiple `hideOnScroll`
   * toolbars in the same header/footer only toggle classes when the last one
   * hides or when the first one shows.
   */
  private updateContainerAndContentClasses(hidden: boolean) {
    if (!this.hideOnScrollActive || !this.containerEl) {
      return;
    }

    // Slide the header/footer off-screen
    const hiddenClass = this.position === 'top' ? 'header-scroll-hidden' : 'footer-scroll-hidden';
    // Collapse `ion-content` while hidden
    const contentClass = this.position === 'top' ? 'content-header-scroll-hidden' : 'content-footer-scroll-hidden';
    const countAttr = Toolbar.TOOLBAR_HIDE_COUNT_ATTR;
    const prevCount = parseInt(this.containerEl.getAttribute(countAttr) || '0', 10);

    if (hidden) {
      const newCount = prevCount + 1;
      this.containerEl.setAttribute(countAttr, String(newCount));

      // First hidden toolbar on this container: enable hidden styles.
      if (prevCount === 0) {
        this.containerEl.classList.add(hiddenClass);
        if (this.contentEl && !this.contentEl.classList.contains(contentClass)) {
          this.contentEl.classList.add(contentClass);
        }
      }
    } else {
      const newCount = Math.max(0, prevCount - 1);
      this.containerEl.setAttribute(countAttr, String(newCount));

      // Last visible toolbar on this container: restore header/footer and inset.
      if (newCount === 0) {
        this.containerEl.classList.remove(hiddenClass);
        if (this.contentEl?.classList.contains(contentClass)) {
          this.contentEl.classList.remove(contentClass);
        }
        // Re-measure so `--toolbar-hide-offset-*` matches the shown toolbar height.
        this.updateContentOffsetSize();
      }
    }
  }

  /**
   * Returns whether the toolbar should be hidden for the current scroll delta.
   */
  private checkScrollStatus(deltaY: number): boolean {
    if (deltaY < 0) {
      this.cumulativeDownDelta = 0;
      return false;
    }

    if (deltaY > 0) {
      this.cumulativeDownDelta += deltaY;

      if (this.cumulativeDownDelta >= Toolbar.HIDE_ON_SCROLL_THRESHOLD) {
        return true;
      }
    }

    return this.scrollHidden;
  }

  @Listen('ionStyle')
  childrenStyle(ev: CustomEvent<StyleEventDetail>) {
    ev.stopPropagation();

    const tagName = (ev.target as HTMLElement).tagName;
    const updatedStyles = ev.detail;
    const newStyles = {} as CssClassMap;
    const childStyles = this.childrenStyles.get(tagName) || {};

    let hasStyleChange = false;
    Object.keys(updatedStyles).forEach((key) => {
      const childKey = `toolbar-${key}`;
      const newValue = updatedStyles[key];
      if (newValue !== childStyles[childKey]) {
        hasStyleChange = true;
      }
      if (newValue) {
        newStyles[childKey] = true;
      }
    });

    if (hasStyleChange) {
      this.childrenStyles.set(tagName, newStyles);
      forceUpdate(this);
    }
  }

  render() {
    const theme = getIonTheme(this);
    const childStyles = {};
    this.childrenStyles.forEach((style) => {
      Object.assign(childStyles, style);
    });

    const titlePlacement = this.getTitlePlacement();
    const { hideOnScroll, scrollHidden, position } = this;

    return (
      <Host
        class={{
          ...createColorClasses(this.color, {
            [theme]: true,
            'in-toolbar': hostContext('ion-toolbar', this.el),
            [`toolbar-title-placement-${titlePlacement}`]: true,
          }),
          'toolbar-hide-on-scroll': hideOnScroll,
          'toolbar-scroll-hidden': scrollHidden,
          'toolbar-hide-on-scroll-bottom': hideOnScroll && position === 'bottom',
          ...childStyles,
        }}
      >
        <div class="toolbar-background" part="background"></div>
        <div class="toolbar-container" part="container">
          <slot name="start" onSlotchange={() => this.updateSlotClasses}></slot>
          <slot name="secondary" onSlotchange={() => this.updateSlotClasses}></slot>
          <div class="toolbar-content" part="content">
            <slot></slot>
          </div>
          <slot name="primary" onSlotchange={() => this.updateSlotClasses}></slot>
          <slot name="end" onSlotchange={() => this.updateSlotClasses}></slot>
        </div>
      </Host>
    );
  }
}
