// GAME LOOP =========================================================

global.object_groups = {
  background: [],
  foreground1: [],
  foreground2: [],
  overlay: []
}

// Game state
var gameplay_on = false;
var gameplay_frame = 0;
var gameplay_t0 = 0;
var gameplay_time = 0;
var gameplay_fps = 0;
var avg_fps = 0;

var debug_period = 500; // `temp

// The drone code will only interact with these people (for slightly more efficent operation)
var close_people_per_tick = [];
var close_items_per_tick = []; // `crunch


// GAME LOOP FUNCTION
function go(time) {
  if (!gameplay_on) { return; }
  reqAnimFrame(go);

  // calculate fps
  var dt = time - gameplay_time;
  gameplay_fps = 1000 / dt;
  gameplay_time = time;
  if (gameplay_frame === 0) {
    gameplay_t0 = time;
  }
  else {
    avg_fps = (gameplay_time - gameplay_t0) / gameplay_frame;
  }

  if (gameplay_frame % debug_period === 0) {
    console.group("Frame " + gameplay_frame + " | " + time); // `temp
  }

  close_people_per_tick = [];
  close_items_per_tick = []; // `crunch

  loop_objects.forEach(function(obj) { obj.skip_tick = false; });
  loop_objects.forEach(resetify);
  loop_objects.forEach(tickity);

  if (gameplay_frame in global.schedule) {
    global.schedule[gameplay_frame].forEach(function(cb) { cb(); });
    delete global.schedule[gameplay_frame];
  }

  loop_objects.forEach(drawity);

  debug("Drone controls: ", Player.drone.person);
  debug("Person holds:   ", Player.drone.person ? Player.drone.person.inventory_item : null);
  debug("Drone energy:   ", Player.drone.energy);

  debug(" "); debug(" ");
  if (gameplay_frame % debug_period === 0)  { console.groupEnd(); } // `temp
  if (gameplay_frame in gameplay_frame_callbacks) {
    gameplay_frame_callbacks[gameplay_frame]();
  }

  gameplay_frame += 1;

}

function loopDestroy(obj) {
  delete obj.tick;
  delete obj.draw;
}

function addToLoop(group, objs) {
  if (!objs.length) { objs = [objs]; }
  objs.forEach(function(obj) {
    global.object_groups[group].push(obj);
  })
  if (gameplay_on) { refreshLoopObjects(); }
}

function refreshLoopObjects() {
  // Flatten loop objects
  global.loop_objects = object_groups.background
    .concat(object_groups.foreground1)
    .concat(object_groups.foreground2)
    .concat(object_groups.overlay);
}

function startGame() {
  refreshLoopObjects();
  gameplay_on = true;
  gameplay_frame = 0;
  reqAnimFrame(go);
}


// Scheduling events
// Maps frames > array of callbacks
global.schedule = {};

function scheduleEvent(framesFromNow, callback) {
  var scheduled_frame = gameplay_frame + framesFromNow;
  if (!(scheduled_frame in global.schedule)) {
    global.schedule[scheduled_frame] = [];
  }
  global.schedule[scheduled_frame].push(callback);
}


// For `temporary debugging
function debug() {
  if (gameplay_frame % debug_period !== 0) { return; }
  console.debug.apply(console, arguments);
}


// This stuff is sort of `temporary as well
gameplay_frame_callbacks = {};

global.onFrame = function(frame, callback) {
  gameplay_frame_callbacks[frame] = callback;
}
