
export class NavParams {

  constructor(public data: any = {}) {
  }

  get(param: string): any {
    return this.data[param];
  }
}
