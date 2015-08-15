// THE DRONE =========================================================

var Drone = {
  actor: new Actor(xy(6, 10)),
  person: null,
  draw: function() {
    if (this.person) {
      draw.l(ctx,
        this.actor.p,
        this.person.actor.p,
        draw.lineStyle('#9eb', {globalAlpha: this.controlStrength()})
      );
    }
    draw.r(ctx,
      // `crunch
      {x: this.actor.p.x - drone_size.x/2, y: this.actor.p.y - drone_size.y/2},
      {x: this.actor.p.x + drone_size.x/2, y: this.actor.p.y + drone_size.y/2},
      draw.shapeStyle('#000')
    );
  },

  controlStrength: function(person) {
    // On scale from 0 to 1, depending on how near drone is to person
    person = person || this.person;
    return squared(0.5 + Math.atan(20 - dist(this.actor.p, person.actor.p))/pi);
  },

  uncontrol: function() {
    if (!this.person) return;
    this.person.color = person_color;
    this.person = null;
  },

  control: function(person) {
    this.uncontrol(); // Only control one at a time!
    this.person = person;
    this.person.color = controlled_person_color;
  },

  attemptControl: function() {
    // square the control strength so that it's more limited
    var person = this.getClosestPerson();
    if (person && probability(squared(this.controlStrength(person)))) {
      this.control(person);
    }
  },

  getClosestPerson: function() {
    if (close_people_per_tick.length === 0) { return null; }
    return close_people_per_tick.reduce(function(closestPerson, nextPerson) {
      return (nextPerson.drone_distance < closestPerson.drone_distance ? nextPerson : closestPerson);
    }, {drone_distance:9999});
  }
}