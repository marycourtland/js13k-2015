// GAME LOOP =========================================================

// Game state
var gameplay_on = false;
var gameplay_frame = 0;
var debug_period = 100; // `temp

// The drone code will only interact with these people (for slightly more efficent operation)
var close_people_per_tick = [];


// GAME LOOP FUNCTION
function go(time) {
  if (!gameplay_on) { eturn; }
  wnd.requestAnimationFrame(go);
  if (gameplay_frame % debug_period === 0) console.group("Frame " + gameplay_frame + " | " + time); // `temp

  close_people_per_tick = [];

  loop_objects.forEach(tickity);
  loop_objects.forEach(drawity);

  debug("Drone controls:", Drone.person);
  debug("Close people:  ", close_people_per_tick);

  if (gameplay_frame % debug_period === 0) console.groupEnd(); // `temp
  gameplay_frame += 1;

}


// For `temporary debugging
function debug() {
  if (gameplay_frame % debug_period !== 0) { return; }
  console.debug.apply(console, arguments);
}
