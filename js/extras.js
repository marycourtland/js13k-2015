
// unused - dial for hud

hudDial = function(r, p0, dial_percent, red_percent, green_percent) {
  // Draw a dial. `crunch maybe
  p0 = vec_add(origin, p0);
  var p1 = vec_add(p0, polar2cart(rth(r, 0)));
  var p2 = vec_add(p0, polar2cart(rth(r, pi)));
  var pe = vec_add(p0, polar2cart(rth(r*0.8, pi * (1- dial_percent))));
  p1.x += 0.2; // for style niceness
  p2.x -= 0.2;

  var basic_style = draw.lineStyle(hud_color);

  var red_angle =  pi * (1 - red_percent);
  var green_angle =  pi * (1 - green_percent);

  draw.a(ctx, p0, r, 0, pi, draw.shapeStyle(hud_color_dark))
  draw.a(ctx, p0, r * 0.2, 0, pi, draw.shapeStyle(hud_color))
  draw.a(ctx, p0, r, 0, green_angle, draw.lineStyle(hud_green, {lineWidth: 0.3}));
  draw.a(ctx, p0, r, green_angle, red_angle, draw.lineStyle(hud_color, {lineWidth: 0.3}));
  draw.a(ctx, p0, r, red_angle, pi, draw.lineStyle(hud_red, {lineWidth: 0.3}));
  p0.y += 0.05;
  pe.y += 0.05;
  draw.l(ctx, p0, pe, basic_style);
  // draw.l(ctx, p1, p2, basic_style);
}

/* EXAMPLE - drone energy meter

hudDial(
  energy_meter_radius,
  vec_add(origin, energy_meter_position),
  Player.drone.energy,
  drone_low_energy,
  drone_high_energy
)

*/