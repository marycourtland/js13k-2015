// THE PLAYER ========================================================
// it moves stuff around

var Player = {
  drone: new Drone(xy(10, 10.05)),

  draw: function() {

  },

  inputControlMap: { // `crunch `crunch `crunch
    // map event.which => function
    // ADSW directions for drone
    65: function() { Player.drone.p.x -= 1; },
    68: function() { Player.drone.p.x += 1; },
    83: function() { Player.drone.powerDown(); },
    87: function() { Player.drone.powerUp(); },
    37: function() { if (probability(Player.drone.controlStrength())) Player.drone.person.p.x -= 1; },
    39: function() { if (probability(Player.drone.controlStrength())) Player.drone.person.p.x += 1; },
    40: function() { if (probability(Player.drone.controlStrength())) Player.drone.person.itemInteract(); },
    38: function() { Player.drone.person.useItem(); },
    32: function() {
      // Player must hold down spacebar for the requisite length of time
      Player.drone.attemptControl();
    }
  }
}
