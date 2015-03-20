class Element {
}
class DomElement extends Element {
}
class NativeElement extends Element {
}

class View {
  el: Element;
  children: List<View>

  // Child operations
  addChild(child) {
  }
  removeChild(child) {
  }
  insertChild(child, index) {
  }
  constructor(el: Element) {
  }

  getElement() {
    return el
  }
}

class TabBarView extends View {
  tabBarButtons: List<TabBarButtonView>
}
class TabBarButtonView extends Button {
  icon: Icon
  title: String
}

/**
 * VIEW CONTROLLERS
 */

class ViewController {
  view: View;
  behaviors: List<Behavior>

  behaviorEmit(lifeCycleEventName) {
    forEach(this.behaviors, function(behavior) {
      if(behavior[lifeCycleEventName](this.view) === false) {
        return true
      }
    })
  }

  // Lifecycle methods, same as Adam Lifecycle
  onCompile() {
    behaviorEmit('onCompile')
  }
  onInsert() {
    behaviorEmit('onInsert')
  }
  onRemove() {
    behaviorEmit('onRemove')
  }
}

class NavViewController extends ViewController {
  viewControllers: Stack<ViewController>;
  visibleViewController: ViewController;

  push(viewController) {
    stack.push(viewController)
  }
  pop(viewController) {
    stack.pop(viewController)
  }
  set viewControllers(v) {
    this.viewControllers = v
  }
}

class TabsViewController extends ViewController {
  tabBar: TabBarView;
  viewControllers: List<ViewController>;

  constructor() {
    this.tabBar.bind('tabClick', function(tabItem) {
      // A specific tab item was clicked
      this.selectTab(tabItem) 
    })
  }

  addTab(viewController) {
    this.viewControllers.push(viewController)
  }
}

class SideMenuController extends ViewController {
  sideMenuView: SideMenuView
  contentView: View

  constructor(contentView, side) {
    this.sideMenuView = new SideMenuView()

    if(contentView) {
      // Explicit content view
      this.contentView = contentView
    } else {
      // Heuristic to try to find it
      this.inferContentView()
    }
    this.side = side

    // The default behavior
    this.behaviors.push(new SideMenuContentSlideBehavior(
      this.sideMenuView,
      this.contentView
    ))

  }

  inferContentView() {
    this.contentView = this.getParent().find('is(Content)')[0]
    /*
    var index = this.getParent().getChildren().indexOf(this.sideMenuView))
    if(this.side == 'left') {
      targetIndex = index + 1
    }
    if(this.side == 'right') {
      targetIndex = index - 1
    }
    this.contentView = this.getParent().getChildAtIndex(targetIndex)
    */
  }
}

class Behavior {
  // The Behavior class will hook into lifecycle events for views

  // Component compiled
  onCompile(view) {
  }
  // Component inserted
  onInsert(view) {
  }

  beforeCreate() {
  }
  onCreate() {
  }
  afterCreate() {
  }
}

class SideMenuContentSlideBehavior extends Behavior {
  constructor(sideMenuView, contentView) {
    var gesture = new EdgePanGesture(this.onDrag, contentView)
  }
  act: function(view, lifecycle) {
    return false
  }
  onDrag: function(event) {
    // Drag out side menu
  }
}
class DrawerStyleBehavior extends Behavior {
  act: function(view, lifecycle) {
    var gesture = new EdgePanGesture(this.onDrag, contentView)
    return false
  }
  onInsert(view) {
  }
  onDrag: function(event) {
    // Drag out side menu
  }
}


/**
 * Gestures
 **/

class Gesture {
}
class EdgePanGesture extends Gesture {
  constructor(el) {
    el.onDrag(this.onDrag)
  }
  onDrag(e) {
    x = e.pageX
    y = e.pageY


    if(!isDragging && x > edgeThreshold) {
      // Not in threshold
      return
    } else if(!isDragging) {
      // Check if we've started yet
      if(!start) {
        start = {
          x: x
        }
      }

      // Check if we dragged enough (like 3 px or whatever)
      if(Math.abs(start.x - x) > dragThreshold) {
        isDragging = true
      }
    }
  }
  onDragEnd(e) {
    start = null
    x = null
    isDragging = false
  }
}
class PinchToZoomGesture extends Gesture {
}
class HoldGesture extends Gesture {
}
class SwipeGesture extends Gesture {
}

