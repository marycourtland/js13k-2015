// ENVIRONMENT =======================================================
var environment = {
  xrange: [-100, 100],
  xres: 0.5,

  // Height
  y: {},
  pts: [],

  yAt: function(x) {
    return this.y + (x in dy ? dy[x] : 0);
  },


  // Game loop

  tick: function() {},

  draw: function() {
    // Background
    var grd = ctx.createLinearGradient(0, 0, 0, game_size.y);
    backgroundGradient.forEach(function(params) {
      grd.addColorStop.apply(grd, params);
    })
    draw.r(ctx, origin, xy(origin.x + game_size.x, origin.y + game_size.y), draw.shapeStyle(grd));

    // Ground
    var fill = draw.shapeStyle(environment_color);
    draw.p(ctx, this.pts, fill);
    // draw.r(ctx, xy(-100,0), xy(100, 3), fill);
  },

  generate: function() {
    this.pts.push([this.xrange[0], 0]);
    for (var x = this.xrange[0]; x < this.xrange[1]; x += this.xres) {
      this.y[x] = rnds(2.7, 3.3);
      this.pts.push([x, this.y[x]]);
    }
    this.pts.push([this.xrange[1],0]);
  }
}
