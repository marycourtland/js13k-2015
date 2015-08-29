// THE PLAYER ========================================================
// it moves stuff around

var Player = {
  drone: new Drone(xy(10, 10.05)),
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
    65: {isDown: 0, whenDown: function() { Player.drone.tiltLeft(); }},
    68: {isDown: 0, whenDown: function() { Player.drone.tiltRight(); }},
    83: {isDown: 0, whenDown: function() { Player.drone.powerDown(); }},
    87: {isDown: 0, whenDown: function() { Player.drone.powerUp(); }},
    37: {isDown: 0, whenDown: function() { if (probability(Player.drone.controlStrength())) Player.drone.person.p.x -= person_speed; }},
    39: {isDown: 0, whenDown: function() { if (probability(Player.drone.controlStrength())) Player.drone.person.p.x += person_speed; }},
    40: {isDown: 0, onUp: function() { console.debug('onUp!'); if (probability(Player.drone.controlStrength())) { console.log('ok'); Player.drone.person.itemInteract();} }},
    38: {isDown: 0, onUp: function() { Player.drone.person.useItem(); }},
    32: {isDown: 0, whenDown: function() {
      // Player must hold down spacebar for the requisite length of time
      Player.drone.attemptControl();
    }}
  },
}
