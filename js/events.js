// GAME EVENTS =======================================================
// `crunch: these listeners are similar

window.addEventListener("keydown", function(event) {
  var input = Player.inputControlMap[event.which];
  if (input) {
    event.preventDefault();
    input.isDown = 1;
    if (typeof input.onDown === 'function') { input.onDown(); }
  }
});

window.addEventListener("keyup", function(event) {
  var input = Player.inputControlMap[event.which];
  if (input) {
    event.preventDefault();
    input.isDown = 0;
    if (typeof input.onUp === 'function') { input.onUp(); }
  }
});