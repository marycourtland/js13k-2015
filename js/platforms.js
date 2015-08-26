var Platform = function(origin, xres, xrange, ypoints) {
  this.origin = origin; // this is an xy position
  this.y0 = origin.y;
  this.xres = xres;
  this.xres_offset = xrange[0] % xres;
  this.xrange = xrange;
  this.y = ypoints;

  this.yAt = function(x) {
    return this.pointAt(x).y;
  }

  this.pointAt = function(x) {
    x = bounds(x, [this.xrange[0], this.xrange[1]]);
    var x1 = floorTo(x - this.xres_offset, this.xres) + this.xres_offset;
    var x2 = ceilTo(x - this.xres_offset, this.xres) + this.xres_offset;
    return interpolate(x,
      xy(x1, this.y[x1]),
      xy(x2, this.y[x2])
    );
  };

  this.getPolygon = function(thickness) {
    var pts = [];
    pts.push(xy(this.xrange[0], this.y0 - thickness));
    for (var x = this.xrange[0]; x <= this.xrange[1]; x += this.xres) {
      pts.push(xy(x, this.y[x]));
    }
    pts.push(xy(this.xrange[1], this.y0 - thickness));
    return pts;
  };

  this.pts = this.getPolygon(6);

  this.drawRepr = function(style) {
    draw.p(ctx, this.pts, style);
  }
};

// Make a simple two-point platform
function makePlatform(origin, x_extent) {
  var y = {};
  y[origin.x] = origin.y;
  y[origin.x + x_extent] = origin.y;
  return new Platform(origin, x_extent, [origin.x, origin.x + x_extent], y);
}