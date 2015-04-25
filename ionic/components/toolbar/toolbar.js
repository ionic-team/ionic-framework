import {NgElement, Component, View, Ancestor, Optional} from 'angular2/angular2'
import {BackButton} from 'ionic/components/toolbar/back-button'
import {ComponentConfig} from 'ionic/config/component-config'
import {raf} from 'ionic/util/dom'

export let ToolbarConfig = new ComponentConfig('toolbar')

@Component({
  selector: 'ion-toolbar',
  bind: {
    title: 'nav-title'
  },
  injectables: [ToolbarConfig]
})
@View({
  template: `
    <div class="toolbar-items">
      <button class="button back-button toolbar-item" style="display:none"></button>
      <div class="toolbar-title">
        <div class="toolbar-inner-title">
          {{ title }}
          <content select="ion-nav-title"></content>
        </div>
      </div>
      <div class="toolbar-item toolbar-primary-item">
        <content select="ion-nav-items[side=primary]"></content>
      </div>
      <div class="toolbar-item toolbar-secondary-item">
        <content select="ion-nav-items[side=secondary]"></content>
      </div>
    </div>
  `,
  directives: [BackButton]
})
export class Toolbar {
  constructor(
    @NgElement() ngEle:NgElement,
    configFactory: ToolbarConfig
  ) {
    this.domElement = ngEle.domElement

    this.config = configFactory.create(this);

    // TODO: make more better plz
    setTimeout(() => {
      this.alignTitle()
    }, 32)
  }

  alignTitle() {
    let ele = this.domElement
    this.titleEle = this.titleEle || ele.querySelector('.toolbar-inner-title')

    this.textAlign = this.textAlign || window.getComputedStyle(this.titleEle).textAlign

    if (this.textAlign !== 'center') return

    // dont bother if the title is already too long
    if (this.titleEle.offsetWidth < this.titleEle.scrollWidth) {
      if (!this.isTitleVisible) {
        this.titleEle.style.opacity = this.isTitleVisible = 1
      }
      return
    }

    let leftMargin = this.titleEle.offsetLeft
    let rightMargin = ele.offsetWidth - (leftMargin + this.titleEle.offsetWidth)
    let centerMargin = leftMargin - rightMargin

    this.titleEle.style.margin = `0 ${centerMargin}px 0 0`

    raf(() => {
      if (this.titleEle.offsetWidth < this.titleEle.scrollWidth) {
        this.titleEle.style.margin = ''
        this.titleEle.style.textAlign = 'left'
      }
      if (!this.isTitleVisible) {
        this.titleEle.style.opacity = this.isTitleVisible = 1
      }
    })
  }

  back() {
    if (this.viewport && this.viewport._stack.length) {
      this.viewport.pop()
    }
  }

}
