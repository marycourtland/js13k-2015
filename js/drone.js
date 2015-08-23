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
  this.rpm_diff = 0; // Negative: tilted leftwards. Positive: tilted rightwards
  this.color = 'black';

  this.person = null,

  this.reset = function() {
    this.color = 'black';
  }


  this.tick = function() {
    this.rpm_scale = max(min(this.rpm_scale, 1), 0);
    this.rpm_diff = max(min(this.rpm_diff, 1), -1);

    // acceleration given by copter blades
    this.v = vec_add(this.v, this.getLiftAccel());

    // introduce a good bit of sideways drag
    this.v.x *= 0.95;
    this.rpm_diff += (this.rpm_diff > 0 ? -0.003 : 0.003);

    //this will take care of gravity
    this.__proto__.tick.apply(this);

    this.energy = max(this.energy - this.getEnergyDrain(), 0);;

    if (this.energy == 0) {
      this.die();
    }
  }

  this.draw = function() { 
    // signal to person
    if (this.control_signal_target) {
      draw.l(ctx,
        this.p,
        this.control_signal_target,
        draw.lineStyle(drone_signal_color, {globalAlpha: this.controlStrength()})
      );
      this.control_signal_target = null; // to be re-set
    }

    // The drone itself
    this.drawRepr(this.p, 1, draw.shapeStyle(this.color), this.getTilt());
  }

  this.drawRepr = function(p, scale, fill, tilt) {
    // `CRUNCH: This whole method
    tilt = tilt || 0;
    ctx.translate(p.x, p.y);
    ctx.rotate(-tilt);

    var strk = draw.lineStyle(fill.fillStyle, {lineWidth: scale * drone_arm_size.y});

    var width = scale * drone_body_size.x/2;
    var height = scale * drone_body_size.y/2;

    var arm_x = scale * drone_arm_size.x;
    var arm_y = scale * drone_arm_size.y/2;

    var blade_x = scale * drone_blade_size.x/2;
    var blade_y = scale * drone_blade_size.y/2;

    // body
    draw.r(ctx,
      // `crunch
      xy(- width, - height),
      xy(+ width, + height),
      fill
    );

    // arms
    draw.l(ctx,
      xy(- arm_x, + height + arm_y),
      xy(+ arm_x, + height + arm_y),
      strk
    )

    // copter blades above arms
    function drawBlade(xpos, xscale) {
      // `crunch
      draw.r(ctx,
        xy(+ xpos - xscale * blade_x, + height + arm_y*2 + 0.05),
        xy(+ xpos + xscale * blade_x, + height + arm_y*2 + 0.05 + blade_y*2),
        fill
      );
      draw.l(ctx,
        xy(+ xpos, + height + arm_y),
        xy(+ xpos, + height + arm_y*2 + 0.1),
        strk
      )
    }

    var f = 0.8;
    drawBlade(scale * drone_arm_size.x - 0.05, sin(f * gameplay_frame * this.rpm_scale));
    drawBlade(-scale * drone_arm_size.x + 0.05, sin(f * gameplay_frame * this.rpm_scale));

    ctx.rotate(tilt);
    ctx.translate(-p.x, -p.y);
  }

  this.die = function() {
      this.powered = false;
      this.rpm_scale = 0;

  }
  
  // Fake aerodynamics! ========================================================

  this.getLiftAccel = function() {
    // Note: this isn't physically accurate :)
    // For balancing purposes, full lift should be a little higher than gravity
    var y = this.powered ? -1.2 * gravAccel().y * this.rpm_scale : 0;
    var x = this.powered ? this.rpm_diff * drone_max_sideways_accel : 0;
    return xy(x, y);
  }

  this.getTilt = function() {
    return (this.rpm_diff + this.v.x/10) * pi/2;
  }

  // to be more responsive, these methods adjust velocity immediately as well as
  // contributing to acceleration
  this.powerUp = function() {
    this.v.y += 0.1;
    this.rpm_scale += 0.01;
  }
  
  this.powerDown = function() {
    this.v.y -= 0.1;
    this.rpm_scale -= 0.01;
  }

  this.tiltLeft = function() {
    this.v.x -= 0.1;
    this.rpm_diff -= 0.01;
  }

  this.tiltRight = function() {
    this.v.x += 0.1;
    this.rpm_diff += 0.01;
  }


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

      // the person will notice the drone, so they'll get the idea of the drone
      person.addIdea(wnd.ideas.drone);

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
