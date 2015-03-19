import {NgElement, Component, Template} from 'angular2/angular2';
import {Ion} from '../ion';

@Component({
  selector: 'ion-view',
  bind: {
    title: 'view-title'
  }
})
@Template({
  inline: `
    <div class="container">
      <div class="bar">
        <div class="bar-accessories">
          <div class="bar-accessory accessory-primary" style="background:red">
            PRIMARY
          </div>
          <div class="bar-accessory accessory-secondary" style="background:green">
            SECONDARY
          </div>
        </div>
      </div>
      <content></content>
    </div>`
})
export class View extends Ion {
  constructor(@NgElement() ele:NgElement) {
    ele.domElement.classList.add('view');
  }
}



        // <div class="title">
        //   <div class="inner-title">
        //     {{title}}
        //     <content select="ion-view-title"></content>
        //   </div>
        // </div>
        // <div class="tool-buttons buttons-primary">
        //   <content select="ion-view-buttons[side='primary']"></content>
        // </div>
        // <div class="tool-buttons buttons-secondary">
        //   <content select="ion-view-buttons[side='secondary']"></content>
        // </div>
