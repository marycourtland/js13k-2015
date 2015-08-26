// ENVIRONMENT =======================================================
var environment = {
  ground: new Platform(xy(-100, 3), 0.5, [-100, 1000], {}),

  // Height
  pts: [],
  buildings: [], // Buildings represented by [x, width, height]


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
    // (subtract 0.5 so that there's no gap betw ground and building. `temp)=
    this.buildings.forEach(function(building) {
      var x1 = building.x - building.w/2;
      var x2 = building.x + building.w/2;
      var y0 = min(environment.ground.pointAt(x1).y, environment.ground.pointAt(x2).y);
      draw.r(ctx,
        xy(x1, y0 - 0.5),
        xy(x2, y0 + building.h),
        draw.shapeStyle(building_color)
      )
    })
  },


  tick: function() {},

  draw: function() {
    // Ground
    var fill = draw.shapeStyle(environment_color);
    draw.p(ctx, this.pts, fill);
  },

  generate: function() {
    this.pts.push(xy(this.ground.xrange[0], 0));
    var terrain = this.generateTerrainFunction();
    for (var x = this.ground.xrange[0]; x < this.ground.xrange[1]; x += this.ground.xres) {

      this.ground.y[x] = this.ground.y0 + terrain(x);
      this.pts.push(xy(x, this.ground.y[x]));
    }
    this.pts.push(xy(this.ground.xrange[1],0));

    for (var i = 0; i < num_building_clumps; i++) {
      console.log('generate #' + i);
      this.generateBuildingClump();
    }
  },

  generateBuildingClump: function() {
    var x0 = rnds.apply(wnd, this.ground.xrange);
    var n = num_buildings_per_clump + rnds(-3, 3);

    for (var i = 0; i < n; i++) {
      this.buildings.push({
        x: rnds(x0 - building_clump_width/2, x0 + building_clump_width/2),
        w: rnds(4, 7),
        h: rnds(5, 20)
      })

    }
  },

  generateTerrainFunction: function() {
    var frequencies = [];
    for (var i = 0; i < 10; i++) {
      frequencies.push(1/rnds(1, 5));
    }

    // some lower-frequency rolling
    frequencies.push(1/rnds(10, 12));

    return function(x) {
      var y = 0;
      frequencies.forEach(function(f) {
        y += 1/(f * 100) * sin(f*x + rnds(0, 0.5));
      })
      return y;
    }

  }
}
