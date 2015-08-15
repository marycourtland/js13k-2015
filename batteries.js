// BATTERIES ============================================================

function Battery(loc) {
  this.item = new Item(loc);

  this.tick = function() { tickity(this.item); }

  this.draw = function() {
    var fill = draw.shapeStyle(this.color);
    var p = this.item.p;

    draw.r(ctx,
      // `crunch
      {x: p.x - battery_size.x/2, y: p.y},
      {x: p.x + battery_size.x/2, y: p.y + battery_size.y},
      fill
    );

    // bumps to suggest battery terminals
    [-0.2, 0.05].forEach(function(x) {
      draw.r(ctx,
        // `crunch
        {x: p.x + x, y: p.y + battery_size.y},
        {x: p.x + x + 0.15, y: p.y + battery_size.y + 0.1},
        fill
      );  
    })
    
  }
}
