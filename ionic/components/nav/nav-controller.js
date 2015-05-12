
export class NavController {
  constructor() {
  }

  push() {
    return this.nav.push.apply(this.nav, arguments);
  }

  pop() {
    return this.nav.pop.apply(this.nav, arguments);
  }
}
