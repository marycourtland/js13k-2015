// GAME EVENTS =======================================================

// `nb: this would be less janky if input check was inside the tick function

window.addEventListener("keydown", function(event) {
  if (event.which in Player.inputControlMap) {
    //event.preventDefault();
    Player.inputControlMap[event.which]();
  }
});
