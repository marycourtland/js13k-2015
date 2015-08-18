// THE DRONE =========================================================

var Drone = function(loc) {
  this.p = loc;
  this.energy = 1; // goes from 0 to 1

  this.person = null,

  this.tick = function() {
    this.__proto__.tick.apply(this);
    this.energy -= drone_drain_rate;
  }

  this.draw = function() {
    // `CRUNCH: This whole method

    var p = this.p;
    var fill = draw.shapeStyle(drone_color);
    var strk = draw.lineStyle(drone_color, {lineWidth: drone_arm_size.y});

    // signal to person
    if (this.person) {
      draw.l(ctx,
        p,
        vec_add(this.person.p, xy(0, person_size.y)),
        draw.lineStyle('#9eb', {globalAlpha: this.controlStrength()})
      );
    }

    // body
    draw.r(ctx,
      // `crunch
      xy(p.x - drone_body_size.x/2, p.y - drone_body_size.y/2),
      xy(p.x + drone_body_size.x/2, p.y + drone_body_size.y/2),
      fill
    );

    // arms
    draw.l(ctx,
      xy(p.x - drone_arm_size.x, p.y + drone_body_size.y/2 + drone_arm_size.y/2),
      xy(p.x + drone_arm_size.x, p.y + drone_body_size.y/2 + drone_arm_size.y/2),
      strk
    )


    // copter blades above arms
    function drawBlade(xpos, xscale) {
      // `crunch
      draw.r(ctx,
        xy(p.x + xpos - xscale * drone_blade_size.x/2, p.y + drone_body_size.y/2 + drone_arm_size.y + 0.05),
        xy(p.x + xpos + xscale * drone_blade_size.x/2, p.y + drone_body_size.y/2 + drone_arm_size.y + 0.05 + drone_blade_size.y),
        fill
      );
      draw.l(ctx,
        xy(p.x + xpos, p.y + drone_body_size.y/2 + drone_arm_size.y/2),
        xy(p.x + xpos, p.y + drone_body_size.y/2 + drone_arm_size.y + 0.1),
        strk
      )
    }

    var f = 0.8;
    drawBlade(drone_arm_size.x - 0.05, sin(f * gameplay_frame));
    // drawBlade(0, cos(f * gameplay_frame));
    drawBlade(-drone_arm_size.x + 0.05, sin(f * gameplay_frame));

    // Four blades - this looks better with longer arm size (0.6)
    // drawBlade(drone_arm_size.x, sin(f * gameplay_frame));
    // drawBlade(drone_arm_size.x/2.5, cos(f * gameplay_frame));
    // drawBlade(-drone_arm_size.x/2.5, sin(f * gameplay_frame));
    // drawBlade(-drone_arm_size.x, cos(f * gameplay_frame));
  }

  this.controlStrength = function(person) {
    // On scale from 0 to 1, depending on how near drone is to person
    person = person || this.person;
    return 0.5 + Math.atan(20 - dist(this.p, person.p))/pi;
  }

  this.uncontrol = function() {
    if (!this.person) return;
    this.person.color = person_color;
    this.person = null;
  }

  this.control = function(person) {
    this.uncontrol(); // Only control one at a time!
    this.person = person;
    this.person.color = controlled_person_color;
  }

  this.attemptControl = function() {
    // square the control strength so that it's more limited
    var person = this.getClosestPerson();
    if (person && probability(squared(this.controlStrength(person)))) {
      this.control(person);
    }
  }

  this.getClosestPerson = function() {
    if (close_people_per_tick.length === 0) { return null; }
    return close_people_per_tick.reduce(function(closestPerson, nextPerson) {
      return (nextPerson.drone_distance < closestPerson.drone_distance ? nextPerson : closestPerson);
    }, {drone_distance:9999});
  }

  this.fillEnergy = function() {
    this.energy = 1;
  }
}

Drone.prototype = new Actor();
