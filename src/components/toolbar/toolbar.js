import {NgElement, Component, Template} from 'angular2/angular2'
import {Ion} from '../ion'

@Component({
  selector: 'ion-toolbar'
})
@Template({
  inline: `
    <div class="bar bar-android">
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
