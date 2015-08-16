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
    draw.p(ctx, this.pts, draw.lineStyle('#fff'))
  },
  redraw: function() {
    // Pick an origin point in the sky and random walk downwards
    var x = rnds(game_size.x + origin.x), y = game_size.y;
    this.pts = [[x, y]];
    var p = 0;
    while (y > 0) {
      x += rnds(-0.4, 0.4);
      y -= rnds(0.5, 1);
      this.pts.push([x, y]);
    }
  },
  strike: function() {
    this.redraw();
    this.timeleft = rnds(10, 50);
  }
}