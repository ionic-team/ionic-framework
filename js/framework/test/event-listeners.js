(function(window, document, framework, $) {

  framework.on("ready", function(){
    console.log("ready")
  });


  // Test that the standard jQuery call works with our event system
  $(window).on("initalized", function() {
    console.log("initalized");
  });

})(this, document, this.FM = this.FM || {}, jQuery);