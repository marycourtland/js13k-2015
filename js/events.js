// GAME EVENTS =======================================================
// `crunch: these listeners are similar

var keys_down = {};

window.addEventListener("keydown", function(event) {

  var input = Player.inputControlMap[event.which];
  if (input) {
    event.preventDefault();
    input.isDown = 1;
    if ((!(event.which in keys_down) || !keys_down[event.which]) && typeof input.onDown === 'function') {
      input.onDown();
    }
  }
  keys_down[event.which] = true;
});

window.addEventListener("keyup", function(event) {
  var input = Player.inputControlMap[event.which];
  if (input) {
    event.preventDefault();
    input.isDown = 0;
    if (typeof input.onUp === 'function') { input.onUp(); }
  }
  keys_down[event.which] = false;
});