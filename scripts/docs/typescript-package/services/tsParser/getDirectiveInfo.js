
module.exports = function getDirectiveInfo() {

  return function (symbol) {
    var directiveInfo;
    if (symbol.valueDeclaration) {
      var decorators = symbol.valueDeclaration.decorators;
      decorators && decorators.forEach(function(decorator){
        try {
          var expr = decorator.expression;
          var type = expr.expression.text.match(/Component|Directive/);
          if (type) {
            // type is either Component or Directive
            // properties are selector, inputs and outputs
            directiveInfo = { type: type[0], properties: [] };

            //Directive only takes one argument
            expr.arguments[0].properties.forEach(function(prop){
              var name = prop.name.text;
              if (name === "selector") {
                directiveInfo.properties.push({name: name, values: prop.initializer.text.split(",")});
              }
              if (name === "inputs" || name === "outputs") {
                var values = prop.initializer.elements.map(function(e){ return e.text });
                directiveInfo.properties.push({name: name, values: values });
              }
            });
          }
        } catch(e){}
      });
    }
    return directiveInfo;
  };
};
