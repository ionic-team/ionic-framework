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
        <div class="back-button">
          <div class="back-button-icon">&lt;</div>
          <div class="back-button-text">
            <div class="back-default">Back</div>
            <div class="back-title"></div>
          </div>
        </div>
        <div class="title">
          <div class="inner-title">
            {{ title }}
            <content select="ion-view-title"></content>
          </div>
        </div>
        <div class="bar-primary-item" style="background:red">
          PRIMARY
        </div>
        <div class="spacer"></div>
        <div class="bar-secondary-item" style="background:green">
          SECONDARY
        </div>
      </div>
    </div>`
})
export class ToolBar {
  constructor() {
  }
}
