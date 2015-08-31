// LIGHTNING  ========================================================
// `experiment
lightning = {
  timeleft: -1,
  target: null,
  pts: [],
  onFinish: null,

  reset: function() {
    if (this.target) {
      this.target.skip_tick = true; // freeze the object for the duration of the lightning strike
    }
  },

  tick: function() {
    if (this.timeleft >= 0) {
      this.timeleft -= 1;
    }
    else {
      this.target = null;
      if (typeof this.onFinish === 'function') { this.onFinish(); this.onFinish = null; }
    }

    if (probability(lightning_chance)) {
      probability(lightning_chance_drone) ? this.strikeDrone() : this.strike();
    }
  },

  draw: function() {
    if (this.timeleft < 0) { return; }
    var glowdata = [
      // color, linewidth, alpha
      ['#aaf', 0.5, 0.05],
      ['#aaf', 0.3, 0.05],
      ['#aaf', 0.1, 0.5],
      ['#ccf', 0.05, 1]
    ];
    var pts = this.pts;
    glowdata.forEach(function(data) {
      draw.p(ctx, pts, draw.lineStyle(data[0], {lineWidth: data[1], globalAlpha: data[2]}))
    })
  },

  // original algorithm - random walk
  // `nb - this is not used anymore! So I guess it's `temp
  regenerate_randomwalk: function() {
    // Pick an origin point in the sky and random walk downwards
    var x = rnds(game_size.x + origin.x), y = game_size.y;
    this.pts = [xy(x, y)];
    var p = 0;
    while (y > environment.ground.yAt(x)) {
      x += rnds(-0.4, 0.4);
      y -= rnds(0.5, 1);
      this.pts.push(xy(x, y));
    }
  },

  strikeDrone: function() {
    this.target = Player.drone;
    this.strike(Player.drone.p_drawn);
    var old_drone_color = Player.drone.color;
    Player.drone.color = '#bbf';
    this.onFinish = function() {
      Player.drone.color = old_drone_color;
      console.debug('Done');
    }
  },

  strike: function(target_pos) {
    if (!target_pos) {
      var x = rnds(game_size.x + origin.x)
      target_pos = environment.ground.pointAt(x);
    }
    var origin_pos = xy(target_pos.x + rnds(-5, 5), game_size.y)

    this.regenerate(origin_pos, target_pos);
    this.timeleft = rnds(10, 50);
  },

  // NEW ALGORITHM
  regenerate: function(origin, dest) {
    var seg0 = {p1: origin, p2: dest, children: []};
    this.populateSegmentChildren(seg0, 6);
    this.pts = this.getPoints(seg0);
    this.pts.push(seg0.p2);
    this.seg = seg0;
  },

  populateSegmentChildren: function(seg, iterations) {
    iterations = iterations || 0;
    if (iterations < 0) { return seg; }

    var d = dist(seg.p1, seg.p2);
    midpt_offset = rth(d * rnds(0.07, 0.1), Math.asin(( seg.p2.x - seg.p1.x)/d));
    if (rnd() < 0.5) { midpt_offset.r *= -1; }
    midpt_offset.th += rnds(-pi/4, pi/4);
    midpt_offset = polar2cart(midpt_offset);

    var perturbed_midpoint = xy(seg.p1.x + (seg.p2.x - seg.p1.x) * rnds(0.3, 0.7), seg.p1.y + (seg.p2.y - seg.p1.y) * rnds(0.3, 0.7));
    var midpt = vec_add(
      perturbed_midpoint,
      midpt_offset
    );
    
    var child1 = {
      p1: seg.p1,
      p2: midpt,
      children: []
    };

    var child2 = {
      p1: midpt,
      p2: seg.p2,
      children: []
    };

    this.populateSegmentChildren(child1, iterations - 1);
    this.populateSegmentChildren(child2, iterations - 1);

    seg.children.push(child1);
    seg.children.push(child2);
  },

  getPoints: function(seg) {
    if (seg.children.length === 0) { return [seg.p1]; } // p2 is shared with the next segment
    var pts = this.getPoints(seg.children[0]);
    return pts.concat(this.getPoints(seg.children[1]));
  }

}