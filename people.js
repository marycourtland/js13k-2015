// PEOPLE ============================================================

function Person(loc) {
  this.actor = new Actor(loc);

  this.tick = function() { tickity(this.actor); }

  this.draw = function() {
    draw.r(ctx,
      // `crunch 
      {x: this.actor.p.x - person_size.x/2, y: this.actor.p.y},
      {x: this.actor.p.x + person_size.x/2, y: this.actor.p.y + person_size.y},
      draw.shapeStyle('#000')
    );
  }
}
