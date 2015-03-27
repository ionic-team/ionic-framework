import {NgElement, Component, Template} from 'angular2/angular2'

@Component({
  selector: 'ion-list'
})
@Template({
  inline: `
    <header class="list-header">
      <content select="ion-list-header"></content>
    </header>
    <div class="list-content">
      <content></content>
    </div>`
    <footer class="list-footer">
      <content select="ion-list-footer"></content>
    </footer>`
})
export class List {
  constructor(@NgElement() ele:NgElement) {
    ele.domElement.classList.add('list')
  }
}
