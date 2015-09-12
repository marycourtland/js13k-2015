// THE DRONE =========================================================

var Drone = function(p) {
  var ctx = stage.ctx;
  this.p = p;
  this.p_drawn = p;
  this.gravity = true;
  this.energy = 1; // goes from 0 to 1
  this.integrity = 1; // goes from 0 to 1. Basically health
  this.powered = true;
  this.rpm_scale = 0.83;
  this.control_t0 = 0;
  this.control_signal_target = null;
  this.attempting_control = true;

  this.rpm_scale = 0.83; // starting value
  this.rpm_diff = 0; // Negative: tilted leftwards. Positive: tilted rightwards
  this.color = 'black';
  this.tilt = 0; // goes from -pi/2 (left tilt) to pi/2 (right tilt)
  this.spin = 0;

  this.offset = 0; //vertical only, for now
  this.offsets = {}; // map starting frames > offset-computing-functions
  // `nb: this precludes dual offsets. Could be solved by composing the offset functions

  this.person = null,

  this.boundify = function() {
    // Make sure each property is in its proper bounds
    this.rpm_scale = bounds(this.rpm_scale, [0, 1]);
    this.rpm_diff = bounds(this.rpm_diff, [-1, 1]);
    this.tilt = this.spin > 0 ? bounds(this.tilt, [-pi/2, pi/2]) : this.tilt;
    this.energy = bounds(this.energy, [0, 1]);
    this.integrity = bounds(this.integrity, [0, 1]);
  }

  this.reset = function() {
    this.boundify();

    // compute position offset
    this.offset = 0;
    for (var frame in this.offsets) {
      var t = gameplay_frame - frame;
      var offset = this.offsets[frame](t);

      // Stop computing the offset after it decays enough
      // `nb: this means there can't be offset patterns which oscillate around 0
      if (abs(offset) < 0.001) {
        delete this.offsets[frame];
      }
      else {
        this.offset += offset;
      }
    }
  }


  this.tick = function() {
    // acceleration given by copter blades
    this.v = vec_add(this.v, this.getLiftAccel());

    // Dynamics
    this.tilt += this.spin;

    this.spin *= 0.8;
    this.tilt *= 0.9; // decay the tilt

    this.v.x *= 0.95; // sideways drag
    this.rpm_diff += (this.rpm_diff > 0 ? -0.003 : 0.003);

    this.__proto__.tick.apply(this); // this takes care of gravity + velocity application

    // The drone's *actual* drawn position is offset a bit
    // this is for better aerodynamic fakery
    this.p_drawn = xy(this.p.x, this.p.y + this.offset);

    // Stats
    this.drainEnergy();
    this.checkStats();

    this.boundify();

    // for auto-controlling
    // if (this.attempting_control) {
    //   this.attemptControl();
    // }
  }

  this.draw = function() { 
    // signal to person
    if (this.control_signal_target) {
      draw.l(ctx,
        this.p_drawn,
        this.control_signal_target,
        draw.lineStyle(drone_signal_color, {globalAlpha: this.controlStrength(this.control_signal_target)})
      );
      this.control_signal_target = null; // to be re-set
    }

    // The drone itself
    this.drawRepr(this.p_drawn, 1, draw.shapeStyle(this.color), {tilt:this.tilt});
  }

  this.drawRepr = function(p, scale, fill, params) {
    // `CRUNCH: This whole method
    params = params || {};
    var tilt = params.tilt || 0;
    var _ctx = params.ctx || ctx;

    _ctx.translate(p.x, p.y);
    _ctx.rotate(-tilt);

    var strk = draw.lineStyle(fill.fillStyle, {lineWidth: scale * drone_arm_size.y});

    var width = scale * drone_body_size.x/2;
    var height = scale * drone_body_size.y/2;

    var arm_x = scale * drone_arm_size.x;
    var arm_y = scale * drone_arm_size.y/2;

    var blade_x = scale * drone_blade_size.x/2;
    var blade_y = scale * drone_blade_size.y/2;

    // body
    draw.r(_ctx,
      // `crunch
      xy(-width, -height),
      xy(+width, +height),
      fill
    );

    // arms
    draw.l(_ctx,
      xy(-arm_x, +height + arm_y),
      xy(+arm_x, +height + arm_y),
      strk
    );

    // legs (`crunch)
    draw.l(_ctx,
      xy(-arm_x*0.5, +height + arm_y),
      xy(-2.2 * width, -1.8 * height),
      strk
    );
    draw.l(_ctx,
      xy(+arm_x*0.5, +height + arm_y),
      xy(2.2 * width, -1.8 * height),
      strk
    );

    // copter blades above arms
    function drawBlade(xpos, xscale) {
      // `crunch
      draw.r(_ctx,
        xy(xpos - xscale * blade_x, height + arm_y*2 + 0.05),
        xy(xpos + xscale * blade_x, height + arm_y*2 + 0.05 + blade_y*2),
        fill
      );
      draw.l(_ctx,
        xy(xpos, height + arm_y),
        xy(xpos, height + arm_y*2 + 0.1),
        strk
      )
    }

    var f = 0.8;
    var rpm_scale = params.rpm_scale ? params.rpm_scale : this.rpm_scale;
    var blade_phase = (this.powered && (typeof rpm_scale !== 'undefined') && !params.freeze) ? rpm_scale * gameplay_frame : 0.8;
    drawBlade(scale * drone_arm_size.x - 0.05, sin(f * blade_phase));
    drawBlade(-scale * drone_arm_size.x + 0.05, sin(f * blade_phase));

    _ctx.rotate(tilt);
    _ctx.translate(-p.x, -p.y);
  }

  this.checkStats = function() {
    // `crunch: the 'refresh to play again' can be consolidated
    if (this.energy <= 0) {
      this.die('Your battery is drained. Refresh to play again.');
    }
    else if (this.integrity <= 0) {
      this.die('Structural integrity failure. Refresh to play again.')
    }
  }

  this.die = function(reason) {
      this.powered = false;
      this.rpm_scale = 0;
      notify(reason || 'You have died... for no reason. Refresh to play again.')
  }
  
  // Fake aerodynamics! ========================================================

  this.getLiftAccel = function() {
    // Note: this isn't physically accurate :)
    // For balancing purposes, full lift should be a little higher than gravity
    var y = this.powered ? -1.2 * gravAccel().y * this.rpm_scale : 0;
    var x = this.powered ? this.rpm_diff * drone_max_sideways_accel : 0;
    return xy(x, y);
  }

  // to be more responsive, these methods adjust velocity immediately as well as
  // contributing to acceleration
  this.powerUp = function() {
    if (this.skip_tick || !this.powered) { return; }
    this.v.y += 0.05;
    this.rpm_scale += dronePowerAccel;
  }
  
  this.powerDown = function() {
    if (this.skip_tick || !this.powered) { return; }
    this.v.y -= 0.05;
    this.rpm_scale -= dronePowerAccel;
  }

  this.tiltLeft = function() {
    if (this.skip_tick || !this.powered) { return; }
    this.v.x -= 0.1;
    this.rpm_diff -= droneTiltAccel;
    this.tilt = -max_tilt;
  }

  this.tiltRight = function() {
    if (this.skip_tick || !this.powered) { return; }
    this.v.x += 0.1;
    this.rpm_diff += droneTiltAccel;
    this.tilt = max_tilt;
  }

  this.startTiltOffset = function() {
    if (this.p.y < environment.ground.y0 + 1) { return; }
    this.offsets[gameplay_frame] = tiltOffset();
  }


  // Environmental effects =====================================================

  this.experienceWind = function(dp, v) {
    // NOTE: the vectors are in rth format
    var dth = v.th - dp.th;

    this.spin += 0.1 / dth;

    this.v = vec_add(this.v, polar2cart(rth(0.03*v.r/dp.r, v.th)));

  }

  // Controlling people ========================================================

  this.controlStrength = function(person) {
    return 1;
    // On scale from 0 to 1, depending on how near drone is to person
    person = person || this.person;
    if (!person) { return 0; }
    return 0.5 + Math.atan(20 - dist(this.p, person.p))/pi;
  }

  this.uncontrol = function() {
    if (!this.person) return;
    this.person.color = person_color;

    // The newly released person's willpower has been decreased;
    // it will be easier to re-control them in the future
    this.person.control_level = 0;

    // Now the person is eager to talk about their experience
    this.person.addIdea(global.ideas.drone);
    this.person.talkToClosestPerson();

    this.person = null;
  }

  this.controlFull = function(person) {
    if (person === this.person) { return; } // already controlling
    this.uncontrol(); // Only control one at a time!
    this.person = person;
    this.person.color = controlled_person_color;
    this.person.control_level = 1;
    // Once a person is fully controlled, their resistance drops very low
    this.person.resistance = min_person_resistance;

    this.person.byRole('onControl');
  }

  this.attemptControl = function() {
    var person = this.getClosestPerson();

    // square the control strength so that it's more limited
    if (person && probability(squared(this.controlStrength()))) {
      person.control_level += person_control_rate * 2; // multiplied by two to counteract the decay
      this.control_signal_target = vec_add(person.p, xy(0, person_size.y));

      // the person will notice the drone, so they'll get the idea of the drone
      person.addIdea(global.ideas.drone);

    }
    else {
      this.control_signal_target = null;
    }

    // If the control level on the person exceeds their resistance, the person has been overpowered
    if (person && person.control_level >= person.resistance) {
      this.controlFull(person);
    }
  }

  this.getClosestPerson = function() {
    if (close_people_per_tick.length === 0) { return null; }
    return close_people_per_tick.reduce(function(closestPerson, nextPerson) {
      return (nextPerson.drone_distance < closestPerson.drone_distance ? nextPerson : closestPerson);
    }, {drone_distance:9999});
  }


  // Stats related ========================================================

  this.fillEnergy = function() {
    this.energy = 1;
  }

  this.drainEnergy = function() {
    // per frame
    // this combines all the possible factors which contribute to energy drain;
    this.energy -= drone_drain_rate * this.rpm_scale;
  }

  this.dockIntegrity = function(amount) {
    this.integrity -= amount;
  }

}

Drone.prototype = new Actor();
