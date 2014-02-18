
(function(){

  function logMutation(m) {
    if(m.type == 'attributes') {
      attributeMutation(m);
    } else if(m.type == 'childList') {
      childListMutation(m);
    } else if(m.type == 'subtree') {
      attributeMutation(m);
    } else {
      console.debug(m);
    }
  }

  function attributeMutation(m) {
    // target's attributes are to be observed.
    if(m.attributeName == 'class') {
      var msgs = [];

      msgs.push( 'Class, ' + createElementId(m.target) );

      if(m.oldValue !== m.target.className) {
        var exisitingClasses = (m.oldValue ? m.oldValue.split(' ') : []);
        var currentClasses = m.target.className.split(' ');
        var addedClasses = [];
        var removedClasses = [];

        for(var x=0; x<currentClasses.length; x++) {
          if(currentClasses[x]=='' || ignoreClassName(currentClasses[x])) continue;
          var addedCSS = currentClasses[x];

          for(var y=0; y<exisitingClasses.length; y++) {
            if(currentClasses[x] == exisitingClasses[y]) {
              addedCSS = null;
              break
            }
          }

          if(addedCSS) addedClasses.push(addedCSS);
        }

        for(var x=0; x<exisitingClasses.length; x++) {
          if(exisitingClasses[x]=='' || ignoreClassName(exisitingClasses[x])) continue;
          var removedCSS=exisitingClasses[x];

          for(var y=0; y<currentClasses.length; y++) {
            if(currentClasses[x] == exisitingClasses[y]) {
              removedCSS = null;
              break
            }
          }

          if(removedCSS) removedClasses.push(removedCSS);
        }

        if(addedClasses.length) {
          msgs.push('Added ' + addedClasses);
        }
        if(removedClasses.length) {
          msgs.push('Removed ' + removedClasses);
        }
        if(addedClasses.length || removedClasses.length) {
          log(m, msgs, 'magenta');
        }

      } else {
        msgs.push('className never changed!')
        log(m, msgs, 'maroon');
      }

    } else if(m.attributeName == 'style') {
      var msgs = [];

      msgs.push( 'Style, ' + createElementId(m.target) );
      if(m.oldValue) msgs.push( 'from ' + m.oldValue );

      if(msgs.length) {
        log(m, msgs, 'blue');
      }
    }
  }

  function childListMutation(m) {
    // children are to be observed.
    var msgs = [];
    for(var x=0; x<m.addedNodes.length; x++) {
      if(m.addedNodes[x].nodeType !== 3) {
        msgs.push('Child List');
        msgs.push( 'Add: ' + createElementId(m.target) );
        msgs.push( 'Parent: ' + createElementId(m.target.parentElement) );
      }
    }
    if(msgs.length) {
      log(m, msgs, 'orange');
    }

    msgs = [];
    for(var x=0; x<m.removedNodes.length; x++) {
      if(m.removedNodes[x].nodeType !== 3) {
        msgs.push('Child List');
        msgs.push( 'Remove: ' + createElementId(m.target) );
        msgs.push( 'Parent: ' + createElementId(m.target.parentElement) );
      }
    }
    if(msgs.length) {
      log(m, msgs, 'orangered');
    }
  }

  function createElementId(el) {
    var id;
    if(!el) {
      id = 'null'
    } else if(el.tagName) {
      var id = el.tagName.toLowerCase();
      var classes = el.className.split(' ');
      for(var x=0; x<classes.length; x++) {
        if(!ignoreClassName(classes[x])) {
          id += '.' + classes[x];
        }
      }
      if(el.id.length) id += '#' + el.id;

      var href = el.getAttribute('href');
      if(href) {
        href = href.split('/');
        id += '[href=' + href[href.length -1] + ']';
      }

      var ngClick = el.getAttribute('ng-click');
      if(ngClick) {
        id += '[ng-click=' + ngClick + ']';
      }
    } else {
      id = el.nodeName;
    }
    return id;
  }

  function ignoreClassName(className) {
    if(!className.length) return true;
    for(var x=0; x<ignoreClassNames.length; x++) {
      if(className === ignoreClassNames[x]) return true;
    }
  }

  function log(m, msgs, color) {
    totalManipulations++;

    if(m.target && !m.target.domTraceId) {
      m.target.domTraceId = idInc;
      idInc++;
    }

    msgs.unshift( 'ID ' + m.target.domTraceId );

    var d = new Date();
    msgs.unshift( d.getSeconds() + '.' + d.getMilliseconds() );

    var msg = msgs.join(', ');
    console.debug("%c" + msg,
                "color:" + color);

    clearTimeout(timeId)
    timeId = setTimeout(function(){
      console.debug('Manipulations:', totalManipulations)
      totalManipulations = 0;
    }, 1200);
  }

  var timeId;

  window.domTrace = {

    observe: function(selector){
      if (!selector) selector = 'body';
      var el = document.querySelector(selector);
      if(!el) return console.error(selector, 'not found');

      console.debug('Dom Trace, observe:', selector);

      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(logMutation);
      });

      observer.observe(el, {
        attributes: true,
        childList: false,
        subtree: true,
        attributeOldValue: true,
        //characterData: true,
        //characterDataOldValue: true,
        attributeFilter: true
      });
    }

  };

  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

  var ignoreClassNames = [
    'ng-binding',
    'ng-bind-html'
  ];

  var idInc = 0;
  var totalManipulations = 0;

  document.addEventListener('keyup', function(e){
    if(e.keyCode === 27) {
      console.clear();
      totalManipulations = 0;
    }
  }, false);

  //Shortcuts for tests
  angular.element(document).ready(function() {
    window.$s = angular.element(document).scope().$root;
    window.$i = angular.element(document).injector();
  });
})(window);
