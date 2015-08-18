// PEOPLE ============================================================

function Person(loc) {
  this.p = loc;
  this.color = person_color;
  this.drone_distance = null; // only relevant when person is within the interaction window
  this.inventory_item = null; // each person can only hold 1 thing at a time

  this.behaviors = {
    idle: function(start) {
      // do nothing
      if (start) { this.v = xy(0, 0); }
      return;
    },

    amble: function(start) {
      if (Player.drone.person === this) { return; }
      // Set a new velocity
      if (start) { this.v = xy(rnds(-1, 1) / 20, 0); }
    }
  }

  this.switchBehavior = function(new_behavior) {
    if (!new_behavior) {
      // Switch between walking and idle
      new_behavior = this.current_behavior === 'amble' ? 'idle' : 'amble'
    }
    // For now, choose another behavior at random
    this.current_behavior = new_behavior 
    this.current_behavior_timeleft = rnds(50, 100);
  };
  
  this.tick = function() {
    this.__proto__.tick.apply(this);
    if (abs(Player.drone.p.x - this.p.x) < person_interaction_window) {
      close_people_per_tick.push(this);
      this.drone_distance = dist(this.p, Player.drone.p);
    }
  }

  this.draw = function() {
    // `CRUNCH
    var fill = draw.shapeStyle(this.color);
    var radius = person_size.x/3;
    var x1_offset_scale = this.v.x < 0 ? 1/3 : 1/2;
    var x2_offset_scale = this.v.x > 0 ? 1/3 : 1/2;


    var x1 = this.v.x < 0 ? this.p.x : this.p.x - person_size.x/2;
    var x2 = this.v.x > 0 ? this.p.x : this.p.x + person_size.x/2;

    draw.r(ctx,
      // `crunch 
      xy(this.p.x - person_size.x * x1_offset_scale, this.p.y),
      xy(this.p.x + person_size.x * x2_offset_scale, this.p.y + person_size.y - radius),
      fill
    );

    draw.c(ctx,
      xy(this.p.x, this.p.y + person_size.y - radius),
      radius,
      fill
    );

    draw.c(ctx,
      xy(this.p.x, this.p.y + person_size.y + radius),
      radius,
      fill
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
Person.prototype = new Actor();