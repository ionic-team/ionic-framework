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
      <div class="bar bar-android2">
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
              Create hybrid mobile apps with the web technologies you love. Free and open source, Ionic offers a library of mobile-optimized HTML, CSS and JS components, gestures, and tools for building highly interactive apps. Built with Sass and optimized for AngularJS.
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
      </div>
    <div class="container">
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
