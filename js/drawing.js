// All 2d points should be input as {x:xval, y:yval}

var draw = {
  // Utility method - apply params only for a particular drawing
  do: function(ctx, params, draw_function) {
    params = params || {};
    ctx.save();
    for (var p in params) { ctx[p] = params[p]; }
    ctx.beginPath();
    draw_function();
    if (params.cls) { ctx.closePath(); }
    if (params.fll) { ctx.fill(); }
    if (params.strk) { ctx.stroke(); }
    ctx.restore();
  },

  shapeStyle: function(color, extra) {
    var output = {fillStyle: color, strk: 0, fll: 1, cls: 1};
    for (var s in extra) { output[s] = extra[s]; };
    return output;
  },

  lineStyle: function(color, extra) {
    var output = {strokeStyle: color, strk: 1, fll: 0, cls: 0, lineWidth: 0.1};
    for (var s in extra) { output[s] = extra[s]; };
    return output;
  },

  // Clear
  clr: function(ctx, p0, p1) {
    p0 = p0 || xy(0, 0);
    p1 = p1 || xy(ctx.canvas.width, ctx.canvas.height);
    ctx.clearRect(p0.x, p0.y, p1.x - p0.x, p1.y - p0.y);
  },

  // Fill
  f: function(ctx, params) {
    params = params || this.shapeStyle("#fff");
    this.do(ctx, params, function() {
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    })
  },

  // Line
  l: function(ctx, p0, p1, params) {
    params = params || this.lineStyle("#fff");
    this.do(ctx, params, function() {
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.moveTo(p1.x, p1.y);
    })
  },

  // Rectangle
  r: function(ctx, p0, p1, params) {
    params = params || this.shapeStyle("#fff");
    this.do(ctx, params, function() {
      ctx.rect(p0.x, p0.y, p1.x-p0.x, p1.y-p0.y);
    })
  },

  // Circle
  c: function(ctx, center, radius, params) {
    this.a(ctx, center, radius, 0, 2*Math.PI, params);
  },

  // Arc
  a: function(ctx, center, radius, angle1, angle2, params) {
    params = params || this.lineStyle("#fff");
    this.do(ctx, params, function() {
      ctx.arc(center.x, center.y, radius, angle1, angle2, false);
    })
  },

  // Bezier
  b: function(ctx, p0, p1, c0, c1, params) {
    params = params || this.lineStyle("#fff");
    this.do(ctx, params, function() {
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(c0.x, c0.y, c1.x, c1.y, p1.x, p1.y);
    });
  },

  // Polygon
  // `todo convert pts to xy rather than array
  p: function(ctx, pts, params) {
    params = params || this.lineStyle("#fff");
    this.do(ctx, params, function() {
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach(function(p) {
        ctx.lineTo(p.x, p.y);
      })
    })
  }
}