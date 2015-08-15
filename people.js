// PEOPLE ============================================================

function Person(loc) {
  this.actor = new Actor(loc);
  this.color = person_color;
  this.drone_distance = null; // only relevant when person is within the interaction window
  this.inventory_item = null; // each person can only hold 1 thing at a time

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

  this.hold = function(item) {
    this.inventory_item = item;
    item.item.heldBy = this;
  }

  this.drop = function() {
    this.inventory_item.item.heldBy = null;
    this.inventory_item = null;
    // `todo: make sure item falls to ground
  }

  this.itemInteract = function() {
    // `todo: search for nearby items (instead of using the sample battery)
    this.inventory_item ? this.drop() : this.hold(sample_battery);
  }
}
