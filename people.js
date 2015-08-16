// PEOPLE ============================================================

function Person(loc) {
  this.p = loc;
  this.color = person_color;
  this.drone_distance = null; // only relevant when person is within the interaction window
  this.inventory_item = null; // each person can only hold 1 thing at a time

  this.tick = function() {
    tickity(this.__proto__);
    if (abs(Player.drone.p.x - this.p.x) < person_interaction_window) {
      close_people_per_tick.push(this);
      this.drone_distance = dist(this.p, Player.drone.p);
    }
  }

  this.draw = function() {
    draw.r(ctx,
      // `crunch 
      {x: this.p.x - person_size.x/2, y: this.p.y},
      {x: this.p.x + person_size.x/2, y: this.p.y + person_size.y},
      draw.shapeStyle(this.color)
    );
  }

  this.hold = function(item) {
    this.inventory_item = item;
    item.container = this;
  }


  this.drop = function() {
    if (!this.inventory_item) return;
    this.inventory_item.p.y = environment.y0;
    this.inventory_item.container = null;
    this.inventory_item = null;
  }

  this.itemInteract = function() {
    // `todo: search for nearby items (instead of using the sample battery)
    if (this.inventory_item) {
      this.drop();
    }
    else {
      var closeItem = this.getClosestItem();
      if (closeItem && dist(this.p, closeItem.p) < interaction_distance) {
        this.hold(closeItem);
      }
    }
  }

  this.useItem = function() {
    if (!this.inventory_item) { return; }
    this.inventory_item.use();
  }

  // `crunch `crunch `crunch - this method is basically the same as drone.getClosestPerson
  this.getClosestItem = function() {
    if (close_items_per_tick.length === 0) { return null; }
    return close_items_per_tick.reduce(function(closestItem, nextItem) {
      return (nextItem.person_distance < closestItem.person_distance ? nextItem : closestItem);
    }, {person_distance:9999});
  }
}
Person.protoype = new Actor();