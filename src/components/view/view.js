import {NgElement, Component, Template, Parent, Ancestor} from 'angular2/angular2'
import {Toolbar} from 'ionic2/components/toolbar/toolbar'
import {IonicComponent} from 'ionic2/config/component'


@Component({
  selector: 'ion-view',
  bind: {
    title: 'nav-title'
  }
})
@Template({
  inline: `
    <ion-toolbar class="view-toolbar" [nav-title]="title">
      <content select="ion-nav-title"></content>
      <content select="ion-nav-items[side=primary]"></content>
      <content select="ion-nav-items[side=secondary]"></content>
    </ion-toolbar>
    <content></content>`,
  directives: [Toolbar]
})
export class View {
  constructor(
    @NgElement() ngElement:NgElement
  ) {
    this.domElement = ngElement.domElement
    this.config = View.config.invoke(this)

    this.domElement.classList.add('pane')


    /*** TODO: MAKE MORE GOOD!! HACK HACK HACK!!!!!!!!! *****/
    /*
      Take the toolbar info from this view and view's context
      and transplate it to go to it's associated toolbar container
      Both ion-nav-view and ion-tabs components provide the toolbar container
      Trick is that it's context needs to still be available after the DOM
      element was moved to another location.
    */
    setTimeout(() => {
      var toolbar = this.domElement.querySelector('ion-toolbar')
      if (!toolbar) return

      toolbar.parentNode.removeChild(toolbar)

      var ele = this.domElement.parentElement
      var navViewportEle
      while (ele) {
        if (ele.tagName == 'ION-NAV-VIEWPORT' || ele.tagName == 'ION-TABS') {
          navViewportEle = ele
          break
        }
        ele = ele.parentElement
      }

      if (!navViewportEle) return

      var toolbarContainer = navViewportEle.querySelector('.toolbar-container')
      if (!toolbarContainer) return

      toolbarContainer.appendChild(toolbar)
    })
    /*** HACK HACK HACK!!!!!!!!! *****/

  }
}

new IonicComponent(View, {})
