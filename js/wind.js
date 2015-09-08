global.wind = {
  lattice: {},
  nonzero_points: [],
  zero_tolerance: 0.001,

  tick: function() {
    var deletes = [];
    for (var i = 0; i < this.nonzero_points; i++) { console.log('HIII!!');
      var p = this.nonzero_points[i];
      var v = this.lattice[p.x][p.y];

      // Wind decays a bit
      console.log(v.r);
      v.r *= 0.9;
      console.log('     ', v.r);

      if (v.r < this.zero_tolerance) {
        v.r = 0;
        v.th = 0;
        deletes.push(i);
      }
    }
    for (var i = deletes.length - 1; i >= 0; i++) {
      this.nonzero_points.splice(i, 1);
    }
  },

  draw: function() {
    this.iter(function(p, v) {
      // Only draw the ones in view right now (haha)
      if (p.x < game_origin.x || p.x > (game_origin.x + game_size.x) || p.y > 20 || p.y < environment.ground.y0) { return; }
      draw.c(stage.ctx, p, 0.05, draw.shapeStyle(awesome_glow_color));
      if (v.r > 0) {
        var vxy = polar2cart(v);
        draw.l(stage.ctx, p, vec_add(p, vxy), draw.lineStyle(awesome_glow_color, {lineWidth:0.08}));
      }
    })
  },

  // `crunch: might not needs this if we always use nonzero_points array
  iter: function(cb) {
    for (var x in this.lattice) {
      for (var y = 0; y < this.lattice[x].length; y++) {
        cb(xy(parseInt(x), y), this.lattice[x][y]);
      }
    }
  },

  gust: function(p, v) {
    // WARNING: extreme laziness ahead. (Nonstandard vector addition)
    var v0 = this.lattice[p.x][p.y];
    v0.r += v.r;
    v0.th += v.th;
    this.nonzero_points.push(p);
  }
}

// Initialize the lattice
for (var x = world_size[0]; x < world_size[1]; x ++) {
  wind.lattice[x] = range(0, game_size.y, 1).map(function(y) { return rth(0, 0); });
}