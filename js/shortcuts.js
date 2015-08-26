
// HTML ==============================================================
var wnd = window
, doc = document
, $ = function () { return doc.querySelector.apply(doc, arguments); }
, reqAnimFrame = wnd.requestAnimationFrame || wnd.mozRequestAnimationFrame
, notify = function(msg) {
    $('#game-message').textContent = msg;
  }

// Math ==============================================================
, pi = Math.PI
, xy = function(x, y) { return {x:x, y:y}; }
, rth = function(r, th) { return {r:r, th:th}; } // r/theta circular coords
, squared = function(x) { return Math.pow(x, 2); }
, dist = function(p1, p2) {
    return Math.sqrt(squared(p1.x - p2.x) + squared(p1.y - p2.y));
  }
, sin = Math.sin
, cos = Math.cos
, abs = Math.abs
, min = Math.min
, max = Math.max
, rnd = Math.random
, rnds = function(a, b) {
  if (typeof b === 'undefined') { b = a; a = 0; }
    return a + rnd() * (b - a);
  }
, rnd_choice = function(array) {
    return array[Math.floor(rnds(array.length))];
  }
, probability = function(n) { return rnd() < n; }
, vec_add = function(p1, p2) {
    return xy(p1.x + p2.x, p1.y + p2.y)
  }
, polar2cart = function(p) {
    return xy(
      p.r * cos(p.th),
      p.r * sin(p.th)
    )
  }
, interpolate = function(x, p1, p2) { // Linear
    if (!p1) { return xy(p2.x, p2.y); }
    if (!p2) { return xy(p1.x, p1.y); }
    if (p1.x === p2.x) { return xy(p1.x, p2.y); }

    var f = (x - p1.x) / (p2.x - p1.x);
    return xy(x, p1.y + f*(p2.y - p1.y));
  }
, roundTo = function(x, n) {
    return Math.round(x / n) * n;
  }
, floorTo = function(x, n) {
    return Math.floor(x / n) * n;
  }
, ceilTo = function(x, n) {
    return Math.ceil(x / n) * n;
  }
, bounds = function(x, bounds) {
    return max(min(x, max.apply(null, bounds)), min.apply(null, bounds));
  }

// other stuff...
, resetify = function(item) { if (item.reset) item.reset(); }
, tickity = function(item) { if (item.tick) item.tick(); }
, drawity = function(item) { if (item.draw) item.draw(); }

, null_function = function() {}

;