// THE DRONE =========================================================

var Drone = {
  actor: new Actor(xy(6, 20)),
  draw: function() {
    draw.r(ctx,
      // `crunch
      {x: this.actor.p.x - drone_size.x/2, y: this.actor.p.y - drone_size.y/2},
      {x: this.actor.p.x + drone_size.x/2, y: this.actor.p.y + drone_size.y/2},
      draw.shapeStyle('#000')
    );
  }
}