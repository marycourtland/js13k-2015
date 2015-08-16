// THE PLAYER ========================================================
// it moves stuff around

var Player = {
  drone: new Drone(xy(10, 10)),

  draw: function() {
    // Draw energy meter. `crunch maybe
    var p0 = vec_add(origin, energy_meter_position);
    var p1 = vec_add(p0, polar2cart(rth(energy_meter_radius, 0)));
    var p2 = vec_add(p0, polar2cart(rth(energy_meter_radius, pi)));
    var pe = vec_add(p0, polar2cart(rth(energy_meter_radius, pi * (1 - Player.drone.energy))));

    var style1 = draw.lineStyle(hud_color, {lineWidth: 0.2});
    var style2 = draw.lineStyle(hud_color);
    var style3 = draw.lineStyle(hud_red, {lineWidth: 0.2});
    var style4 = draw.lineStyle(hud_green, {lineWidth: 0.2});

    var low_angle =  pi * (1 - drone_low_energy);
    var high_angle =  pi * (1 - drone_high_energy);

    draw.a(ctx, p0, energy_meter_radius, 0, high_angle, style4);
    draw.a(ctx, p0, energy_meter_radius, high_angle, low_angle, style1);
    draw.a(ctx, p0, energy_meter_radius, low_angle, pi, style3);
    draw.l(ctx, p0, pe, style2);

    // for style niceness 
    p1.x += 0.1;
    p2.x -= 0.1;
    draw.l(ctx, p1, p2, style2);

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
