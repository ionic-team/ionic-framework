
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
  var hasViewportChange = false;

  if( ionic.Platform.isWebView() ) {
    if( viewportProperties.height != 'device-height' ) {
      viewportProperties.height = 'device-height';
      hasViewportChange = true;
    }
  } else if( viewportProperties.height ) {
    delete viewportProperties.height;
    hasViewportChange = true;
  }
  if(hasViewportChange) viewportUpdate();
}

function viewportUpdate(updates) {
  if(!viewportTag) return;

  ionic.Utils.extend(viewportProperties, updates);

  var key, props = [];
  for(key in viewportProperties) {
    if(viewportProperties[key]) props.push(key + '=' + viewportProperties[key]);
  }

  viewportTag.content = props.join(',');
}

ionic.DomUtil.ready(function() {
  viewportLoadTag();
});
