
// HTML ==============================================================
var wnd = window
, doc = document
, $ = function () { return doc.querySelector.apply(doc, arguments); }



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
, probability = function(n) { return rnd() < n; }
, vec_add = function(p1, p2) {
    return xy(p1.x + p2.x, p1.y + p2.y)
  }
, polar2cart = function(p) {
  debug("COORDS:", p.r, p.th, cos(p.th), sin(p.th))
  return xy(
    p.r * cos(p.th),
    p.r * sin(p.th)
  )
}

// other stuff...
, tickity = function(item) { if (item.tick) item.tick(); }
, drawity = function(item) { if (item.draw) item.draw(); }

 
;