// THE PLAYER ========================================================
// it moves stuff around

var Player = {
  drone: new Drone(xy(10, 10)),

  draw: function() {
    draw.r(ctx,
      energy_meter_position,
      vec_add(energy_meter_position, energy_meter_size),
      draw.shapeStyle(hud_color_dark)
    );
    
    draw.r(ctx,
      energy_meter_position,
      vec_add(energy_meter_position, xy(energy_meter_size.x * this.drone.energy, energy_meter_size.y)),
      draw.shapeStyle(hud_color)
    );

    // `todo: include a percentage next to the bar
  },

  inputControlMap: { // `crunch `crunch `crunch
    // map event.which => function
    // ADSW directions for drone
    65: function() { Player.drone.p.x -= 1; },
    68: function() { Player.drone.p.x += 1; },
    83: function() { Player.drone.p.y -= 1; },
    87: function() { Player.drone.p.y += 1; },
    37: function() { if (probability(Player.drone.controlStrength())) Player.drone.person.p.x -= 1; },
    39: function() { if (probability(Player.drone.controlStrength())) Player.drone.person.p.x += 1; },
    40: function() { if (probability(Player.drone.controlStrength())) Player.drone.person.itemInteract(); },
    38: function() { Player.drone.person.useItem(); },
    32: function() { Player.drone.attemptControl(); }
  }
}