// ITEMS ============================================================
// ** Parent object
// ** container must be an actor

function Item(loc) {
  this.p = loc;
  this.container = null;
  this.person_distance = null;
}

Item.prototype.tick = function() {
  if (this.container) {
    this.p = vec_add(this.container.p, xy(0.45, 0.2));
  }
  else if (Player.drone.person) {
    // `crunch. This is basically the same as the person/drone stuff in people.js
    if (abs(Player.drone.person.p.x - this.p.x) < person_interaction_window) {
      close_items_per_tick.push(this);
      this.person_distance = dist(this.p, Player.drone.person.p);
    }      
  }
  
}
