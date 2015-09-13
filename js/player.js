// THE PLAYER ========================================================
// it moves stuff around

var Player = {
  drone: new Drone(xy(8.5, 9.5)),
  usingItem: false,
  tutorial_state: 0,

  tick: function() {
    for (var key in this.inputControlMap) {
      var input = this.inputControlMap[key];
      if (input.isDown && typeof input.whenDown === 'function') {
        input.whenDown();
      }
    }

    this.showTutorialMessage();

    this.showMouseMessages();
  },

  draw: function() {
    // draw.c(windlayer.ctx, mouse_p, 0.1, draw.shapeStyle('red'));
    this.showScrollArrow();
  },

  showScrollArrow: function() {
    if (!Player.tutorial.has_scrolled && Player.drone.p.x > game_size.x - camera_margin.x*4) {
      var x = game_size.x - camera_margin.x;
      var y = game_size.y / 2;
      var fill = draw.shapeStyle('white', {globalAlpha: 0.5});
      draw.r(overlay.ctx,
        xy(x, y),
        xy(x + 1, y + 1),
        fill
      );
      draw.p(overlay.ctx,
        [
          xy(x + 1, y - 0.5),
          xy(x + 1, y + 1.5),
          xy(x + 2, y + 0.5)
        ],
        fill
      );
    }
  },

  showTutorialMessage: function() {
    if (this.tutorial_state in tutorial_messages) {
      var t = tutorial_messages[this.tutorial_state];
      global.label = t.msg;
      if (t.isDone()) {
        this.tutorial_state += 1;
      }
    }
    else {
      global.label = '';     
    }
  },

  showMouseMessages: function() {
    var message_shown = false;
    mouse_messages.forEach(function(item) {
      if (
        abs(mouse_p.x - item.obj.p.x) < mouse_hover_distance
        && abs(mouse_p.y - item.obj.p.y) < mouse_hover_distance
      ) {
        setLabel(item.msg);
        message_shown = true;
      }
    })
    if (!message_shown) { setLabel(global.label); }
  },

  inputControlMap: { // `crunch `crunch `crunch
    // map event.which => function
    // ADSW directions for drone
    65: {
      isDown: 0,
      whenDown: function() { Player.drone.tiltLeft(); },
      onDown: function() { Player.drone.startTiltOffset(); },
      onUp: function() { Player.tutorial.has_flown_sideways = true; }
    },
    68: {
      isDown: 0,
      whenDown: function() { Player.drone.tiltRight(); },
      onDown: function() { Player.drone.startTiltOffset(); },
      onUp: function() { Player.tutorial.has_flown_sideways = true; }
    },
    83: {
      isDown: 0,
      whenDown: function() { Player.drone.powerDown(); },
      onUp: function() { Player.tutorial.has_powered_up = true; }
    },
    87: {
      isDown: 0,
      whenDown: function() { Player.drone.powerUp(); },
      onUp: function() { Player.tutorial.has_powered_up = true; }
    },

    37: {
      isDown: 0,
      whenDown: function() { if (probability(Player.drone.controlStrength()) && Player.drone.person) Player.drone.person.p.x -= person_speed; },
      onUp: function() { Player.tutorial.has_moved_human = true; }
    },
    39: {
      isDown: 0,
      whenDown: function() { if (probability(Player.drone.controlStrength()) && Player.drone.person) Player.drone.person.p.x += person_speed; },
      onUp: function() { Player.tutorial.has_moved_human = true; }
    },
    40: {
      isDown: 0,
      onUp: function() { if (probability(Player.drone.controlStrength())) { Player.drone.person.itemInteract();} Player.tutorial.has_pickedup_item = true; }
    },
    38: {
      isDown: 0,
      onUp: function() { Player.drone.person.useItem(); Player.tutorial.has_used_item = true; }
    },

    32: {
      isDown: 0,
      whenDown: function() {
        // press spacebar to start controlling
        Player.drone.attemptControl();
        // Player.drone.attempting_control = !Player.drone.attempting_control;
      },
      // note: has_controlled gets toggled on when the human has been successfully controlled
    }
  },
}

Player.tutorial = {
  has_scrolled: false, // make sure player knows there's a camera
  has_flown_sideways: false,
  has_powered_up: false,
  has_controlled: false,
  has_used_item: false,
  has_moved_human: false,
  has_pickedup_item: false
}


// Tutorial messages
var tutorial_messages = [
  {
    msg: "Fly left and right with A and D",
    isDone: function() {
      return Player.tutorial.has_flown_sideways;
    }
  },
  {
    msg: "Power your blades up and down with W and S",
    isDone: function() {
      return Player.tutorial.has_powered_up;
    }
  },
  {
    // wait until player has found a human
    msg: "",
    isDone: function() {
      return close_people_per_tick.length > 0;;
    }
  },
  {
    msg: "Hold space to take control of a human",
    isDone: function() {
      return Player.tutorial.has_controlled;
    }
  },
  {
    msg: "Move your human with ←, →",
    isDone: function() {
      return Player.tutorial.has_moved_human;
    },
  },
  {
    msg: "Your human can pick something up with ↓",
    isDone: function() {
      return Player.tutorial.has_pickedup_item;
    },
  },
  {
    msg: "...and deliver it to you with ↑",
    isDone: function() {
      return Player.tutorial.has_used_item;
    },
  },
  {
    msg: "",
    isDone: null_function
  }
  
]




// label stuff
global.label = tutorial_messages[0].msg;
// `todo `crunch maybe this won't be useful
var mouse_messages = [
  {obj: Player.drone, msg: "DRONE"}
]

global.mouse_p = xy(0, 0);

// Input mouse events
window.addEventListener('mousemove', function(event) {
  var p = xy(
    event.x / game_scale.y + game_origin.x,
    (global.innerHeight - event.y) / game_scale.y  + game_origin.y
  )
  mouse_p = p;
})




// Input keyboard events
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