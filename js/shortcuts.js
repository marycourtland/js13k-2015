// `crunch: audit these for unused or underused functions

// HTML ==============================================================
var global = window
, doc = document
, $ = function () { return doc.querySelector.apply(doc, arguments); }
, reqAnimFrame = global.requestAnimationFrame || global.mozRequestAnimationFrame
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
, midpoint = function(p1, p2) {
    return xy(p1.x + (p2.x - p1.x)/2, p1.y + (p2.y - p1.y)/2);
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
    return xy(p1.x + p2.x, p1.y + p2.y);
  }
, vec_subtract = function(p1, p2) {
  // `todo `crunch: not sure if i'll use this function more than once
  return xy(p1.x - p2.x, p1.y - p2.y);
}
, vec_dot = function(p1, p2) {
    // `CRUNCH: there's a lot of stuff that could make use of this
    return xy(p1.x * p2.x, p1.y * p2.y);
  }
, scale = function(p, s) {
    return xy(p.x * s, p.y * s);
  }
, polar2cart = function(p) {
    return xy(
      p.r * cos(p.th),
      p.r * sin(p.th)
    )
  }
, cart2polar = function(p) { // `crunch not sure this is being used
    return rth(
      Math.sqrt(p.x*p.x + p.y*p.y),
      Math.atan2(p.y, p.x)
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
, vcopy = function(p) {
    return xy(p.x, p.y);
  }

  // `crunch: maybe elsewhere in the code could use this
, range = function(start, end, skip) {
    skip = skip || 1;
    var output_range = [];
    for (var i = start; i < end; i += skip) {
      output_range.push(i);
    }
    return output_range;
  }
, perturb = function(value, amount) {
    return value + rnds(-amount, amount);
  }

// other stuff...
, resetify = function(item) { if (item.reset) item.reset(); }
, tickity = function(item) { if (item.tick && !item.skip_tick) item.tick(); }
, drawity = function(item) { if (item.draw) item.draw(); }

, null_function = function() {}

;