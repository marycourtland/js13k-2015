// THE DRONE =========================================================

var Drone = {
  actor: new Actor(xy(6, 10)),
  person: null,
  draw: function() {
    if (this.person) {
      draw.l(ctx, this.actor.p, this.person.actor.p, draw.lineStyle('#9eb', {globalAlpha: this.controlStrength()}));
    }
    draw.r(ctx,
      // `crunch
      {x: this.actor.p.x - drone_size.x/2, y: this.actor.p.y - drone_size.y/2},
      {x: this.actor.p.x + drone_size.x/2, y: this.actor.p.y + drone_size.y/2},
      draw.shapeStyle('#000')
    );
  },

  controlStrength: function() {
    // On scale from 0 to 1, depending on how near drone is to person
    return 0.5 + Math.atan(20 - dist(this.actor.p, this.person.actor.p))/pi;
  },

  uncontrol: function() {
    if (!this.person) return;
    this.person.color = person_color;
    this.person = null;
  },

  control: function(person) {
    this.uncontrol(); // Only control one at a time!
    person.color = controlled_person_color;
    this.person = person;
  }                
}