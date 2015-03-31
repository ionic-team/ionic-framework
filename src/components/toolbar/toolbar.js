import {NgElement, Component, Template} from 'angular2/angular2'
import {BackButton} from 'ionic2/components/toolbar/back-button'
import {ComponentConfig} from 'ionic2/config/component-config'

export let ToolbarConfig = new ComponentConfig('toolbar')

@Component({
  selector: 'ion-toolbar',
  bind: {
    title: 'view-title'
  },
  services: [ToolbarConfig]
})
@Template({
  inline: `
    <div class="bar-items">
      <button class="button back-button bar-item"></button>
      <div class="bar-title">
        <div class="bar-inner-title">
          {{ title }}
          <content select="ion-view-title"></content>
        </div>
      </div>
      <div class="bar-item bar-primary-item">
        <content select="ion-nav-items[side=primary]"></content>
      </div>
      <div class="bar-item bar-secondary-item">
        <content select="ion-nav-items[side=secondary]"></content>
      </div>
    </div>`,
  directives: [BackButton]
})
export class Toolbar {
  constructor(@NgElement() ngEle:NgElement, configFactory: ToolbarConfig) {
    this.domElement = ngEle.domElement

    this.config = configFactory.create(this);

    // TODO: make more better plz
    setTimeout(() => {
      this.alignTitle()
    }, 32)
  }

  alignTitle() {
    let ele = this.domElement
    this.titleEle = this.titleEle || ele.querySelector('.bar-inner-title')

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

    window.requestAnimationFrame(() => {
      if (this.titleEle.offsetWidth < this.titleEle.scrollWidth) {
        this.titleEle.style.margin = ''
        this.titleEle.style.textAlign = 'left'
      }
      if (!this.isTitleVisible) {
        this.titleEle.style.opacity = this.isTitleVisible = 1
      }
    })
  }

}
