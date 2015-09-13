// ENVIRONMENT =======================================================
var environment = {
  ground: new Platform(xy(world_size[0], 4), 1, world_size, {}),

  pts: [],
  towers: [], // Towers in the background skyline represented by [x, width, height]
  buildings: [], // buildings in the foreground which hold people

  redraw_bg: false,

  // Game loop

  reset: function() {
    stage.clear();
    overlay.clear();
    windlayer.clearPartial(0.95);


    if (this.redraw_bg || gameplay_frame === 0) {
      bg2.clear();

      // Background
      // (even though this is drawing-related, it needs to come before anything else)
      var grd = bg1.ctx.createLinearGradient(0, 0, 0, bg1.size.y * 1.2);
      backgroundGradient.forEach(function(params) {
        grd.addColorStop.apply(grd, params);
      })
      draw.r(bg1.ctx, bg1.origin, xy(bg1.origin.x + bg1.size.x, bg1.origin.y + bg1.size.y), draw.shapeStyle(grd));

      // Draw towers (decorative only for now)
      // (subtract 0.5 so that there's no gap betw ground and tower. `temp)
      this.towers.forEach(this.drawTower);
    }

    this.redraw_bg = false;
  },


  tick: function() {},

  draw: function() {
    // Ground
    var fill = draw.shapeStyle(environment_color);
    draw.p(stage.ctx, this.pts, fill);

    this.drawBoundaryFog();
  },

  drawBoundaryFog: function() {
    var p1 = xy(world_size[0] - 50, 0),
        p2 = xy(world_size[0] + 50, game_size.y),
        p3 = xy(world_size[1] + 50, 0),
        p4 = xy(world_size[1] - 50, game_size.y);
    var grd1 = stage.ctx.createLinearGradient(p1.x, 0, p2.x, 0);
    var grd2 = stage.ctx.createLinearGradient(p3.x, 0, p4.x, 0);
    grd1.addColorStop(0.5, 'white');
    grd1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    grd2.addColorStop(0.5, 'white');
    grd2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    draw.r(stage.ctx, p1, p2, draw.shapeStyle(grd1));
    draw.r(stage.ctx, p3, p4, draw.shapeStyle(grd2));
  },

  drawTower: function(tower) {
    var x1 = tower.x - tower.w/2;
    var x2 = tower.x + tower.w/2;
    var y0 = min(environment.ground.pointAt(x1).y, environment.ground.pointAt(x2).y);
    var fill = draw.shapeStyle(tower.color);
    draw.r(tower.ctx,
      xy(x1, y0 - 0.5),
      xy(x2, y0 + tower.h),
      fill
    )
    if (tower.dome) {
      draw.c(tower.ctx,
        xy(tower.x, y0 + tower.h),
        tower.w/2 * 0.8,
        fill
      )
    }
    if (tower.slant) {
      var h = y0 + tower.h - 0.1;
      var r1 = 0.9 * tower.w/2;
      var r2 = r1 * tower.slant_ratio;
      var p0 = xy(tower.x, y0 + tower.h)

      draw.p(tower.ctx,
        [
          xy(tower.x - r1, h),
          xy(tower.x + r1, h),
          xy(tower.x, h + r2),
        ],
        fill
      )
    }
  },

  generate: function() {
    this.pts.push(xy(this.ground.xrange[0], 0));
    var terrain = this.generateTerrainFunction();
    for (var x = this.ground.xrange[0]; x < this.ground.xrange[1]; x += this.ground.xres) {

      this.ground.y[x] = this.ground.y0 + terrain(x);
      this.pts.push(xy(x, this.ground.y[x]));
    }
    this.pts.push(xy(this.ground.xrange[1],0));

    for (var i = 0; i < num_tower_clumps; i++) {
      this.generateTowerClump();
    }

    this.generatePeopleBuildings();
  },

  generateTowerClump: function() {
    var x0 = rnds.apply(global, tower_range);
    var n = num_towers_per_clump + rnds(-3, 3);

    for (var i = 0; i < n; i++) {
      var t = {
        x: rnds(x0 - tower_clump_width/2, x0 + tower_clump_width/2),
        w: rnds(4, 7),
        h: rnds(5, 22),
        ctx: rnd_choice([bg1.ctx, bg2.ctx])
      };
      t.slant = probability(tower_dome_probability);
      if (t.slant) { t.slant_ratio = rnds(1.2, 1.5); }
      t.dome = !t.slant && probability(tower_slant_probability);
      t.ctx = (t.h > 18) ? bg1.ctx : bg2.ctx;
      t.color = (t.h > 18) ? tower_color1 : tower_color2;

      this.towers.push(t);
    }
  },

  generateTerrainFunction: function() {
    var mfp = function(m, f, p) { return {m:m, f:f, p:p}; } // magnitude, frequency, phase
    var frequencies = [];
    for (var i = 0; i < 10; i++) {
      var f = 1/rnds(1, 5);
      frequencies.push(mfp(f, 1/(f*100), rnds(0, 100)));
    }

    // some lower-frequency rolling
    for (var i = 0; i < 10; i++) {
      var f = 1/rnds(20, 40);
      frequencies.push(mfp(f, 1/(f*100), rnds(0, 100)));
    }

    return function(x) {
      var y = 0;
      frequencies.forEach(function(f) {
        y += f.m * sin(f.f*x + f.p + rnds(0, 0.05));
      })
      return y;
    }

  },

  // `crunch
  generatePeopleBuildings: function() {
    var num_people = person_frequency * (world_size[1] - world_size[0]);
    var num_buildings = num_people / avg_people_per_building;
    var avg_building_spacing = (world_size[1] - world_size[0]) / num_buildings;

    // building positions should be evenly distributed
    // ... but perturbed a little bit
    // Also, don't generate a building in the vicinity of the drone spawn
    var buildings = range(game_size.x * 2, world_size[1] - world_buffer, avg_building_spacing)
      .forEach(function(pos) {
        var b = new Building(
          perturb(pos, 10),
          xy(perturb(10, 4), perturb(12, 4))  // `temp size. it should depend on number of people
        );
        b.peopleCounts = {normal: avg_people_per_building};
        environment.buildings.push(b);
      })
  }
}
