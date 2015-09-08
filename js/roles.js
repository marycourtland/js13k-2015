// An npc person's role influences various things
// and they all are displayed through some visual 
// like a hat, sash, or whatever
//
// Functions (all called with the person as `this`)
//    draw: called right after the person is drawn
//    onControl: an event triggered when the npc is controlled (by the player drone)

function Role(options) {
  this.draw = options.draw || null_function;
  this.onControl = options.onControl || null_function;
  this.tick = options.tick || null_function;
};

var roles = {
  normal: new Role({
    draw: function() {
      // this.drawSash('#7ca');
    }
  }),

  guard: new Role({
    tick: function() {
      if ( gameplay_frame % bullet_frequency === 0) {
        this.shoot(Player.drone.p_drawn);
      }
    },

    draw: function() {
      this.drawSash('#a21', -1);
      this.drawSash('#a21', 1); // `crunch
    }
  }),

  game_target: new Role({
    draw: function() {
      this.drawTopHat(person_color);
      this.drawSash('#78c');
    },

    onControl: function() {
      notify('You have won. Congratulations.');
    }
  })
}