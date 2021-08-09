import { Component, ComponentInterface, Element, h, Host, Listen, Prop } from '@stencil/core';
import { createAnimation } from '../../../../utils/animation/animation';
import { Animation } from '../../../../utils/animation/animation-interface';
import { createColorClasses } from '../../../../utils/theme';

/**
  * @slot -
  */
@Component({
  tag: 'med-accordion-list',
  styleUrl: 'med-accordion-list.scss',
  shadow: true,
})
export class Accordion implements ComponentInterface {
  @Element() hostElement!: HTMLElement;

  /**
    * Define a margin entre os itens do accordion.
    */
  @Prop() margin?: 'xs' | 'sm' | 'md' | 'lg';

  /**
    * Define a variação da borda do componente.
    */
  @Prop({ reflect: true }) singleOpen = true;

  /**
    * Define a variação da borda do componente.
    */
  @Prop({ reflect: true }) noBorder = false;

  private blocker!: HTMLElement;

  private currentlyOpen: CustomEvent | any = null;

  @Listen('toggle')
  async handleToggle(ev: any) {
    ev.detail.shouldOpen ? await this.animateOpen(ev) : await this.animateClose(ev);
    ev.detail.endTransition();
  }

  async closeOpenItem() {
    if (this.currentlyOpen !== null) {
      const itemToClose = this.currentlyOpen.detail;
      itemToClose.startTransition();
      await this.animateClose(this.currentlyOpen);
      itemToClose.endTransition();
      itemToClose.setClosed();
    }
  }

  getElementsToShift(target: Element | Node) {
    // Create an array of all accordion items
    const items = Array.from(this.hostElement.children);
    // Find the item being opened, and create a new array with only the elements beneath the element being opened
    let splitOnIndex = 0;

    items.forEach((item, index) => {
      if (item === target) {
        splitOnIndex = index;
      }
    });

    return [...items].splice(splitOnIndex + 1, items.length - (splitOnIndex + 1));
  }

  createOpenAnimation(elements: Element | Node | Element[] | Node[] | NodeList, amountToShift: number, isBlocker: boolean) {
    const openAnimationTime = 300;
    const beforeStyles: any = {
      transform: `translateY(-${amountToShift}px)`,
      position: 'relative',
      'z-index': '1',
    };

    const afterStyles: any = { transform: `none`, 'z-index': null };

    if (isBlocker) {
      beforeStyles['height'] = `${amountToShift}px`;
      afterStyles['height'] = '0px';
    }

    let animation = createAnimation()
      .addElement(elements)
      .delay(20)
      .beforeStyles(beforeStyles)
      .afterClearStyles(['position', 'z-index'])
      .afterStyles(afterStyles)
      .to('transform', 'translateY(0)')
      .duration(openAnimationTime)
      .easing('cubic-bezier(0.32,0.72,0,1)');

    return animation;
  }

  async animateOpen(ev: any) {
    // Close any open item first
    if (this.singleOpen) {
      await this.closeOpenItem();
    }

    this.currentlyOpen = ev;

    const elementsToShift = this.getElementsToShift(ev.detail.element);

    // Set item content to be visible
    ev.detail.content.style.display = 'block';
    ev.detail.header.style.borderBottomLeftRadius = '0';
    ev.detail.header.style.borderBottomRightRadius = '0';

    const amountToShift = ev.detail.content.clientHeight;
    const shiftDownAnimation = this.createOpenAnimation(elementsToShift, amountToShift, false);
    const blockerDownAnimation = this.createOpenAnimation(this.blocker, amountToShift, true);

    await Promise.all([shiftDownAnimation.play(), blockerDownAnimation.play()]);

    shiftDownAnimation.destroy();
    blockerDownAnimation.destroy();
  }

  createCloseAnimation(elements: Element | Node | Element[] | Node[] | NodeList, amountToShift: number) {
    const closeAnimationTime = 300;

    return createAnimation()
      .addElement(elements)
      .afterStyles({ transform: 'none' })
      .to('transform', `translateY(-${amountToShift}px)`)
      .duration(closeAnimationTime)
      .easing('cubic-bezier(0.32,0.72,0,1)');;
  }

  async animateClose(ev: any) {
    const elementsToShift = this.getElementsToShift(ev.detail.element);

    ev.detail.header.style = '';
    ev.detail.element.style.overflow = 'hidden';
    ev.detail.header.style.zIndex = '1';

    this.currentlyOpen = null;
    const amountToShift = ev.detail.content.clientHeight;

    // Now we first animate up the elements beneath the content that was opened to cover it
    // and then we set the content back to display: none and remove the transform completely
    // With the content gone, there will be no noticeable position change when removing the transform
    const shiftUpAnimation: Animation = this.createCloseAnimation(elementsToShift, amountToShift);
    const blockerUpAnimation: Animation = this.createCloseAnimation(this.blocker, amountToShift);
    const contentUpAnimation: Animation = this.createCloseAnimation(ev.detail.content, amountToShift);

    await Promise.all([shiftUpAnimation.play(), blockerUpAnimation.play(), contentUpAnimation.play()]);

    ev.detail.element.style.overflow = 'initial';
    ev.detail.header.style.zIndex = 'initial';
    ev.detail.content.style.display = 'none';

    shiftUpAnimation.destroy();
    blockerUpAnimation.destroy();
    contentUpAnimation.destroy();
  }

  render() {
    const { noBorder, margin } = this;
    return (
      <Host from-stencil
        class={createColorClasses(null, {
          'med-accordion-list': true,
          'med-accordion-list--no-border': noBorder,
          [`med-accordion-list--${margin}`]: margin !== undefined
        }, null)}>
        <slot></slot>
        <div class="med-accordion-list__blocker" ref={(el) => this.blocker = el as HTMLDivElement}></div>
      </Host>
    );
  }
}
