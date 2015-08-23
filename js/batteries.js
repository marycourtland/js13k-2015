// BATTERIES ============================================================

function Battery(loc) {
  this.item = new Item(loc);
  this.p = loc;

  // tick is performed by item object

  this.draw = function() {
    this.drawRepr(this.p, 1, draw.shapeStyle(battery_color));
  }

  this.use = function() {
    // Batteries get used by the drone
    // `todo (when energy stuff is implemented): fill drone battery level
    if (dist(this.p, Player.drone.p) > interaction_distance) { return; }
    loopDestroy(this);
    if (this.container) this.container.drop();
    Player.drone.fillEnergy();
  },

  this.drawRepr = function(p, scale, fill) {
    var radius = scale * battery_size.x / 2;
    var height = scale * battery_size.y;

    draw.r(ctx,
      // `crunch
      {x: p.x - radius, y: p.y},
      {x: p.x + radius, y: p.y + height},
      fill
    );

    // bumps to suggest battery terminals
    [-0.2, 0.05].forEach(function(x) {
      x *= scale;
      draw.r(ctx,
        // `crunch
        {x: p.x + x, y: p.y + height},
        {x: p.x + x + 0.15 * scale, y: p.y + height + 0.1 * scale},
        fill
      );  
    })
  }
}
Battery.prototype = new Item();
