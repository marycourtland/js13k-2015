// ENVIRONMENT =======================================================
var environment = {
  xrange: [-100, 1000],
  xres: 0.5,

  // Height
  y0: 3,
  y: {},
  pts: [],
  buildings: [], // Buildings represented by [x, width, height]

  yAt: function(x) {
    return this.y + (x in dy ? dy[x] : 0);
  },


  // Game loop

  reset: function() {
    // Background
    // (even though this is drawing-related, it needs to come before anything else)
    var grd = ctx.createLinearGradient(0, 0, 0, game_size.y);
    backgroundGradient.forEach(function(params) {
      grd.addColorStop.apply(grd, params);
    })
    draw.r(ctx, origin, xy(origin.x + game_size.x, origin.y + game_size.y), draw.shapeStyle(grd));

    // Draw buildings (decorative only for now)
    // (subtract 0.5 so that there's no gap betw ground and building. `temp)
    y0 = this.y0;
    this.buildings.forEach(function(building) {
      draw.r(ctx,
        xy(building.x - building.w/2, y0 - 0.5),
        xy(building.x + building.w/2, y0 + building.h),
        draw.shapeStyle(building_color)
      )
    })
  },


  tick: function() {},

  draw: function() {
    // Ground
    var fill = draw.shapeStyle(environment_color);
    draw.p(ctx, this.pts, fill);
    // draw.r(ctx, xy(-100,0), xy(100, 3), fill);
  },

  generate: function() {
    this.pts.push([this.xrange[0], 0]);
    for (var x = this.xrange[0]; x < this.xrange[1]; x += this.xres) {
      this.y[x] = this.y0 + rnds(0.2);
      this.pts.push([x, this.y[x]]);
    }
    this.pts.push([this.xrange[1],0]);

    for (var i = 0; i < num_building_clumps; i++) {
      console.log('generate #' + i);
      this.generateBuildingClump();
    }
  },

  generateBuildingClump: function() {
    var x0 = rnds.apply(wnd, this.xrange);
    var n = num_buildings_per_clump + rnds(-3, 3);

    for (var i = 0; i < n; i++) {
      this.buildings.push({
        x: rnds(x0 - building_clump_width/2, x0 + building_clump_width/2),
        w: rnds(4, 7),
        h: rnds(5, 20)
      })

    }
  }
}
