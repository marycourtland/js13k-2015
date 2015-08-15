// CAMERA ============================================================
function moveCameraBy(xy) {
  ctx.translate(-xy.x, -xy.y);
  origin.x += xy.x;
  origin.y += xy.y;
}

function checkCamera() {

  // Focus camera on drone
  var dx = Drone.actor.p.x - origin.x, dy = Drone.actor.p.y - origin.y;
  if (dx < camera_margin.x) { moveCameraBy(xy(-dx, 0)); }
  if ((game_size.x - dx) < camera_margin.x) { moveCameraBy(xy(game_size.x - dx, 0)); }
}