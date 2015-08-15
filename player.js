// THE PLAYER ========================================================
// it moves stuff around

var Player = {
  // `todo: tick, draw
  inputControlMap: {
    // map event.which => function
    // ADSW directions for drone
    65: function() { Drone.actor.p.x -= 1; },
    68: function() { Drone.actor.p.x += 1; },
    83: function() { Drone.actor.p.y -= 1; },
    87: function() { Drone.actor.p.y += 1; }
  }
}
