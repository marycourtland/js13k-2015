// SETUP =============================================================
var canvas = $("#game_canvas"),
    ctx = canvas.getContext('2d'),
    origin = xy(0, 0)
;

canvas.setAttribute("width", game_size.x * game_scale.x);
canvas.setAttribute("height", game_size.y * game_scale.y);

// x/y grid, origin at lower left corner. Positive is up and rightwards
// note: it will move left/right as the player moves camera
ctx.setTransform(game_scale.x, 0, 0, -game_scale.y, 0, game_size.y * game_scale.y);
ctx.lineWidth = 0;

