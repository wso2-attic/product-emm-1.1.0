//Used to register helper functions to absolute mvc framework
var registerHelpers = function(mvc){
  mvc.registerHelper('showActive', function(currentPage, page, options) {
    if(currentPage == page){
      return "active";
    }else{
      return "";
    }
  });


  mvc.registerHelper('stringify', function(context) {
    var log = new Log();log.error("CONTEXT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+stringify(context));
      return stringify(context);
  });



  mvc.registerHelper('compare', function(lvalue, rvalue, options) {

    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    operator = options.hash.operator || "==";

    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    }

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

  });



  mvc.registerHelper('eachkeys', function(context, options) {
    var fn = options.fn, inverse = options.inverse;
    var ret = "";

    var empty = true;
    for (key in context) { empty = false; break; }

    if (!empty) {
      for (key in context) {
          ret = ret + fn({ 'key': key.toUpperCase(), 'value': context[key]});
      }
    } else {
      ret = inverse(this);
    }
    return ret;
  });


  mvc.registerHelper('elipsis', function(maxLength, context, options) {
    if(context.length > maxLength) {
      context = context.substring(0, maxLength)+"...";
    }

    return context;
  });
}