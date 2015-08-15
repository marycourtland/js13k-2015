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
    37: function() { if (p(Drone.controlStrength())) Drone.person.actor.p.x -= 1; },
    39: function() { if (p(Drone.controlStrength())) Drone.person.actor.p.x += 1; }
  }
}
