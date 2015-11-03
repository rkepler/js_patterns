this.x = 9; 
var module = {
  x: 81,
  getX: function() { return this.x; }
};

console.log("module.getX(): " + module.getX()); // 81

var getX = module.getX;
console.log("getX(): " + getX()); // 9, because in this case, "this" refers to the global object

// Create a new function with 'this' bound to module
var boundGetX = getX.bind(module);
console.log("boundGetX: " + boundGetX()); // 81