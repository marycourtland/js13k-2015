
// HTML ==============================================================
var wnd = window
,   doc = document
,   $ = function () { return doc.querySelector.apply(doc, arguments); }



// Math ==============================================================
,   xy = function(x, y) { return {x:x, y:y}; }
,   rnd = Math.random
,   rnds = function(a, b) {
      if (typeof b === 'undefined') { b = a; a = 0; }
      return a + rnd() * (b - a);
    }


// stuff...
,  tickity = function(item) { if (item.tick) item.tick(); }
,  drawity = function(item) { if (item.draw) item.draw(); }

;