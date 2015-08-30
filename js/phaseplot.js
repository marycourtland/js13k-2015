// Purpose of this thing is to debug the drone movement
// it will not go in final game

var pp_size = xy(250, 250); // in PIXELS (unlike main canvas's game_size)
var pp_color = 'white';
var pp_bg_color = 'black';


Phaseplot = function(selector, scale, tick) {
  this.canvas = $(selector);
  this.ctx = this.canvas.getContext('2d');
  this.scale = scale;

  this.u2px = function(pos) {
    return xy(pos.x * this.scale.x, pos.y * this.scale.y);
  }

  var single_pixel_size = xy(1/this.scale.x, 1/this.scale.y);

  var size_units = xy(pp_size.x / this.scale.x, pp_size.y / this.scale.y);

  this.canvas.setAttribute("width", pp_size.x + "px");
  this.canvas.setAttribute("height", pp_size.y + "px");

  // (0, 0) is centered
  this.ctx.setTransform(scale.x, 0, 0, -scale.y,
    scale.x * size_units.x/2,
    scale.y * size_units.y/2
  );

  this.plotPoint = function(pos) {
    draw.r(this.ctx, pos, vec_add(pos, single_pixel_size), draw.shapeStyle(pp_color));
  }

  this.clear = function() {
    draw.clr(this.ctx);
  }

  // Record drone position/velocity
  this.tick = tick;

  this.draw = function() {
    draw.r(this.ctx, xy(-size_units.x, -size_units.y), size_units,  draw.shapeStyle('black', {globalAlpha: 0.005})); // Slowly fade out old tracks
  }

  addToLoop('overlay', this);

  this.plotPoint(xy(0,0));
}

var pp_drone_vx = new Phaseplot('#phaseplot-drone-vx',
  xy(2, 40),
  function() {
      this.plotPoint(xy(Player.drone.p.x, Player.drone.v.x));
  }
);
var pp_drone_vy = new Phaseplot('#phaseplot-drone-vy',
  xy(30, 2),
  function() {
      this.plotPoint(xy(Player.drone.v.y, Player.drone.p.y));
  }
);
var pp_drone_ay = new Phaseplot('#phaseplot-drone-ay',
  xy(20, 300000),
  function() {
      this.plotPoint(xy(Player.drone.v.y, Player.drone.getLiftAccel().y + gravAccel().y));
  }
);
