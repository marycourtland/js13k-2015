// CAMERA ============================================================

var Camera = {
  tick: function() {
    this.focusOnPlayerDrone();
  },

  moveBy: function(xy) {
    ctx.translate(-xy.x, -xy.y);
    origin.x += xy.x;
    origin.y += xy.y;
  },

  focusOnPlayerDrone: function() {
    var dx = Player.drone.p.x - origin.x, dy = Player.drone.p.y - origin.y;
    if (dx < camera_margin.x) { console.debug('dx:', dx); this.moveBy(xy(dx - camera_margin.x, 0)); }
    if ((game_size.x - dx) < camera_margin.x) { this.moveBy(xy(camera_margin.x - (game_size.x - dx), 0)); }

  }
}
