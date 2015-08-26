// LIGHTNING  ========================================================
// `experiment
lightning = {
  timeleft: -1,
  pts: [[]],
  tick: function() {
    if (this.timeleft >= 0) {
      this.timeleft -= 1;
    }

    if (probability(lightning_chance)) { this.strike(); }
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
  redraw: function() {
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
  strike: function() {
    this.redraw();
    this.timeleft = rnds(10, 50);
  }
}