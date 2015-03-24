import {NgElement, Component, Template} from 'angular2/angular2'
import {Ion} from '../ion'

@Component({
  selector: 'ion-toolbar',
  bind: {
    title: 'view-title'
  }
})
@Template({
  inline: `
    <div class="bar bar-ios">
      <div class="bar-items">
        <button class="back-button bar-item">
          <div class="back-button-icon">&lt;</div>
          <div class="back-button-text">
            <div class="back-default">Back</div>
            <div class="back-title"></div>
          </div>
        </button>
        <div class="title">
          <div class="inner-title">
            {{ title }}
            <content select="ion-view-title"></content>
          </div>
        </div>
        <div class="bar-item bar-primary-item" style="background:red">
          <content select="ion-nav-items[side=primary]"></content>
        </div>
        <div class="spacer"></div>
        <div class="bar-item bar-secondary-item" style="background:green">
          <content select="ion-nav-items[side=secondary]"></content>
        </div>
      </div>
    </div>`
})
export class Toolbar {
  constructor(@NgElement() ngEle:NgElement) {
    this.ele = ngEle.domElement

    window.requestAnimationFrame(() => {
      this.alignTitle()
    })

  }

  alignTitle(ele) {
    ele = ele || this.ele;
    this.titleEle = this.titleEle || ele.querySelector('.title')

    this.textAlign = this.textAlign || window.getComputedStyle(this.titleEle).textAlign

    if (this.textAlign !== 'center') return

    var barItemElements = ele.querySelectorAll('.bar-item')
    var x, barItemElement
    var leftMargin = 0
    var rightMargin = ele.offsetWidth
    var centerPoint = ele.offsetWidth / 2

    for (x = 0; x < (barItemElements && barItemElements.length); x++) {
      barItemElement = barItemElements[x]

      var itemRightPoint = barItemElement.offsetLeft + barItemElement.offsetWidth
      if (itemRightPoint < centerPoint) {
        if (itemRightPoint > leftMargin) {
          leftMargin = itemRightPoint
        }
      } else if (barItemElement.offsetLeft < rightMargin) {
        rightMargin = barItemElement.offsetLeft
      }
    }

    var newMargin = `0 ${Math.max(leftMargin, ele.offsetWidth - rightMargin)}px`

    if (newMargin !== this.titleMargin) {
      this.titleEle.style.margin = this.titleMargin = newMargin
    }

  }

}
