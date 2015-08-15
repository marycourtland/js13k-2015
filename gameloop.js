// GAME LOOP =========================================================

var state = {
  on: false,
};

function go() {
  if (!state.on) { return; }
  wnd.requestAnimationFrame(go);

  loop_objects.forEach(tickity);

  loop_objects.forEach(drawity);
}
