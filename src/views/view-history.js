
export class ViewHistory {
  constructor() {
    this._array = [];
  }

  indexOf(item) {
    return this._array.indexOf(item);
  }

  push(item) {
    return this._array.push(item);
  }

  pop() {
    return this._array.pop();
  }
  popTo(index) {
    var item = this._array[index];
    if (index !== -1) {
      this._array.length = index + 1;
    }
    return item;
  }

  peek(index) {
    if (!arguments.length) index = this._array.length - 1;
    return this._array[this._array.length - 1];
  }

  length() {
    return this._array.length;
  }
}
