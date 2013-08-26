(function(window, document, framework) {

  // this file should not be apart of the build
  // its just just for testing that the correct
  // events are being triggered and at the correct
  // times, and so we don't have to hardcode/remove
  // console calls throughout the code
  
  framework.on('ready', function(){
    console.log('ready');
  });

  framework.on('initalized', function(){
    console.log('initalized');
  });

  framework.on('pageinit', function(e){
    console.log('pageinit:', e.detail);
  });

  framework.on('pageinitfailed', function(){
    console.log('pageinitfailed');
  });

  framework.on('pageloaded', function(e){
    console.log('pageloaded,', e.detail.data.url, ", Title:", e.detail.data.title);
  });

  framework.on('pagecreate', function(e){
    console.log('pagecreate,', e.detail.url);
  });

  framework.on('pagetransition', function(e){
    console.log('pagetransition, newActivePageId:', e.detail.newActivePageId);
  });

  framework.on('pageview', function(){
    console.log('pageview');
  });

  framework.on('pageremove', function(){
    console.log('pageremove');
  });


})(this, document, FM = this.FM || {});