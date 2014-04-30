
var viewportTag;
var viewportProperties = {};


function viewportLoadTag() {
  var x;

  for(x=0; x<document.head.children.length; x++) {
    if(document.head.children[x].name == 'viewport') {
      viewportTag = document.head.children[x];
      break;
    }
  }

  if(viewportTag) {
    var props = viewportTag.content.toLowerCase().replace(/\s+/g, '').split(',');
    var keyValue;
    for(x=0; x<props.length; x++) {
      keyValue = props[x].split('=');
      if(keyValue.length == 2) viewportProperties[ keyValue[0] ] = keyValue[1];
    }
    viewportInitWebView();
  }
}

function viewportInitWebView() {
  var initHeight = viewportProperties.height;

  if( ionic.Platform.isWebView() ) {
    viewportProperties.height = 'device-height';

  } else if( ionic.Platform.isIOS() && viewportProperties.height ) {
    // if its not a webview, and a viewport height was set, just removing
    // the height value doesn't trigger the change, but setting to 0 does the trick
    viewportProperties.height = '0';

  } else if( viewportProperties.height ) {
    delete viewportProperties.height;
  }

  // only update the viewport tag if there was a change
  if(initHeight !== viewportProperties.height) viewportUpdate();
  console.debug(viewportTag.content)
}

function viewportUpdate(updates) {
  if(!viewportTag) return;

  ionic.Utils.extend(viewportProperties, updates);

  var key, props = [];
  for(key in viewportProperties) {
    if(viewportProperties[key]) props.push(key + '=' + viewportProperties[key]);
  }

  viewportTag.content = props.join(', ');
}

ionic.DomUtil.ready(function() {
  viewportLoadTag();
});
