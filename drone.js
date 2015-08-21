// THE DRONE =========================================================

var Drone = function(loc) {
  this.p = loc;
  this.gravity = true;
  this.energy = 1; // goes from 0 to 1
  this.powered = true;
  this.rpm_scale = 0.83;
  this.control_t0 = 0;
  this.control_signal_target = [];
  this.rpm_scale = 0.83; // starting value
  this.color = 'black';

  this.person = null,

  this.reset = function() {
    this.color = 'black';
  }


  this.tick = function() {
    this.rpm_scale = max(min(this.rpm_scale, 1), 0);

    this.v = vec_add(this.v, this.getLiftAccel());
    this.__proto__.tick.apply(this);

    this.energy = max(this.energy - this.getEnergyDrain(), 0);

    if (this.energy == 0) {
      this.die();
    }
  }

  this.draw = function() {
    // `CRUNCH: This whole method

    var p = this.p;
    var fill = draw.shapeStyle(this.color);
    var strk = draw.lineStyle(this.color, {lineWidth: drone_arm_size.y});

    // signal to person
    if (this.control_signal_target) {
      draw.l(ctx,
        p,
        this.control_signal_target,
        draw.lineStyle(drone_signal_color, {globalAlpha: this.controlStrength()})
      );
      this.control_signal_target = null; // to be re-set
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
    drawBlade(drone_arm_size.x - 0.05, sin(f * gameplay_frame * this.rpm_scale));
    drawBlade(-drone_arm_size.x + 0.05, sin(f * gameplay_frame * this.rpm_scale));
  }

  this.die = function() {
      this.powered = false;
      this.rpm_scale = 0;

  }
  
  // Fake aerodynamics! ========================================================

  this.getLiftAccel = function() {
    // For balancing purposes, full lift should be a little higher than gravity
    var y = this.powered ? -1.2 * gravAccel().y * this.rpm_scale : 0;
    return xy(0, y);
  }

  this.powerUp = function() { this.rpm_scale += 0.01; }
  
  this.powerDown = function() { this.rpm_scale -= 0.01; }


  // Controlling people ========================================================

  this.controlStrength = function(person) {
    // On scale from 0 to 1, depending on how near drone is to person
    person = person || this.person;
    return 0.5 + Math.atan(20 - dist(this.p, person.p))/pi;
  }

  this.uncontrol = function() {
    if (!this.person) return;
    this.person.color = person_color;
    this.person.control_level = 0;
    this.person = null;
  }

  this.controlFull = function(person) {
    this.uncontrol(); // Only control one at a time!
    this.person = person;
    this.person.color = controlled_person_color;
    this.person.control_level = 1;
    // Once a person is fully controlled, their resistance drops very low
    this.person.resistance = min_person_resistance;
  }

  this.attemptControl = function() {
    // square the control strength so that it's more limited
    var person = this.getClosestPerson();
    if (person && probability(squared(this.controlStrength(person)))) {
      person.control_level += person_control_rate * 2; // multiplied by two to counteract the decay
      this.control_signal_target = vec_add(person.p, xy(0, person_size.y));
    }
    else {
      this.control_signal_target = null;
    }

    // If the control level on the person exceeds their resistance, the person has been overpowered
    if (person.control_level >= person.resistance) {
      this.controlFull(person);
    }
  }

  this.getClosestPerson = function() {
    if (close_people_per_tick.length === 0) { return null; }
    return close_people_per_tick.reduce(function(closestPerson, nextPerson) {
      return (nextPerson.drone_distance < closestPerson.drone_distance ? nextPerson : closestPerson);
    }, {drone_distance:9999});
  }


  // Energy related ========================================================

  this.fillEnergy = function() {
    this.energy = 1;
  }

  this.getEnergyDrain = function() {
    // per frame
    // this combines all the possible factors which contribute to energy drain;
    return drone_drain_rate * this.rpm_scale;
  }

}

Drone.prototype = new Actor();
