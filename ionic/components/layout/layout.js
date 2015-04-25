import {NgElement, Component, View as NgView, Parent} from 'angular2/angular2'


@Component({
  selector: 'layout,[layout]'
})
@NgView({
  template: `
    <content></content>
    <object class="ele-qry" data="about:blank"></object>
  `
})
export class Layout {
  constructor(
    @NgElement() ngElement:NgElement
  ) {
    this.domElement = ngElement.domElement
    this.eqEle = this.domElement.lastElementChild

    window.requestAnimationFrame(() => {
      this.initLayout()
    })
  }

  initLayout() {
    this.mqs = {}


    for (let x = 0; x < this.domElement.attributes.length; x++) {
      let attr = this.domElement.attributes[x]
      let val = attr.nodeValue
      let mqClassname = attr.nodeName

      if (val.indexOf('(') > -1 && val.indexOf(')') > -1) {
        let mql = this.eqEle.contentDocument.defaultView.matchMedia(val)

        if (mql.media !== 'not all') {
          this.mqs[mql.media] = (mql) => {
            console.log(mql.media, mql.matches, mqClassname)
            window.requestAnimationFrame(() => {
              this.domElement.classList[mql.matches ? 'add' : 'remove'](mqClassname)
            })
          }

          this.mqs[mql.media](mql)
          mql.addListener(this.mqs[mql.media])
        }
      }
    }

  }

}
