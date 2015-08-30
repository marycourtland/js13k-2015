// SETUP =============================================================

// `todo: overlay canvas isn't being used right now. Use it for hud etc.

var canvas = $("#game_canvas"),
    ctx = canvas.getContext('2d'),
    origin = xy(0, 0)
;

var overlay = $("#game_overlay"),
    overlay_ctx = overlay.getContext('2d');


$("#game-layers").style.height = (game_size.y * game_scale.y) + "px";

[canvas, overlay].forEach(function(c) {
  c.setAttribute("width", game_size.x * game_scale.x);
  c.setAttribute("height", game_size.y * game_scale.y);
});

// x/y grid, origin at lower left corner. Positive is up and rightwards
// note: it will move left/right as the player moves camera
[ctx, overlay_ctx].forEach(function(context) {
  context.setTransform(game_scale.x, 0, 0, -game_scale.y, 0, game_size.y * game_scale.y);
  context.lineWidth = 0;
})

