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
    if (this.person) {
      draw.l(ctx,
        this.p,
        this.person.p,
        draw.lineStyle('#9eb', {globalAlpha: this.controlStrength()})
      );
    }
    draw.r(ctx,
      // `crunch
      {x: this.p.x - drone_size.x/2, y: this.p.y - drone_size.y/2},
      {x: this.p.x + drone_size.x/2, y: this.p.y + drone_size.y/2},
      draw.shapeStyle('#000')
    );
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
}

Drone.prototype = new Actor();
