// THE PLAYER ========================================================
// it moves stuff around

var Player = {
  drone: new Drone(xy(8.5, 9.5)),
  usingItem: false,

  tick: function() {
    for (var key in this.inputControlMap) {
      var input = this.inputControlMap[key];
      if (input.isDown && typeof input.whenDown === 'function') {
        input.whenDown();
      }
    }
  },

  inputControlMap: { // `crunch `crunch `crunch
    // map event.which => function
    // ADSW directions for drone
    65: {isDown: 0, whenDown: function() { Player.drone.tiltLeft(); }, onDown: function() { Player.drone.startTiltOffset(); }},
    68: {isDown: 0, whenDown: function() { Player.drone.tiltRight(); }, onDown: function() { Player.drone.startTiltOffset(); }},
    83: {isDown: 0, whenDown: function() { Player.drone.powerDown(); }},
    87: {isDown: 0, whenDown: function() { Player.drone.powerUp(); }},
    37: {isDown: 0, whenDown: function() { if (probability(Player.drone.controlStrength())) Player.drone.person.p.x -= person_speed; }},
    39: {isDown: 0, whenDown: function() { if (probability(Player.drone.controlStrength())) Player.drone.person.p.x += person_speed; }},
    40: {isDown: 0, onUp: function() { if (probability(Player.drone.controlStrength())) { console.log('ok'); Player.drone.person.itemInteract();} }},
    38: {isDown: 0, onUp: function() { Player.drone.person.useItem(); }},
    32: {isDown: 0, whenDown: function() {
      // press spacebar to start controlling
      Player.drone.attemptControl();
      // Player.drone.attempting_control = !Player.drone.attempting_control;
    }}
  },
}


// Input events
// `crunch: these listeners are similar

var keys_down = {};

window.addEventListener("keydown", function(event) {

  var input = Player.inputControlMap[event.which];
  if (input) {
    event.preventDefault();
    input.isDown = 1;
    if ((!(event.which in keys_down) || !keys_down[event.which]) && typeof input.onDown === 'function') {
      input.onDown();
    }
  }
  keys_down[event.which] = true;
});

window.addEventListener("keyup", function(event) {
  var input = Player.inputControlMap[event.which];
  if (input) {
    event.preventDefault();
    input.isDown = 0;
    if (typeof input.onUp === 'function') { input.onUp(); }
  }
  keys_down[event.which] = false;
});