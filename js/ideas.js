// Each idea is global; person objects have refs to the same idea object
// Ideas are not included in the game loop

function Idea(name, options) {
  options = options || {};
  var null_function = function() {};

  this.name = name;

  // This drawing method will be drawn right above the people talking about it
  // arguments: p, scale, style
  this.drawRepr = options.draw || null_function;
}
