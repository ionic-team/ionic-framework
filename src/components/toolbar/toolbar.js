import {NgElement, Component, Template} from 'angular2/angular2'
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
      <button class="button back-button bar-item">
        <div class="back-button-icon">&lt;</div>
        <div class="back-button-text">
          <div class="back-default">Back</div>
          <div class="back-title"></div>
        </div>
      </button>
      <div class="bar-title">
        <div class="bar-inner-title">
          {{ title }}
          <content select="ion-view-title"></content>
        </div>
      </div>
      <div class="bar-item bar-primary-item">
        <content select="ion-nav-items[side=primary]"></content>
      </div>
      <div class="bar-spacer"></div>
      <div class="bar-item bar-secondary-item">
        <content select="ion-nav-items[side=secondary]"></content>
      </div>
    </div>`
})
export class Toolbar {
  constructor(@NgElement() ngEle:NgElement, configFactory: ToolbarConfig) {
    this.domElement = ngEle.domElement

    this.config = configFactory.create(this);

    window.requestAnimationFrame(() => {
      this.alignTitle()
    })
  }

  alignTitle() {
    let ele = this.domElement
    this.titleEle = this.titleEle || ele.querySelector('.bar-inner-title')

    this.textAlign = this.textAlign || window.getComputedStyle(this.titleEle).textAlign

    if (this.textAlign !== 'center') return

    let barItemElements = ele.querySelectorAll('.bar-item')
    let x, barItemElement
    let leftMargin = 0
    let rightMargin = ele.offsetWidth
    let centerPoint = ele.offsetWidth / 2

    for (x = 0; x < (barItemElements && barItemElements.length); x++) {
      barItemElement = barItemElements[x]

      let itemRightPoint = barItemElement.offsetLeft + barItemElement.offsetWidth
      if (itemRightPoint < centerPoint) {
        if (itemRightPoint > leftMargin) {
          leftMargin = itemRightPoint
        }
      } else if (barItemElement.offsetLeft < rightMargin) {
        rightMargin = barItemElement.offsetLeft
      }
    }

    let centeredMargin = Math.max(leftMargin, ele.offsetWidth - rightMargin) + 'px'
    let newMargin = '0 ' + centeredMargin

    if (newMargin !== this.titleMargin) {
      this.titleEle.style.margin = this.titleMargin = newMargin
      this.titleEle.style.textAlign = ''

      // if an ellipsis is being shown, open up the right side
      // as far as it can before hitting right side buttons
      window.requestAnimationFrame(() => {
        if (this.titleEle.offsetWidth < this.titleEle.scrollWidth) {
          this.titleEle.style.margin = `0 ${ele.offsetWidth - rightMargin}px 0 ${centeredMargin}`
          this.titleEle.style.textAlign = 'left'
        }
        if (!this.isTitleVisible) {
          this.titleEle.style.opacity = 1
          this.isTitleVisible = true
        }
      })
    }

  }

}
