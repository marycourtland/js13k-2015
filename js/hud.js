// Unused fancy stuff.

var Hud = {
  draw: function() {

    for (var display_name in this.displays) {
      this.displays[display_name].call(this);
    }
    if (gameplay_frame % 20 === 0) { this.fillInfo(); }
  },

  fillInfo: function() {
    $("#game-info #fps").textContent = Math.round(avg_fps * 10)/10;
  },

  displays: {
    energy: function() {
      var p = vec_add(vec_add(overlay.origin, overlay.size), energy_meter_position);
      (new Battery()).drawRepr(p, 2, draw.shapeStyle(hud_color), overlay.ctx);

      p = vec_add(p, xy(1, 0.1));

      draw.r(overlay.ctx,
        p,
        vec_add(p, bar_meter_size),
        draw.shapeStyle(hud_color_dark)
      );
      
      draw.r(overlay.ctx,
        p,
        vec_add(p, xy(bar_meter_size.x * Player.drone.energy, bar_meter_size.y)),
        draw.shapeStyle(hud_color)
      );

      // `todo: include a percentage next to the bar

    },

    integrity: function() {
      // `CRUNCH: this is essentially same as the energy meter. Just the icon adjustment is off a bit
      var p = vec_add(vec_add(overlay.origin, overlay.size), integrity_meter_position);
      Player.drone.drawRepr(vec_add(p, xy(0, 0.3)), 2, draw.shapeStyle(hud_color), {ctx: overlay.ctx, freeze: true});

      p = vec_add(p, xy(1.5, 0.1));

      draw.r(overlay.ctx,
        p,
        vec_add(p, bar_meter_size),
        draw.shapeStyle(hud_color_dark)
      );
      
      draw.r(overlay.ctx,
        p,
        vec_add(p, xy(bar_meter_size.x * Player.drone.integrity, bar_meter_size.y)),
        draw.shapeStyle(hud_color)
      );

      // `todo: include a percentage next to the bar
    },

    rpm: function() {
      this.drawDial(
        hud_dial_radius,
        vec_add(vec_add(overlay.origin, overlay.size), rpm_meter_position),
        Player.drone.rpm_scale,
        [0.82, 0.85]
      );

    }
  },

  // generic drawing methods

  drawDial: function(r, p0, dial_percent, green_range) {
    // Draw a dial. `crunch maybe
    var p1 = vec_add(p0, polar2cart(rth(r, 0)));
    var p2 = vec_add(p0, polar2cart(rth(r, pi)));
    var pe = vec_add(p0, polar2cart(rth(r*0.8, pi * (1- dial_percent))));
    p1.x += 0.2; // for style niceness
    p2.x -= 0.2;

    var basic_style = draw.lineStyle(hud_color);

    var green_range = green_range || [0, 0]
    var green_angle1 =  pi * (1 - green_range[0]);
    var green_angle2 =  pi * (1 - green_range[1]);

    draw.a(overlay.ctx, p0, r, 0, pi, draw.shapeStyle(hud_color_dark))
    draw.a(overlay.ctx, p0, r * 0.2, 0, pi, draw.shapeStyle(hud_color))
    draw.a(overlay.ctx, p0, r, 0, pi, draw.lineStyle(hud_color, {lineWidth: 0.2}));
    draw.a(overlay.ctx, p0, r, green_angle2, green_angle1, draw.lineStyle(hud_green, {lineWidth: 0.2}));
    p0.y += 0.05;
    pe.y += 0.05;
    draw.l(overlay.ctx, p0, pe, basic_style);
    // draw.l(overlay.ctx, p1, p2, basic_style);
  }
}

