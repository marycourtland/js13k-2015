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
};

var roles = {
  normal: new Role({
    draw: function() {
      this.drawSash('green');
    }
  }),

  game_target: new Role({
    draw: function() {
      this.drawSash('red');
    },

    onControl: function() {
      notify('You have won. Congratulations.');
    }
  })
}