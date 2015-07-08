

export class ListVirtualScroll {
  constructor(list) {
    this.list = list;
    this.content = this.list.content;

    this.viewportHeight = this.content.height();

    this.viewContainer = this.list.itemTemplate.viewContainer;

    this.itemHeight = 60;

    this.shownItems = {};
    this.enteringItems = [];
    this.leavingItems = [];

    // Compute the initial sizes
    setTimeout(() => {
      this.resize();

      // Simulate the first event to start layout
      this._handleVirtualScroll({
        target: this.content.scrollElement
      });
    })

    this.content.addScrollEventListener((event) => {
      this._handleVirtualScroll(event);
    });
  }

  resize() {
    this.viewportHeight = this.content.height();
    this.viewportScrollHeight = this.content.scrollElement.scrollHeight;

    this.virtualHeight = this.list.items.length * this.itemHeight;
    this.itemsPerScreen = this.viewportHeight / this.itemHeight;

    console.log('VIRTUAL: resize(viewportHeight:', this.viewportHeight,
      'viewportScrollHeight:', this.viewportScrollHeight, 'virtualHeight:', this.virtualHeight,
      ', itemsPerScreen:', this.itemsPerScreen, ')');
  }

  _handleVirtualScroll(event) {
    let item;
    let shownItemRef;

    let st = event.target.scrollTop;
    let sh = event.target.scrollHeight;

    let topIndex = Math.floor(st / this.itemHeight);
    let bottomIndex = Math.floor((st / this.itemHeight) + this.itemsPerScreen);

    let items = this.list.items;

    // Key iterate the shown items map
    // and compare the index to our index range,
    // pushing the items to remove to our leaving
    // list if they're ouside this range.
    for(let i in this.shownItems) {
      if(i < topIndex || i > bottomIndex) {
        this.leavingItems.push(this.shownItems[i]);
        delete this.shownItems[i];
      }
    }

    let realIndex = 0;
    // Iterate the set of items that will be rendered, using the
    // index from the actual items list as the map for the
    // virtual items we draw
    for(let i = topIndex, realIndex = 0; i < bottomIndex && i < items.length; i++, realIndex++) {
      item = items[i];
      console.log('Drawing item', i, item.title);

      shownItemRef = this.shownItems[i];

      // Is this a new item?
      if(!shownItemRef) {
        let itemView = this.viewContainer.create(this.list.itemTemplate.protoViewRef, realIndex);

        itemView.setLocal('\$implicit', item);
        itemView.setLocal('\$item', item);

        shownItemRef = new VirtualItemRef(item, i, realIndex, itemView);

        this.shownItems[i] = shownItemRef;
        this.enteringItems.push(shownItemRef);
      }


      //tuple.view = viewContainer.create(protoViewRef, tuple.record.currentIndex);

    }

    while(this.leavingItems.length) {
      let itemRef = this.leavingItems.pop();
      console.log('Removing item', itemRef.item, itemRef.realIndex);
      this.viewContainer.remove(itemRef.realIndex);
    }

    console.log('VIRTUAL SCROLL: scroll(scrollTop:', st, 'topIndex:', topIndex, 'bottomIndex:', bottomIndex, ')');
    console.log('Container has', this.list.getNativeElement().children.length, 'children');
  }

  cellAtIndex(index) {

  }

}

class VirtualItemRef {
  constructor(item, index, realIndex, view) {
    this.item = item;
    this.index = index;
    this.realIndex = realIndex;
    this.view = view;
  }
}
