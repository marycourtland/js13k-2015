// THE PLAYER ========================================================
// it moves stuff around

var Player = {
  // `todo: tick, draw
  inputControlMap: { // `crunch `crunch `crunch
    // map event.which => function
    // ADSW directions for drone
    65: function() { Drone.actor.p.x -= 1; },
    68: function() { Drone.actor.p.x += 1; },
    83: function() { Drone.actor.p.y -= 1; },
    87: function() { Drone.actor.p.y += 1; },
    37: function() { if (probability(Drone.controlStrength())) Drone.person.actor.p.x -= 1; },
    39: function() { if (probability(Drone.controlStrength())) Drone.person.actor.p.x += 1; },
    40: function() { if (probability(Drone.controlStrength())) Drone.person.itemInteract(); },
    38: function() { Drone.person.giveItemToDrone(); },
    32: function() { Drone.attemptControl(); }
  }
}
