var Bullet = function(p, dir) {
  this.p = p;
  this.v = polar2cart(rth(bullet_speed, dir));

  this.tick = function() {
    this.__proto__.tick.apply(this);
    if (dist(this.p, Player.drone.p_drawn) < bullet_hit_distance) { this.onHit(); }
    if (this.p.y < 0 || this.p.y > game_size.y) {
      loopDestroy(this);
    }
  }

  this.draw = function() {
    draw.c(stage.ctx, this.p, bullet_radius, draw.shapeStyle(bullet_color));
  }

  this.onHit = function() {
    loopDestroy(this);
    Player.drone.dockIntegrity(bullet_integrity_decrease);
    // `todo: show feedback - drone color change, integrity health bar color change
  }
}

Bullet.prototype = new Actor();

