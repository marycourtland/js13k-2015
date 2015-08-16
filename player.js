// THE PLAYER ========================================================
// it moves stuff around

var Player = {
  drone: new Drone(xy(10, 10)),

  draw: function() {
    // Draw energy meter. `crunch maybe
    var p = vec_add(origin, energy_meter_position);
    var p2 = vec_add(p, polar2cart(rth(energy_meter_radius, pi * (1 - Player.drone.energy))));
    var p0 = vec_add(p, polar2cart(rth(energy_meter_radius, 0)));
    var pf = vec_add(p, polar2cart(rth(energy_meter_radius, -pi)));

    var style1 = draw.lineStyle(hud_color, {lineWidth: 0.2});
    var style2 = draw.lineStyle(hud_color);
    draw.a(ctx, p, energy_meter_radius, 0, pi, style1);
    draw.l(ctx, p, p2, style2);

    // for style niceness 
    p0.x += 0.1;
    pf.x -= 0.1;
    draw.l(ctx, p0, pf, style2);

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
