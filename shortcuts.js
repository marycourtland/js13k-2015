
// HTML ==============================================================
var wnd = window
, doc = document
, $ = function () { return doc.querySelector.apply(doc, arguments); }



// Math ==============================================================
, pi = Math.PI
, xy = function(x, y) { return {x:x, y:y}; }
, dist = function(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }
, rnd = Math.random
, rnds = function(a, b) {
  if (typeof b === 'undefined') { b = a; a = 0; }
    return a + rnd() * (b - a);
  }
,   p = function(n) { return rnd() < n; }


// stuff...
, tickity = function(item) { if (item.tick) item.tick(); }
, drawity = function(item) { if (item.draw) item.draw(); }

;