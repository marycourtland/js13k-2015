// SETUP =============================================================


function Layer(selector, size, scale) {
  this.canvas = $(selector);
  this.ctx = this.canvas.getContext('2d');
  this.canvas.setAttribute("width", size.x * scale.x);
  this.canvas.setAttribute("height", size.y * scale.y);

  this.origin = xy(0, 0);
  this.size = size;
  this.scale = scale;

  // x/y grid, origin at lower left corner. Positive is up and rightwards
  // note: it will move left/right as the player moves camera
  this.ctx.setTransform(scale.x, 0, 0, -scale.y, 0, size.y * scale.y);
  this.ctx.lineWidth = 0;

  this.clear = function() {
    draw.clr(this.ctx, this.origin, xy(this.origin.x + this.size.x, this.origin.y + this.size.y));
  }

  this.moveBy = function(p) {
    p = this.transCoords(p);
    this.ctx.translate(-p.x, -p.y);
    this.origin = vec_add(this.origin, p);
  }

  // Translate from global game units into this layer's units
  this.transCoords = function(p) {
    return xy(
      p.x * this.scale.x / game_scale.x,
      p.y * this.scale.y / game_scale.y
    );
  }
}


var Camera = {
  tick: function() {
    this.focusOnPlayerDrone();
  },

  moveBy: function(p) {
    game_origin = vec_add(game_origin, p);
    global.bg1.moveBy(p);
    global.bg2.moveBy(p);
    global.stage.moveBy(p);
    environment.redraw_bg = true;
  },

  focusOnPlayerDrone: function() {
    var dx = Player.drone.p.x - game_origin.x, dy = Player.drone.p.y - game_origin.y;
    if (dx < camera_margin.x) { this.moveBy(xy(dx - camera_margin.x, 0)); }
    if ((game_size.x - dx) < camera_margin.x) { this.moveBy(xy(camera_margin.x - (game_size.x - dx), 0)); }
  }
}

global.game_origin = xy(0, 0);

global.bg1 = new Layer("#game_background1", scale(game_size, 1/0.9), scale(game_scale, 0.9));
global.bg2 = new Layer("#game_background2", scale(game_size, 1/0.95), scale(game_scale, 0.95));
global.stage = new Layer("#game_stage", game_size, game_scale);
global.overlay = new Layer("#game_overlay", game_size, game_scale);

// this is the container for all the layers
$("#game-layers").style.height = (game_size.y * game_scale.y) + "px";
