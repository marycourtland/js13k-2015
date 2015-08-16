// GAME LOOP =========================================================

// Game state
var gameplay_on = false;
var gameplay_frame = 0;
var debug_period = 100; // `temp


// The drone code will only interact with these people (for slightly more efficent operation)
var close_people_per_tick = [];
var close_items_per_tick = []; // `crunch


// GAME LOOP FUNCTION
function go(time) {
  if (!gameplay_on) { return; }
  wnd.requestAnimationFrame(go);
  if (gameplay_frame % debug_period === 0) {
    console.group("Frame " + gameplay_frame + " | " + time); // `temp
  }

  close_people_per_tick = [];
  close_items_per_tick = []; // `crunch

  loop_objects.forEach(tickity);
  loop_objects.forEach(drawity);

  debug("Drone controls: ", Player.drone.person);
  debug("Close people:   ", close_people_per_tick);
  debug("Close items:    ", close_items_per_tick);
  debug("Battery1 held by:", battery1.container);
  debug("Battery1 held by:", battery2.container);

  debug(" "); debug(" ");
  if (gameplay_frame % debug_period === 0) console.groupEnd(); // `temp
  gameplay_frame += 1;

}

function loopDestroy(obj) {
  console.log('Destroyng:', obj);
    delete obj.tick;
    delete obj.draw;
}


// For `temporary debugging
function debug() {
  if (gameplay_frame % debug_period !== 0) { return; }
  console.debug.apply(console, arguments);
}
