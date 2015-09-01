// PEOPLE ============================================================

function Person() {
  var ctx = stage.ctx;
  this.p = xy(0, 0);
  this.color = person_color;
  this.drone_distance = null; // only relevant when person is within the interaction window
  this.inventory_item = null; // each person can only hold 1 thing at a time
  this.resistance = rnd();
  this.control_level = 0;     // the person is fully controlled when this exceeds the resistance measure
  this.talking_dir = 0;
  this.stay_on_platform = true;
  this.role = roles.normal;
  this.hidden = false;

  this.init = function(properties) {
    for (var prop in properties) {
      this[prop] = properties[prop];
    }

    this.addIdea(global.ideas.smalltalk);

    return this;
  }


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
    },

    talk: function(start) {
      var target_person = this.current_behavior_params.person;
      if (!target_person) return;

      var d = target_person.p.x - this.p.x;

      if (abs(d) > interaction_distance) {
        // move toward target person
        this.v = xy(0.5/20, 0);
        if (d < 0) { this.v.x *= -1; }

        // delay starting the countdown until the person has been reached
        this.current_behavior_timeleft += 1;
      }
      else {
        // talk to the person
        this.v = xy(0, 0);
        this.talking_dir = abs(d)/d;
        this.talking_idea = this.latest_idea;
        target_person.addIdea(this.talking_idea);
      }
    }
  }

  this.switchBehavior = function(new_behavior) {
    if (!new_behavior) {
      // Switch between walking and idle
      new_behavior = 'idle';
      //new_behavior = this.current_behavior === 'amble' ? 'idle' : 'amble'
    }
    // For now, choose another behavior at random
    this.current_behavior = new_behavior;
    this.current_behavior_timeleft = rnds(50, 100);
  };

  this.talkTo = function(person) {
    this.current_behavior_params = {person: person};
    this.switchBehavior('talk');
  };

  this.talkToClosestPerson = function() {
    this.talkTo(this.getClosestPerson());
  }


  // `crunch `crunch `crunch - this method is basically the same as all the other 'getClosestX' functions
  // maybe put it in the Actor
  this.getClosestPerson = function() {
    // `todo `todo `todo!
    return global.p3;
  }

  // Roles ======================================================

  this.byRole = function(method) {
    if (!(method in this.role)) { console.warn('Uh oh, person role does not have method:', method); return; }
    this.role[method].apply(this);
  }


  // Game loop / drawing ========================================

  this.reset = function() {
    this.talking_dir = 0;

    this.drone_distance = null;
    if (abs(Player.drone.p.x - this.p.x) < person_interaction_window) {
      close_people_per_tick.push(this);
      this.drone_distance = dist(this.p, Player.drone.p);
    }
  }

  this.tick = function() {
    this.__proto__.tick.apply(this);

    if (this.control_level < this.resistance && this.control_level > 0) {
      // Decay the control level
      this.control_level -= person_control_rate;
      this.control_level = max(this.control_level, 0);
    }
    this.byRole('tick');
  }

  this.draw = function() {
    if (this.hidden) { return; }

    var dir = this.v.x;
    this.drawRepr(this.p, 1.3, draw.shapeStyle(drone_signal_color, {globalAlpha: this.control_level * Player.drone.controlStrength(this)}), dir);
    this.drawRepr(this.p, 1, draw.shapeStyle(this.color), dir);

    if (this.talking_dir !== 0) {
      this.drawSpeechSquiggles(this.talking_dir);
      this.talking_idea.drawRepr(vec_add(this.p, xy(this.talking_dir * 0.5, 1.2)), idea_scale, draw.shapeStyle(idea_color), {freeze: true});
    }

    this.byRole('draw');
  }

  this.drawRepr = function(p, scale, fill, dir) {
    // Dir should be negative (person facing leftwards), 0 (forwards), or positive (rightwards)
    // `CRUNCH
    dir = dir || 0;

    var scaled_size = xy(scale * person_size.x, scale * person_size.y);
    p = vec_add(p, xy(0, -(scaled_size.y - person_size.y)/2));

    // for displaying the person walking left/right
    var x1_offset_scale = (dir < 0 ? 1/3 : 1/2);
    var x2_offset_scale = (dir > 0 ? 1/3 : 1/2);

    var radius = scaled_size.x/3; // head

    var x1 = dir < 0 ? p.x : p.x - scaled_size.x/2;
    var x2 = dir > 0 ? p.x : p.x + scaled_size.x/2;


    draw.r(ctx,
      // `crunch 
      xy(p.x - scaled_size.x * x1_offset_scale, p.y),
      xy(p.x + scaled_size.x * x2_offset_scale, p.y + scaled_size.y - radius),
      fill
    );

    draw.c(ctx,
      xy(p.x, p.y + scaled_size.y - radius),
      radius,
      fill
    );

    draw.c(ctx,
      xy(p.x, p.y + scaled_size.y + radius),
      radius,
      fill
    );
  }

  this.drawSash = function(color, dir) {
    dir = dir || 1;
    var ps = person_size;
    draw.p(ctx, [
        vec_add(this.p, xy(-dir * ps.x/2, 0)),
        vec_add(this.p, xy(-dir * ps.x/2, ps.x/4)),
        vec_add(this.p, xy(dir * ps.x/2, ps.y-ps.x/4)),
        vec_add(this.p, xy(dir * ps.x/2, ps.y-ps.x/2))
      ],
      draw.shapeStyle(color)
    )
  }

  this.drawTopHat = function(color) {
    var ps = person_size;
    var y = ps.y + 2*ps.x/3;
    draw.r(ctx,
      vec_add(this.p, xy(-ps.x/4, y)),
      vec_add(this.p, xy(ps.x/4, y + ps.x)),
      draw.shapeStyle(color)
    );
    draw.r(ctx,
      vec_add(this.p, xy(-ps.x/2, y)),
      vec_add(this.p, xy(ps.x/2, y + ps.x/3)),
      draw.shapeStyle(color)
    );
  }

  this.drawSpeechSquiggles = function(dir) {
    // `crunch
    var x = this.p.x + dir * 0.2;
    var y = this.p.y + person_size.y + 0.02;
    // draw.l(ctx, xy(x, y), xy(x+0.3, y), draw.lineStyle('#000', {lineWidth: 0.05}));
    var strk = draw.lineStyle('#000', {lineWidth: 0.05})

    draw.b(ctx,
      xy(x, y), xy( x + dir*0.3, y - 0.2),
      xy(x + dir*0.1, y), xy(x + dir*0.4, y - 0.1),
      strk
    );

    y += 0.1;

    draw.b(ctx,
      xy(x, y), xy(x + dir*0.3, y + 0.2),
      xy(x + dir*0.1, y), xy(x + dir*0.4, y + 0.1),
      strk
    );

    y -= 0.05;

    draw.l(ctx, xy(x + dir*0.2, y), xy(x + dir*0.4, y), strk)

  }

  // Items ======================================================

  this.hold = function(item) {
    this.inventory_item = item;
    item.container = this;
  }


  this.drop = function() {
    if (!this.inventory_item) return;
    this.inventory_item.p = this.platform.pointAt(this.inventory_item.p.x);
    this.inventory_item.platform = this.platform;
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
    if (!this.inventory_item) {
      this.tryToEnterBuilding();
    }
    else {
      this.inventory_item.use(); 
    }
  }

  // `crunch `crunch `crunch - this method is basically the same as drone.getClosestPerson
  this.getClosestItem = function() {
    if (close_items_per_tick.length === 0) { return null; }
    return close_items_per_tick.reduce(function(closestItem, nextItem) {
      return (nextItem.person_distance < closestItem.person_distance ? nextItem : closestItem);
    }, {person_distance:9999});
  }

  // Buildings/doors

  this.tryToEnterBuilding = function() {
    var person = this;
    global.buildings.forEach(function(b) {
      if (dist(person.p, b.door_p) < interaction_distance) {
        b.personEnter(person);
        return;
      }
    })
  }

  // shooting
  this.shoot = function(at_pos) {
    if (this.drone_distance === null || this.drone_distance > shoot_drone_window) { return; }
    if (this.control_level >= 1) { return; }

    var p = vec_add(this.p, xy(0, person_size.y * 0.7));
    var dir = Math.atan2(at_pos.y - p.y, at_pos.x - p.x);
    addToLoop('foreground2', new Bullet(p, dir))
  }


  // Ideas ======================================================

  // Maps ideas => number of times the idea has come to them
  this.ideas = {};
  this.latest_idea = null; // most recent idea

  this.hasIdea = function(idea) {
    return idea.name in this.ideas;
  }

  this.addIdea = function(idea) {
    if (idea === null) { return; }

    if (!this.hasIdea(idea)) {
      this.ideas[idea.name] = 0;
    }
    this.ideas[idea.name] += 1;
    this.latest_idea = idea;
  }

}

Person.prototype = new Actor();