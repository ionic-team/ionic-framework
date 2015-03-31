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
      <div class="bar-spacer"></div>
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

    let x, barItem
    let barItemKeys = []
    let barItems = {}

    for (x = 0; x < (barItemElements && barItemElements.length); x++) {
      barItem = barItemElements[x]

      barItemKeys.push(barItem.offsetLeft)

      barItems[barItem.offsetLeft] = {
        left: barItem.offsetLeft,
        right: barItem.offsetLeft + barItem.offsetWidth
      }
    }

    barItemKeys.sort((a, b) => a - b)

    let largestGap = null

    for (x = 1; x < barItemKeys.length; x++) {
      let leftItem = barItems[barItemKeys[x - 1]]
      let rightItem = barItems[barItemKeys[x]]

      let gapWidth = rightItem.left - leftItem.right

      if (!largestGap || gapWidth > largestGap.width) {
        largestGap = {
          width: gapWidth,
          left: leftItem.right,
          right: rightItem.left
        }
      }
    }

    let marginLeft = 0
    let marginRight = 0

    if (largestGap) {
      marginLeft = largestGap.left
      marginRight = largestGap.right
    }

    let barWidth = ele.offsetWidth
    let centeredMargin = Math.max(marginLeft, barWidth - marginRight)
    let newMargin = `0 ${centeredMargin}px`

    if (newMargin !== this.titleMargin) {
      this.titleEle.style.margin = this.titleMargin = newMargin
      if (this.titleTextAlgin !== '') {
        this.titleEle.style.textAlign = this.titleTextAlgin = ''
      }

      // if an ellipsis is being shown, open up the right side
      // as far as it can before hitting right side buttons
      window.requestAnimationFrame(() => {
        if (this.titleEle.offsetWidth < this.titleEle.scrollWidth) {
          this.titleEle.style.margin = `0 ${barWidth - marginRight}px 0 ${centeredMargin}px`
          this.titleEle.style.textAlign = this.titleTextAlgin = 'left'
        }
        if (!this.isTitleVisible) {
          this.titleEle.style.opacity = 1
          this.isTitleVisible = true
        }
      })
    }

  }

}
