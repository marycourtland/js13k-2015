(function() {
// HTML ==============================================================
var global = window
, doc = document
, $ = function () { return doc.querySelector.apply(doc, arguments); }
, reqAnimFrame = global.requestAnimationFrame || global.mozRequestAnimationFrame
, notify = function(msg) {
    $('#game-message').textContent = msg;
  }

// Math ==============================================================
, pi = Math.PI
, xy = function(x, y) { return {x:x, y:y}; }
, rth = function(r, th) { return {r:r, th:th}; } // r/theta circular coords
, squared = function(x) { return Math.pow(x, 2); }
, dist = function(p1, p2) {
    return Math.sqrt(squared(p1.x - p2.x) + squared(p1.y - p2.y));
  }
, midpoint = function(p1, p2) {
    return xy(p1.x + (p2.x - p1.x)/2, p1.y + (p2.y - p1.y)/2);
  }
, sin = Math.sin
, cos = Math.cos
, abs = Math.abs
, min = Math.min
, max = Math.max
, rnd = Math.random
, rnds = function(a, b) {
  if (typeof b === 'undefined') { b = a; a = 0; }
    return a + rnd() * (b - a);
  }
, rnd_choice = function(array) {
    return array[Math.floor(rnds(array.length))];
  }
, probability = function(n) { return rnd() < n; }
, vec_add = function(p1, p2) {
    return xy(p1.x + p2.x, p1.y + p2.y)
  }
, polar2cart = function(p) {
    return xy(
      p.r * cos(p.th),
      p.r * sin(p.th)
    )
  }
, interpolate = function(x, p1, p2) { // Linear
    if (!p1) { return xy(p2.x, p2.y); }
    if (!p2) { return xy(p1.x, p1.y); }
    if (p1.x === p2.x) { return xy(p1.x, p2.y); }

    var f = (x - p1.x) / (p2.x - p1.x);
    return xy(x, p1.y + f*(p2.y - p1.y));
  }
, roundTo = function(x, n) {
    return Math.round(x / n) * n;
  }
, floorTo = function(x, n) {
    return Math.floor(x / n) * n;
  }
, ceilTo = function(x, n) {
    return Math.ceil(x / n) * n;
  }
, bounds = function(x, bounds) {
    return max(min(x, max.apply(null, bounds)), min.apply(null, bounds));
  }

// other stuff...
, resetify = function(item) { if (item.reset) item.reset(); }
, tickity = function(item) { if (item.tick && !item.skip_tick) item.tick(); }
, drawity = function(item) { if (item.draw) item.draw(); }

, null_function = function() {}

;
// All 2d points should be input as {x:xval, y:yval}

var draw = {
  // Utility method - apply params only for a particular drawing
  do: function(ctx, params, draw_function) {
    params = params || {};
    ctx.save();
    for (var p in params) { ctx[p] = params[p]; }
    ctx.beginPath();
    draw_function();
    if (params.cls) { ctx.closePath(); }
    if (params.fll) { ctx.fill(); }
    if (params.strk) { ctx.stroke(); }
    ctx.restore();
  },

  shapeStyle: function(color, extra) {
    var output = {fillStyle: color, strk: 0, fll: 1, cls: 1};
    for (var s in extra) { output[s] = extra[s]; };
    return output;
  },

  lineStyle: function(color, extra) {
    var output = {strokeStyle: color, strk: 1, fll: 0, cls: 0, lineWidth: 0.1};
    for (var s in extra) { output[s] = extra[s]; };
    return output;
  },

  // Clear
  clr: function(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  },

  // Fill
  f: function(ctx, params) {
    params = params || this.shapeStyle("#fff");
    this.do(ctx, params, function() {
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    })
  },

  // Line
  l: function(ctx, p0, p1, params) {
    params = params || this.lineStyle("#fff");
    this.do(ctx, params, function() {
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.moveTo(p1.x, p1.y);
    })
  },

  // Rectangle
  r: function(ctx, p0, p1, params) {
    params = params || this.shapeStyle("#fff");
    this.do(ctx, params, function() {
      ctx.rect(p0.x, p0.y, p1.x-p0.x, p1.y-p0.y);
    })
  },

  // Circle
  c: function(ctx, center, radius, params) {
    this.a(ctx, center, radius, 0, 2*Math.PI, params);
  },

  // Arc
  a: function(ctx, center, radius, angle1, angle2, params) {
    params = params || this.lineStyle("#fff");
    this.do(ctx, params, function() {
      ctx.arc(center.x, center.y, radius, angle1, angle2, false);
    })
  },

  // Bezier
  b: function(ctx, p0, p1, c0, c1, params) {
    params = params || this.lineStyle("#fff");
    this.do(ctx, params, function() {
      ctx.moveTo(p0.x, p0.y);
      ctx.bezierCurveTo(c0.x, c0.y, c1.x, c1.y, p1.x, p1.y);
    });
  },

  // Polygon
  // `todo convert pts to xy rather than array
  p: function(ctx, pts, params) {
    params = params || this.lineStyle("#fff");
    this.do(ctx, params, function() {
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach(function(p) {
        ctx.lineTo(p.x, p.y);
      })
    })
  }
}
// All units in game units except for game_scale

// Game and camera settings
var game_scale = xy(15, 15) // pixels -> game units conversion
,   game_size = xy((global.innerWidth - 20)/game_scale.x, 30)
,   camera_margin = xy(4, 4)
,   units_per_meter = 2 // for realistic size conversions

// Aesthetic stuff
,   backgroundGradient = [
        // gradient color stops
        [1.0, '#111320'],
        [0.85, '#17182a'],
        [0.7, '#1f2035'],
        [0.4, '#433b4b'],
        [0.0, '#a16e4f']
    ]
,   awesome_glow_color = '#fff'

// Environment
,   environment_color = '#1b1b1b'
,   tower_color = '#222'
,   num_tower_clumps = 30
,   num_towers_per_clump = 10
,   tower_clump_width = 80

// Buildings
,   building_color = '#2E272E'
,   door_color = '#665'
,   door_size = xy(0.7, 1.2) // slightly larger than person

// Dynamics
// *** Gravity estimate is very sensitive to FPS measurement
,   min_dynamics_frame = 5
,   gravAccel = function() { return xy(0, gameplay_frame < min_dynamics_frame ? 0 : -9.8 / 2 / bounds(avg_fps * avg_fps, [0, 1000])); } // 9.8 m/s^2 translated to units/frame^2
,   droneTiltAccel = 0.001
,   dronePowerAccel = 0.0001
,   max_tilt = pi/4
,   tilt_decay = 0.1

,   tiltOffset = function(depth) {
      // `todo: customize this function with depth; then have successive keydown events (i.e. key being held down) increase the depth
      return function(t) {
        t += 1; // so that the zero thingy isn't triggered
        t *= 0.2; // for scaling
        return -max(0, 1.5*Math.exp(-t/2)*t/1.5);
      }
    }

// Lightning
,   lightning_chance = 0.001        // Chance that lightning will start on any given frame
,   lightning_chance_drone = 0.3   // Of each lightning strike, chance that it will hit the drone

// People
,   person_size = xy(0.3, 0.6)
,   person_color = '#000'
,   person_speed = 0.3
,   controlled_person_color = '#300'
,   person_control_rate = 0.05 // rate at which control level increases or drops
,   min_person_resistance = 2 * person_control_rate
,   person_interaction_window = 8
,   interaction_distance = 1


// Drone
,   drone_body_size = xy(0.3, 0.2)
,   drone_arm_size = xy(0.4, 0.05) // from center
,   drone_blade_size = xy(0.5, 0.1)
,   drone_color = '#000'
,   drone_signal_color = '#9eb'
,   drone_drain_rate = 0.00005 // energy per frame
,   drone_low_energy = 0.1
,   drone_high_energy = 0.9
,   drone_max_sideways_accel = 0.01

// Items
,   battery_size = {x: 0.5, y: 0.3}
,   battery_color = "#000"


// Ideas
,   idea_scale = 0.7
,   idea_color = "#ddd"

// HUD - positions are referenced from the upper right corner of game
,   hud_color = '#abb'
,   hud_color_dark = '#355'
,   hud_red = '#811'
,   hud_green = '#161'
,   hud_dial_radius = 1
,   energy_meter_position = xy(-12, -1.5)
,   energy_meter_size = xy(4, 0.5)
,   rpm_meter_position = xy(-3, -1.5)

;
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


// CAMERA ============================================================

var Camera = {
  tick: function() {
    this.focusOnPlayerDrone();
  },

  moveBy: function(xy) {
    ctx.translate(-xy.x, -xy.y);
    origin.x += xy.x;
    origin.y += xy.y;
  },

  focusOnPlayerDrone: function() {
    var dx = Player.drone.p.x - origin.x, dy = Player.drone.p.y - origin.y;
    if (dx < camera_margin.x) { this.moveBy(xy(dx - camera_margin.x, 0)); }
    if ((game_size.x - dx) < camera_margin.x) { this.moveBy(xy(camera_margin.x - (game_size.x - dx), 0)); }

  }
}

// `crunch: that constructor is a mess, ha!

var Platform = function(origin, xres, xrange, ypoints, thickness) {
  this.origin = origin; // this is an xy position
  this.y0 = origin.y;
  this.xres = xres;
  this.xres_offset = xrange[0] % xres;
  this.xrange = xrange;
  this.y = ypoints;
  this.thickness = thickness;

  this.yAt = function(x) {
    return this.pointAt(x).y;
  }

  this.pointAt = function(x) {
    x = bounds(x, [this.xrange[0], this.xrange[1]]);
    var x1 = floorTo(x - this.xres_offset, this.xres) + this.xres_offset;
    var x2 = ceilTo(x - this.xres_offset, this.xres) + this.xres_offset;
    return interpolate(x,
      xy(x1, this.y[x1]),
      xy(x2, this.y[x2])
    );
  };

  this.getPolygon = function(thickness) {
    var pts = [];
    pts.push(xy(this.xrange[0], this.y0 - thickness));
    for (var x = this.xrange[0]; x <= this.xrange[1]; x += this.xres) {
      pts.push(xy(x, this.y[x]));
    }
    pts.push(xy(this.xrange[1], this.y0 - thickness));
    return pts;
  };

  this.pts = this.getPolygon(this.thickness);

  this.drawRepr = function(style) {
    draw.p(ctx, this.pts, style);
  }
};

// Make a simple two-point platform
// `crunch: this might not be really necessary
// origin is the lower left corner
function makePlatform(origin, size) {
  var y = {};
  y[origin.x] = origin.y + size.y;
  y[origin.x + size.x] = origin.y + size.y;
  return new Platform(xy(origin.x, origin.y + size.y), size.x, [origin.x, origin.x + size.x], y, size.y);
}
// Buildings:
// (a) exist on other platforms (like the ground)
// (b) provide more platforms (like their roof) - NOT FULLY DECIDED/IMPLEMENTED - `todo `decide
// (c) can store people inside
// (d) have a doorway to admit people

// position p is the building's center

global.buildings = []; // index of all buildings in game

function Building(x0, size, platform) {
  this.container_platform = platform || environment.ground;
  this.p = this.container_platform.pointAt(x0); // lower left corner
  this.size = size; // xy of width and height
  this.platforms = [];
  this.people = [];
  this.door_p = vec_add(this.p, xy(rnd() * this.size.x, 0));
  this.__proto__.setupPlatform.call(this, makePlatform(this.p, this.size));
  global.buildings.push(this);
}

Building.prototype = {

  // peopleCounts: maps person role -> number of people
  prepopulate: function(peopleCounts) {
    for (var roleName in peopleCounts) {
      var role = roles[roleName];
      for (var i = 0; i < peopleCounts[roleName]; i++) {
        var p = (new Person()).init({platform: this, role: role});
        this.personEnter(p);
        addToLoop('foreground1', p);
      }
    }
  },

  tick: function() {
  },

  draw: function() {
    this.platforms[0].drawRepr(draw.shapeStyle(building_color));
    draw.r(ctx, this.door_p, vec_add(this.door_p, door_size), draw.shapeStyle(door_color));
  },

  setupPlatform: function(platform) {
    this.platforms.push(platform);
    // `todo: a way for people to access the platform
  },


  personEnter: function(person) {
    person.hidden = true;
    person.platform = this;
    this.people.push(person);
  },

  personExit: function() {
    if (this.people.length === 0) { return; }
    var person = this.people.shift(); // take first person
    person.hidden = false;
    person.platform = this.container_platform;
    return person;
  },

  // make it function like a platform
  pointAt: function() { return xy(this.door_p.x + door_size.x/2, this.door_p.y); },
  yAt: function() { return this.door_p.y; }
}
// ENVIRONMENT =======================================================
var environment = {
  ground: new Platform(xy(-100, 3), 0.5, [-100, 1000], {}),

  // Height
  pts: [],
  towers: [], // Towers in the skyline represented by [x, width, height]


  // Game loop

  reset: function() {
    // Background
    // (even though this is drawing-related, it needs to come before anything else)
    var grd = ctx.createLinearGradient(0, 0, 0, game_size.y * 1.2);
    backgroundGradient.forEach(function(params) {
      grd.addColorStop.apply(grd, params);
    })
    draw.r(ctx, origin, xy(origin.x + game_size.x, origin.y + game_size.y), draw.shapeStyle(grd));

    // Draw towers (decorative only for now)
    // (subtract 0.5 so that there's no gap betw ground and tower. `temp)
    this.towers.forEach(function(tower) {
      var x1 = tower.x - tower.w/2;
      var x2 = tower.x + tower.w/2;
      var y0 = min(environment.ground.pointAt(x1).y, environment.ground.pointAt(x2).y);
      draw.r(ctx,
        xy(x1, y0 - 0.5),
        xy(x2, y0 + tower.h),
        draw.shapeStyle(tower_color)
      )
    })
  },


  tick: function() {},

  draw: function() {
    // Ground
    var fill = draw.shapeStyle(environment_color);
    draw.p(ctx, this.pts, fill);
  },

  generate: function() {
    this.pts.push(xy(this.ground.xrange[0], 0));
    var terrain = this.generateTerrainFunction();
    for (var x = this.ground.xrange[0]; x < this.ground.xrange[1]; x += this.ground.xres) {

      this.ground.y[x] = this.ground.y0 + terrain(x);
      this.pts.push(xy(x, this.ground.y[x]));
    }
    this.pts.push(xy(this.ground.xrange[1],0));

    for (var i = 0; i < num_tower_clumps; i++) {
      this.generateTowerClump();
    }
  },

  generateTowerClump: function() {
    var x0 = rnds.apply(global, this.ground.xrange);
    var n = num_towers_per_clump + rnds(-3, 3);

    for (var i = 0; i < n; i++) {
      this.towers.push({
        x: rnds(x0 - tower_clump_width/2, x0 + tower_clump_width/2),
        w: rnds(4, 7),
        h: rnds(5, 20)
      })

    }
  },

  generateTerrainFunction: function() {
    var frequencies = [];
    for (var i = 0; i < 10; i++) {
      frequencies.push(1/rnds(1, 5));
    }

    // some lower-frequency rolling
    frequencies.push(1/rnds(10, 12));

    return function(x) {
      var y = 0;
      frequencies.forEach(function(f) {
        y += 1/(f * 100) * sin(f*x + rnds(0, 0.5));
      })
      return y;
    }

  }
}

// Each idea is global; person objects have refs to the same idea object
// Ideas are not included in the game loop

function Idea(name, options) {
  options = options || {};
  this.name = name;

  // This drawing method will be drawn right above the people talking about it
  // arguments: p, scale, style
  this.drawRepr = options.draw || null_function;
}

// ACTORS ============================================================
// they move around
// ** parent object

function Actor(p) {
  this.p = p || xy(0, 0);
  this.v = xy(0, 0);
  this.gravity = false;
  this.platform = environment.ground;
  this.stay_on_platform = false;

  this.tick = function() {
    this.p.x += this.v.x;
    this.p.y += this.v.y;

    if (this.gravity) {
      this.v = vec_add(this.v, gravAccel());
    }

    // Ground collision
    var y0 = this.platform.yAt(this.p.x);
    if (this.p.y < y0) {
      this.p.y = y0;

      // Don't do this every frame so that actor doesn't get stuck
      this.v.y = max(this.v.y, 0);
      // this.color = 'red';
    }

    if (this.stay_on_platform) {
      // Set y coordinate to be the platform's y coordinate
      this.p =this.platform.pointAt(this.p.x);
    }

    this.handleBehavior();
  }

  // Behavior stuff ============================

  this.behaviors = {
    idle: function() {
      // do nothing
      return;
    }
  }

  this.current_behavior = 'idle';
  this.current_behavior_timeleft = -1;
  this.current_behavior_params = {};

  this.handleBehavior = function() {
    this.current_behavior_timeleft -= 1;
    
    var start_behavior = false;
    if (this.current_behavior_timeleft < 0) {
      this.switchBehavior();
      start_behavior = true;
    }

    this.behaviors[this.current_behavior].call(this, start_behavior);
  }

  this.switchBehavior = function(new_behavior) {
    // For now, choose another behavior at random
    this.current_behavior = new_behavior || rnd_choice(Object.keys(this.behaviors));
    this.current_behavior_timeleft = rnds(50, 300);
  };

}

// PEOPLE ============================================================

function Person() {
  this.p = xy(0, 0);
  this.color = person_color;
  this.drone_distance = null; // only relevant when person is within the interaction window
  this.inventory_item = null; // each person can only hold 1 thing at a time
  this.resistance = rnd();
  this.control_level = 0;     // the person is fully controlled when this exceeds the resistance measure
  this.talking_dir = 0;
  this.stay_on_platform = true;
  this.role = roles.normal;
  this.hidden = false;

  this.init = function(properties) {
    for (var prop in properties) {
      this[prop] = properties[prop];
    }

    this.addIdea(global.ideas.smalltalk);

    return this;
  }


  this.behaviors = {
    idle: function(start) {
      // do nothing
      if (start) { this.v = xy(0, 0); }
      return;
    },

    amble: function(start) {
      if (Player.drone.person === this) { return; }
      // Set a new velocity
      if (start) { this.v = xy(rnds(-1, 1) / 20, 0); }
    },

    talk: function(start) {
      var target_person = this.current_behavior_params.person;
      if (!target_person) return;

      var d = target_person.p.x - this.p.x;

      if (abs(d) > interaction_distance) {
        // move toward target person
        this.v = xy(0.5/20, 0);
        if (d < 0) { this.v.x *= -1; }

        // delay starting the countdown until the person has been reached
        this.current_behavior_timeleft += 1;
      }
      else {
        // talk to the person
        this.v = xy(0, 0);
        this.talking_dir = abs(d)/d;
        this.talking_idea = this.latest_idea;
        target_person.addIdea(this.talking_idea);
      }
    }
  }

  this.switchBehavior = function(new_behavior) {
    if (!new_behavior) {
      // Switch between walking and idle
      new_behavior = 'idle';
      //new_behavior = this.current_behavior === 'amble' ? 'idle' : 'amble'
    }
    // For now, choose another behavior at random
    this.current_behavior = new_behavior;
    this.current_behavior_timeleft = rnds(50, 100);
  };

  this.talkTo = function(person) {
    this.current_behavior_params = {person: person};
    this.switchBehavior('talk');
  };

  this.talkToClosestPerson = function() {
    this.talkTo(this.getClosestPerson());
  }


  // `crunch `crunch `crunch - this method is basically the same as all the other 'getClosestX' functions
  // maybe put it in the Actor
  this.getClosestPerson = function() {
    // `todo `todo `todo!
    return global.p3;
  }

  // Roles ======================================================

  this.byRole = function(method) {
    if (!(method in this.role)) { console.warn('Uh oh, person role does not have method:', method); return; }
    this.role[method].apply(this);
  }


  // Game loop / drawing ========================================

  this.reset = function() {
    this.talking_dir = 0;

    if (abs(Player.drone.p.x - this.p.x) < person_interaction_window) {
      close_people_per_tick.push(this);
      this.drone_distance = dist(this.p, Player.drone.p);
    }
  }

  this.tick = function() {
    this.__proto__.tick.apply(this);

    if (this.control_level < this.resistance && this.control_level > 0) {
      // Decay the control level
      this.control_level -= person_control_rate;
      this.control_level = max(this.control_level, 0);
    }
  }

  this.draw = function() {
    if (this.hidden) { return; }

    var dir = this.v.x;
    this.drawRepr(this.p, 1.3, draw.shapeStyle(drone_signal_color, {globalAlpha: this.control_level * Player.drone.controlStrength(this)}), dir);
    this.drawRepr(this.p, 1, draw.shapeStyle(this.color), dir);

    if (this.talking_dir !== 0) {
      this.drawSpeechSquiggles(this.talking_dir);
      this.talking_idea.drawRepr(vec_add(this.p, xy(this.talking_dir * 0.5, 1.2)), idea_scale, draw.shapeStyle(idea_color));
    }

    this.byRole('draw');
  }

  this.drawRepr = function(p, scale, fill, dir) {
    // Dir should be negative (person facing leftwards), 0 (forwards), or positive (rightwards)
    // `CRUNCH
    dir = dir || 0;

    var scaled_size = xy(scale * person_size.x, scale * person_size.y);
    p = vec_add(p, xy(0, -(scaled_size.y - person_size.y)/2));

    // for displaying the person walking left/right
    var x1_offset_scale = (dir < 0 ? 1/3 : 1/2);
    var x2_offset_scale = (dir > 0 ? 1/3 : 1/2);

    var radius = scaled_size.x/3; // head

    var x1 = dir < 0 ? p.x : p.x - scaled_size.x/2;
    var x2 = dir > 0 ? p.x : p.x + scaled_size.x/2;


    draw.r(ctx,
      // `crunch 
      xy(p.x - scaled_size.x * x1_offset_scale, p.y),
      xy(p.x + scaled_size.x * x2_offset_scale, p.y + scaled_size.y - radius),
      fill
    );

    draw.c(ctx,
      xy(p.x, p.y + scaled_size.y - radius),
      radius,
      fill
    );

    draw.c(ctx,
      xy(p.x, p.y + scaled_size.y + radius),
      radius,
      fill
    );
  }

  this.drawSash = function(color) {
    var ps = person_size;
    draw.p(ctx, [
        vec_add(this.p, xy(-ps.x/2, 0)),
        vec_add(this.p, xy(-ps.x/2, ps.x/2)),
        vec_add(this.p, xy(ps.x/2, ps.y-ps.x/4)),
        vec_add(this.p, xy(ps.x/2, ps.y-3*ps.x/4))
      ],
      draw.shapeStyle(color)
    )
  }

  this.drawTopHat = function(color) {
    var ps = person_size;
    var y = ps.y + 2*ps.x/3;
    draw.r(ctx,
      vec_add(this.p, xy(-ps.x/4, y)),
      vec_add(this.p, xy(ps.x/4, y + ps.x)),
      draw.shapeStyle(color)
    );
    draw.r(ctx,
      vec_add(this.p, xy(-ps.x/2, y)),
      vec_add(this.p, xy(ps.x/2, y + ps.x/3)),
      draw.shapeStyle(color)
    );
  }

  this.drawSpeechSquiggles = function(dir) {
    // `crunch
    var x = this.p.x + dir * 0.2;
    var y = this.p.y + person_size.y + 0.02;
    // draw.l(ctx, xy(x, y), xy(x+0.3, y), draw.lineStyle('#000', {lineWidth: 0.05}));
    var strk = draw.lineStyle('#000', {lineWidth: 0.05})

    draw.b(ctx,
      xy(x, y), xy( x + dir*0.3, y - 0.2),
      xy(x + dir*0.1, y), xy(x + dir*0.4, y - 0.1),
      strk
    );

    y += 0.1;

    draw.b(ctx,
      xy(x, y), xy(x + dir*0.3, y + 0.2),
      xy(x + dir*0.1, y), xy(x + dir*0.4, y + 0.1),
      strk
    );

    y -= 0.05;

    draw.l(ctx, xy(x + dir*0.2, y), xy(x + dir*0.4, y), strk)

  }

  // Items ======================================================

  this.hold = function(item) {
    this.inventory_item = item;
    item.container = this;
  }


  this.drop = function() {
    if (!this.inventory_item) return;
    this.inventory_item.p = this.platform.pointAt(this.inventory_item.p.x);
    this.inventory_item.platform = this.platform;
    this.inventory_item.container = null;
    this.inventory_item = null;
  }

  this.itemInteract = function() {
    // `todo: search for nearby items (instead of using the sample battery)
    if (this.inventory_item) {
      this.drop();
    }
    else {
      var closeItem = this.getClosestItem();
      if (closeItem && dist(this.p, closeItem.p) < interaction_distance) {
        this.hold(closeItem);
      }
    }
  }

  this.useItem = function() {
    if (!this.inventory_item) {
      this.tryToEnterBuilding();
    }
    else {
      this.inventory_item.use(); 
    }
  }

  // `crunch `crunch `crunch - this method is basically the same as drone.getClosestPerson
  this.getClosestItem = function() {
    if (close_items_per_tick.length === 0) { return null; }
    return close_items_per_tick.reduce(function(closestItem, nextItem) {
      return (nextItem.person_distance < closestItem.person_distance ? nextItem : closestItem);
    }, {person_distance:9999});
  }

  // Buildings/doors

  this.tryToEnterBuilding = function() {
    var person = this;
    global.buildings.forEach(function(b) {
      if (dist(person.p, b.door_p) < interaction_distance) {
        b.personEnter(person);
        return;
      }
    })
  }


  // Ideas ======================================================

  // Maps ideas => number of times the idea has come to them
  this.ideas = {};
  this.latest_idea = null; // most recent idea

  this.hasIdea = function(idea) {
    return idea.name in this.ideas;
  }

  this.addIdea = function(idea) {
    if (idea === null) { return; }

    if (!this.hasIdea(idea)) {
      this.ideas[idea.name] = 0;
    }
    this.ideas[idea.name] += 1;
    this.latest_idea = idea;
  }

}

Person.prototype = new Actor();
// An npc person's role influences various things
// and they all are displayed through some visual 
// like a hat, sash, or whatever
//
// Functions (all called with the person as `this`)
//    draw: called right after the person is drawn
//    onControl: an event triggered when the npc is controlled (by the player drone)

function Role(options) {
  this.draw = options.draw || null_function;
  this.onControl = options.onControl || null_function;
};

var roles = {
  normal: new Role({
    draw: function() {
      this.drawSash('green');
    }
  }),

  game_target: new Role({
    draw: function() {
      this.drawTopHat(person_color);
      this.drawSash('red');
    },

    onControl: function() {
      notify('You have won. Congratulations.');
    }
  })
}
// THE DRONE =========================================================

var Drone = function(p) {
  this.p = p;
  this.p_drawn = p;
  this.gravity = true;
  this.energy = 1; // goes from 0 to 1
  this.powered = true;
  this.rpm_scale = 0.83;
  this.control_t0 = 0;
  this.control_signal_target = null;
  this.rpm_scale = 0.83; // starting value
  this.rpm_diff = 0; // Negative: tilted leftwards. Positive: tilted rightwards
  this.color = 'black';
  this.tilt = 0; // goes from -pi/2 (left tilt) to pi/2 (right tilt)

  this.offset = 0; //vertical only, for now
  this.offsets = {}; // map starting frames > offset-computing-functions
  // `nb: this precludes dual offsets. Could be solved by composing the offset functions

  this.person = null,

  this.reset = function() {
    // compute position offset
    this.offset = 0;
    for (var frame in this.offsets) {
      var t = gameplay_frame - frame;
      var offset = this.offsets[frame](t);

      // Stop computing the offset after it decays enough
      // `nb: this means there can't be offset patterns which oscillate around 0
      if (abs(offset) < 0.001) {
        delete this.offsets[frame];
      }
      else {
        this.offset += offset;
      }
    }
  }


  this.tick = function() {
    // acceleration given by copter blades
    this.v = vec_add(this.v, this.getLiftAccel());

    // decay the tilt
    this.tilt *= 0.9;

    // introduce a good bit of sideways drag
    this.v.x *= 0.95;
    this.rpm_diff += (this.rpm_diff > 0 ? -0.003 : 0.003);

    //this will take care of gravity
    this.__proto__.tick.apply(this);

    this.energy = max(this.energy - this.getEnergyDrain(), 0);

    if (this.energy == 0) {
      this.die();
    }

    // The drone's *actual* drawn position is offset a bit
    // this is for better aerodynamic fakery
    this.p_drawn = xy(this.p.x, this.p.y + this.offset);


    this.rpm_scale = bounds(this.rpm_scale, [0, 1]);
    this.rpm_diff = bounds(this.rpm_diff, [-1, 1]);
    this.tilt = bounds(this.tilt, [-pi/2, pi/2]);
  }

  this.draw = function() { 
    // signal to person
    if (this.control_signal_target) {
      draw.l(ctx,
        this.p_drawn,
        this.control_signal_target,
        draw.lineStyle(drone_signal_color, {globalAlpha: this.controlStrength(this.control_signal_target)})
      );
      this.control_signal_target = null; // to be re-set
    }

    // The drone itself
    this.drawRepr(this.p_drawn, 1, draw.shapeStyle(this.color), this.tilt);
  }

  this.drawRepr = function(p, scale, fill, tilt) {
    // `CRUNCH: This whole method
    tilt = tilt || 0;
    ctx.translate(p.x, p.y);
    ctx.rotate(-tilt);

    var strk = draw.lineStyle(fill.fillStyle, {lineWidth: scale * drone_arm_size.y});

    var width = scale * drone_body_size.x/2;
    var height = scale * drone_body_size.y/2;

    var arm_x = scale * drone_arm_size.x;
    var arm_y = scale * drone_arm_size.y/2;

    var blade_x = scale * drone_blade_size.x/2;
    var blade_y = scale * drone_blade_size.y/2;

    // body
    draw.r(ctx,
      // `crunch
      xy(- width, - height),
      xy(+ width, + height),
      fill
    );

    // arms
    draw.l(ctx,
      xy(- arm_x, + height + arm_y),
      xy(+ arm_x, + height + arm_y),
      strk
    )

    // copter blades above arms
    function drawBlade(xpos, xscale) {
      // `crunch
      draw.r(ctx,
        xy(xpos - xscale * blade_x, height + arm_y*2 + 0.05),
        xy(xpos + xscale * blade_x, height + arm_y*2 + 0.05 + blade_y*2),
        fill
      );
      draw.l(ctx,
        xy(xpos, height + arm_y),
        xy(xpos, height + arm_y*2 + 0.1),
        strk
      )
    }

    var f = 0.8;
    var blade_phase = (this.powered && (typeof this.rpm_scale !== 'undefined')) ? this.rpm_scale * gameplay_frame : 0.8;
    drawBlade(scale * drone_arm_size.x - 0.05, sin(f * blade_phase));
    drawBlade(-scale * drone_arm_size.x + 0.05, sin(f * blade_phase));

    ctx.rotate(tilt);
    ctx.translate(-p.x, -p.y);
  }

  this.die = function() {
      this.powered = false;
      this.rpm_scale = 0;
      notify('Your battery is drained. Refresh to play again.')
  }
  
  // Fake aerodynamics! ========================================================

  this.getLiftAccel = function() {
    // Note: this isn't physically accurate :)
    // For balancing purposes, full lift should be a little higher than gravity
    var y = this.powered ? -1.2 * gravAccel().y * this.rpm_scale : 0;
    var x = this.powered ? this.rpm_diff * drone_max_sideways_accel : 0;
    return xy(x, y);
  }

  // to be more responsive, these methods adjust velocity immediately as well as
  // contributing to acceleration
  this.powerUp = function() {
    this.v.y += 0.05;
    this.rpm_scale += dronePowerAccel;
  }
  
  this.powerDown = function() {
    this.v.y -= 0.05;
    this.rpm_scale -= dronePowerAccel;
  }

  this.tiltLeft = function() {
    this.v.x -= 0.1;
    this.rpm_diff -= droneTiltAccel;
    this.tilt = -max_tilt;
  }

  this.tiltRight = function() {
    this.v.x += 0.1;
    this.rpm_diff += droneTiltAccel;
    this.tilt = max_tilt;
  }

  this.startTiltOffset = function() {
    this.offsets[gameplay_frame] = tiltOffset();
  }


  // Controlling people ========================================================

  this.controlStrength = function(person) {
    return 1;
    // On scale from 0 to 1, depending on how near drone is to person
    person = person || this.person;
    if (!person) { return 0; }
    return 0.5 + Math.atan(20 - dist(this.p, person.p))/pi;
  }

  this.uncontrol = function() {
    if (!this.person) return;
    this.person.color = person_color;

    // The newly released person's willpower has been decreased;
    // it will be easier to re-control them in the future
    this.person.control_level = 0;

    // Now the person is eager to talk about their experience
    this.person.addIdea(global.ideas.drone);
    this.person.talkToClosestPerson();

    this.person = null;
  }

  this.controlFull = function(person) {
    if (person === this.person) { return; } // already controlling
    this.uncontrol(); // Only control one at a time!
    this.person = person;
    this.person.color = controlled_person_color;
    this.person.control_level = 1;
    // Once a person is fully controlled, their resistance drops very low
    this.person.resistance = min_person_resistance;

    this.person.byRole('onControl');
  }

  this.attemptControl = function() {
    var person = this.getClosestPerson();
    console.debug('Control person:', person);

    // square the control strength so that it's more limited
    if (person && probability(squared(this.controlStrength()))) {
      person.control_level += person_control_rate * 2; // multiplied by two to counteract the decay
      this.control_signal_target = vec_add(person.p, xy(0, person_size.y));

      // the person will notice the drone, so they'll get the idea of the drone
      person.addIdea(global.ideas.drone);

    }
    else {
      this.control_signal_target = null;
    }

    // If the control level on the person exceeds their resistance, the person has been overpowered
    if (person.control_level >= person.resistance) {
      this.controlFull(person);
    }
  }

  this.getClosestPerson = function() {
    console.log('close_people_per_tick:', close_people_per_tick);
    if (close_people_per_tick.length === 0) { return null; }
    return close_people_per_tick.reduce(function(closestPerson, nextPerson) {
      return (nextPerson.drone_distance < closestPerson.drone_distance ? nextPerson : closestPerson);
    }, {drone_distance:9999});
  }


  // Energy related ========================================================

  this.fillEnergy = function() {
    this.energy = 1;
  }

  this.getEnergyDrain = function() {
    // per frame
    // this combines all the possible factors which contribute to energy drain;
    return drone_drain_rate * this.rpm_scale;
  }

}

Drone.prototype = new Actor();

// THE PLAYER ========================================================
// it moves stuff around

var Player = {
  drone: new Drone(xy(10, 10.05)),
  usingItem: false,

  tick: function() {
    for (var key in this.inputControlMap) {
      var input = this.inputControlMap[key];
      if (input.isDown && typeof input.whenDown === 'function') {
        input.whenDown();
      }
    }
  },

  inputControlMap: { // `crunch `crunch `crunch
    // map event.which => function
    // ADSW directions for drone
    65: {isDown: 0, whenDown: function() { Player.drone.tiltLeft(); }, onDown: function() { Player.drone.startTiltOffset(); }},
    68: {isDown: 0, whenDown: function() { Player.drone.tiltRight(); }, onDown: function() { Player.drone.startTiltOffset(); }},
    83: {isDown: 0, whenDown: function() { Player.drone.powerDown(); }},
    87: {isDown: 0, whenDown: function() { Player.drone.powerUp(); }},
    37: {isDown: 0, whenDown: function() { if (probability(Player.drone.controlStrength())) Player.drone.person.p.x -= person_speed; }},
    39: {isDown: 0, whenDown: function() { if (probability(Player.drone.controlStrength())) Player.drone.person.p.x += person_speed; }},
    40: {isDown: 0, onUp: function() { if (probability(Player.drone.controlStrength())) { console.log('ok'); Player.drone.person.itemInteract();} }},
    38: {isDown: 0, onUp: function() { Player.drone.person.useItem(); }},
    32: {isDown: 0, whenDown: function() {
      // Player must hold down spacebar for the requisite length of time
      Player.drone.attemptControl();
    }}
  },
}

// LIGHTNING  ========================================================
// `experiment
lightning = {
  timeleft: -1,
  target: null,
  pts: [],
  onFinish: null,

  reset: function() {
    if (this.target) {
      this.target.skip_tick = true; // freeze the object for the duration of the lightning strike
    }
  },

  tick: function() {
    if (this.timeleft >= 0) {
      this.timeleft -= 1;
    }
    else {
      this.target = null;
      if (typeof this.onFinish === 'function') { this.onFinish(); this.onFinish = null; }
    }

    if (probability(lightning_chance)) {
      probability(lightning_chance_drone) ? this.strikeDrone() : this.strike();
    }
  },

  draw: function() {
    if (this.timeleft < 0) { return; }
    var glowdata = [
      // color, linewidth, alpha
      ['#aaf', 0.5, 0.05],
      ['#aaf', 0.3, 0.05],
      ['#aaf', 0.1, 0.5],
      ['#ccf', 0.05, 1]
    ];
    var pts = this.pts;
    glowdata.forEach(function(data) {
      draw.p(ctx, pts, draw.lineStyle(data[0], {lineWidth: data[1], globalAlpha: data[2]}))
    })
  },

  // original algorithm - random walk
  // `nb - this is not used anymore! So I guess it's `temp
  regenerate_randomwalk: function() {
    // Pick an origin point in the sky and random walk downwards
    var x = rnds(game_size.x + origin.x), y = game_size.y;
    this.pts = [xy(x, y)];
    var p = 0;
    while (y > environment.ground.yAt(x)) {
      x += rnds(-0.4, 0.4);
      y -= rnds(0.5, 1);
      this.pts.push(xy(x, y));
    }
  },

  strikeDrone: function() {
    this.target = Player.drone;
    this.strike(Player.drone.p_drawn);
    var old_drone_color = Player.drone.color;
    Player.drone.color = '#bbf';
    this.onFinish = function() {
      Player.drone.color = old_drone_color;
      console.debug('Done');
    }
  },

  strike: function(target_pos) {
    if (!target_pos) {
      var x = rnds(game_size.x + origin.x)
      target_pos = environment.ground.pointAt(x);
    }
    var origin_pos = xy(target_pos.x + rnds(-5, 5), game_size.y)

    this.regenerate(origin_pos, target_pos);
    this.timeleft = rnds(10, 50);
  },

  // NEW ALGORITHM
  regenerate: function(origin, dest) {
    var seg0 = {p1: origin, p2: dest, children: []};
    this.populateSegmentChildren(seg0, 6);
    this.pts = this.getPoints(seg0);
    this.pts.push(seg0.p2);
    this.seg = seg0;
  },

  populateSegmentChildren: function(seg, iterations) {
    iterations = iterations || 0;
    if (iterations < 0) { return seg; }

    var d = dist(seg.p1, seg.p2);
    midpt_offset = rth(d * rnds(0.07, 0.1), Math.asin(( seg.p2.x - seg.p1.x)/d));
    if (rnd() < 0.5) { midpt_offset.r *= -1; }
    midpt_offset.th += rnds(-pi/4, pi/4);
    midpt_offset = polar2cart(midpt_offset);

    var perturbed_midpoint = xy(seg.p1.x + (seg.p2.x - seg.p1.x) * rnds(0.3, 0.7), seg.p1.y + (seg.p2.y - seg.p1.y) * rnds(0.3, 0.7));
    var midpt = vec_add(
      perturbed_midpoint,
      midpt_offset
    );
    
    var child1 = {
      p1: seg.p1,
      p2: midpt,
      children: []
    };

    var child2 = {
      p1: midpt,
      p2: seg.p2,
      children: []
    };

    this.populateSegmentChildren(child1, iterations - 1);
    this.populateSegmentChildren(child2, iterations - 1);

    seg.children.push(child1);
    seg.children.push(child2);
  },

  getPoints: function(seg) {
    if (seg.children.length === 0) { return [seg.p1]; } // p2 is shared with the next segment
    var pts = this.getPoints(seg.children[0]);
    return pts.concat(this.getPoints(seg.children[1]));
  }

}
// ITEMS ============================================================
// ** Parent object
// ** container must be an actor

function Item(loc) {
  this.p = loc;
  this.platform = environment.ground;
  this.container = null;
  this.person_distance = null;

  this.reset = function() {
    if (!this.container && Player.drone.person) {
      // `crunch. This is basically the same as the person/drone stuff in people.js
      if (abs(Player.drone.person.p.x - this.p.x) < person_interaction_window) {
        close_items_per_tick.push(this);
        this.person_distance = dist(this.p, Player.drone.person.p);
      }
    }
  }

  this.tick = function() {
    if (this.container) {
      this.p = vec_add(this.container.p, xy(0.45, 0.2));
    }

    if (!this.container) {
      // keep it on the ground
      this.p =this.platform.pointAt(this.p.x);
    }
  }
}

// BATTERIES ============================================================

function Battery(loc) {
  this.item = new Item(loc);
  this.p = loc;

  // tick is performed by item object

  this.draw = function() {
    var ga = 0.7 + 0.3*sin(0.08 * gameplay_frame);
    ga *= ga;
    this.drawRepr(this.p, 1.5, draw.shapeStyle(awesome_glow_color, {globalAlpha: ga/4}));
    this.drawRepr(this.p, 1.3, draw.shapeStyle(awesome_glow_color, {globalAlpha: ga/2}));
    this.drawRepr(this.p, 1.2, draw.shapeStyle(awesome_glow_color, {globalAlpha: ga}));
    this.drawRepr(this.p, 1, draw.shapeStyle(battery_color));
  }

  this.use = function() {
    // Batteries get used by the drone
    // `todo (when energy stuff is implemented): fill drone battery level
    if (dist(this.p, Player.drone.p) > 3*interaction_distance) { return; }
    loopDestroy(this);
    if (this.container) this.container.drop();
    Player.drone.fillEnergy();
  },

  this.drawRepr = function(p, scale, fill) {
    var radius = scale * battery_size.x / 2;
    var height = scale * battery_size.y;

    draw.r(ctx,
      // `crunch
      {x: p.x - radius, y: p.y},
      {x: p.x + radius, y: p.y + height},
      fill
    );

    // bumps to suggest battery terminals
    [-0.2, 0.05].forEach(function(x) {
      x *= scale;
      draw.r(ctx,
        // `crunch
        {x: p.x + x, y: p.y + height},
        {x: p.x + x + 0.15 * scale, y: p.y + height + 0.1 * scale},
        fill
      );  
    })
  }
}
Battery.prototype = new Item();

// Unused fancy stuff.

var Hud = {
  draw: function() {

    for (var display_name in this.displays) {
      this.displays[display_name].call(this);
    }
    if (gameplay_frame % 20 === 0) { this.fillInfo(); }
  },

  fillInfo: function() {
    $("#game-info #fps").textContent = Math.round(avg_fps * 10)/10;
  },

  displays: {
    energy: function() {
      var p = vec_add(vec_add(origin, game_size), energy_meter_position);
      (new Battery()).drawRepr(p, 2, draw.shapeStyle(hud_color));

      p = vec_add(p, xy(1, 0.1));

      draw.r(ctx,
        p,
        vec_add(p, energy_meter_size),
        draw.shapeStyle(hud_color_dark)
      );
      
      draw.r(ctx,
        p,
        vec_add(p, xy(energy_meter_size.x * Player.drone.energy, energy_meter_size.y)),
        draw.shapeStyle(hud_color)
      );

      // `todo: include a percentage next to the bar

    },

    rpm: function() {
      this.drawDial(
        hud_dial_radius,
        vec_add(vec_add(origin, game_size), rpm_meter_position),
        Player.drone.rpm_scale,
        [0.82, 0.85]
      );

    }
  },

  // generic drawing methods

  drawDial: function(r, p0, dial_percent, green_range) {
    // Draw a dial. `crunch maybe
    var p1 = vec_add(p0, polar2cart(rth(r, 0)));
    var p2 = vec_add(p0, polar2cart(rth(r, pi)));
    var pe = vec_add(p0, polar2cart(rth(r*0.8, pi * (1- dial_percent))));
    p1.x += 0.2; // for style niceness
    p2.x -= 0.2;

    var basic_style = draw.lineStyle(hud_color);

    var green_range = green_range || [0, 0]
    var green_angle1 =  pi * (1 - green_range[0]);
    var green_angle2 =  pi * (1 - green_range[1]);

    draw.a(ctx, p0, r, 0, pi, draw.shapeStyle(hud_color_dark))
    draw.a(ctx, p0, r * 0.2, 0, pi, draw.shapeStyle(hud_color))
    draw.a(ctx, p0, r, 0, pi, draw.lineStyle(hud_color, {lineWidth: 0.2}));
    draw.a(ctx, p0, r, green_angle2, green_angle1, draw.lineStyle(hud_green, {lineWidth: 0.2}));
    p0.y += 0.05;
    pe.y += 0.05;
    draw.l(ctx, p0, pe, basic_style);
    // draw.l(ctx, p1, p2, basic_style);
  }
}


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

var debug_period = 50000; // `temp

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
  console.log('Destroyng:', obj);
    delete obj.tick;
    delete obj.draw;
}

function addToLoop(group, objs) {
  if (!objs.length) { objs = [objs]; }
  objs.forEach(function(obj) {
    global.object_groups[group].push(obj);
  })
}

function startGame() {
  // Flatten loop objects
  global.loop_objects = object_groups.background
    .concat(object_groups.foreground1)
    .concat(object_groups.foreground2)
    .concat(object_groups.overlay);


  gameplay_on = true;
  reqAnimFrame(go);
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
global.onload = function() {
  environment.generate();

  // Global game ideas - things NPC people talk about to each other
  global.ideas = {
    smalltalk: new Idea('smalltalk'), // this is basically the null/default idea

    drone: new Idea('drone', {
      draw: Player.drone.drawRepr
    })
  }


  // `temp sample people/items
  global.p1 = (new Person()).init({p: xy(19, 3), v: xy(0.05, 0)});
  global.p2 = (new Person()).init({p: xy(18, 3)});
  global.p3 = (new Person()).init({p: xy(27, 3), v: xy(-0.05, 0)});
  

  // Game target: if you overpower this one, you win
  global.target = (new Person()).init({p: xy(37, 3), v: xy(-0.05, 0), role: roles.game_target});

  global.battery1 = new Battery(xy(23, 3));
  global.battery2 = new Battery(xy(28, 3));

  global.building = new Building(50, xy(10, 20));

  global.p = (new Person()).init({p: xy(Player.drone.p.x  + 3, environment.ground.y0)});
  Player.drone.controlFull(p);


  addToLoop('background', [Player, global.building]);

  addToLoop('foreground1', [
      battery1,
      battery2,
      Player.drone,
      Player.drone.person,
      p1,
      p2,
      p3,
      target
  ]);

  addToLoop('foreground2', [
    environment,
    lightning
  ]);

  addToLoop('overlay', [Camera, Hud]);

  building.prepopulate({normal: 5});
  
  startGame();
};
// Purpose of this thing is to debug the drone movement
// it will not go in final game

var pp_size = xy(250, 250); // in PIXELS (unlike main canvas's game_size)
var pp_color = 'white';
var pp_bg_color = 'black';


Phaseplot = function(selector, scale, tick, origin_fraction) {
  this.canvas = $(selector);
  this.ctx = this.canvas.getContext('2d');
  this.scale = scale;
  if (!origin_fraction) { origin_fraction = xy(0.5, 0.5); }

  this.u2px = function(pos) {
    return xy(pos.x * this.scale.x, pos.y * this.scale.y);
  }

  var single_pixel_size = xy(1/this.scale.x, 1/this.scale.y);

  var size_units = xy(pp_size.x / this.scale.x, pp_size.y / this.scale.y);

  this.canvas.setAttribute("width", pp_size.x + "px");
  this.canvas.setAttribute("height", pp_size.y + "px");

  // (0, 0) is centered
  this.ctx.setTransform(scale.x, 0, 0, -scale.y,
    scale.x * size_units.x * origin_fraction.x,
    scale.y * size_units.y * (1-origin_fraction.y)
  );

  this.plotPoint = function(pos) {
    draw.r(this.ctx, pos, vec_add(pos, single_pixel_size), draw.shapeStyle(pp_color));
  }

  this.clear = function() {
    draw.clr(this.ctx);
  }

  // Record drone position/velocity
  this.tick = tick;

  this.draw = function() {
    draw.r(this.ctx, xy(-size_units.x, -size_units.y), size_units,  draw.shapeStyle('black', {globalAlpha: 0.005})); // Slowly fade out old tracks
  }

  addToLoop('overlay', this);

  this.plotPoint(xy(0,0));
}

var pp_drone_xy = new Phaseplot('#phaseplot-drone-xy',
  xy(2, 20),
  function() {
    this.plotPoint(xy(Player.drone.p_drawn.x, Player.drone.p_drawn.y));
  },
  xy(0, 0)
);
var pp_drone_vx = new Phaseplot('#phaseplot-drone-vx',
  xy(2, 40),
  function() {
    this.plotPoint(xy(Player.drone.p.x, Player.drone.v.x));
  }
);
var pp_drone_vy = new Phaseplot('#phaseplot-drone-vy',
  xy(30, 2),
  function() {
    this.plotPoint(xy(Player.drone.v.y, Player.drone.p.y));
  },
  xy(0.5, 0)
);
var pp_drone_ay = new Phaseplot('#phaseplot-drone-ay',
  xy(20, 300000),
  function() {
    this.plotPoint(xy(Player.drone.v.y, Player.drone.getLiftAccel().y + gravAccel().y));
  }
);

})();