// PEOPLE ============================================================

function Person(loc) {
  this.actor = new Actor(loc);
  this.color = person_color;
  this.drone_distance = null; // only relevant when person is within the interaction window

  this.tick = function() {
    tickity(this.actor);
    if (abs(Drone.actor.p.x - this.actor.p.x) < person_interaction_window) {
      close_people_per_tick.push(this);
      this.drone_distance = dist(this.actor.p, Drone.actor.p);
    }
  }

  this.draw = function() {
    draw.r(ctx,
      // `crunch 
      {x: this.actor.p.x - person_size.x/2, y: this.actor.p.y},
      {x: this.actor.p.x + person_size.x/2, y: this.actor.p.y + person_size.y},
      draw.shapeStyle(this.color)
    );
  }
}
