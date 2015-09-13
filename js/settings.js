// All units in game units except for game_scale

// Game and camera settings
var game_scale = xy(30,30) // pixels -> game units conversion
, game_size = xy((global.innerWidth - 20)/game_scale.x, (global.innerHeight / game_scale.y))
, camera_margin = xy(4, 4)
, units_per_meter = 2 // for realistic size conversions

, world_size = [-20, 1000] // Horizontal bounds
, world_buffer = 10

, drone_upper_bound = game_size.y * 1.3


// Environment
, num_tower_clumps = 60
, num_towers_per_clump = 10
, tower_clump_width = 80
, tower_dome_probability = 0.1
, tower_slant_probability = 0.1
, tower_range = [world_size[0] + 20, world_size[1] - 20]

// Buildings
, door_size = xy(0.7, 1.2) // slightly larger than person
, person_frequency = 0.15 // people per game unit. not evenly distributed
, avg_people_per_building = 4 // AVERAGE
, avg_building_size = xy(10, 10)
, people_comeout_window = 8


// Dynamics
// *** Gravity estimate is very sensitive to FPS measurement
, min_dynamics_frame = 5
, gravAccel = function() { return xy(0, gameplay_frame < min_dynamics_frame ? 0 : -9.8 / 2 / bounds(avg_fps * avg_fps, [0, 1000])); } // 9.8 m/s^2 translated to units/frame^2
, droneTiltAccel = 0.001
, dronePowerAccel = 0.0001
, max_tilt = pi/4
, tilt_decay = 0.1
, sideways_velocity_bump = 0.07

, tiltOffset = function(depth) {
    // `todo: customize this function with depth; then have successive keydown events (i.e. key being held down) increase the depth
    return function(t) {
      t += 1; // so that the zero thingy isn't triggered
      t *= 0.2; // for scaling
      return -max(0, 1.5*Math.exp(-t/2)*t/1.5);
    }
  }

// Lightning
, lightning_chance = 0.001        // Chance that lightning will start on any given frame
, lightning_chance_drone = 0.3   // Of each lightning strike, chance that it will hit the drone
, lightning_integrity_decrease = 0.3 // OUCH!

// Wind
, wind_probability = 1/400
, wind_storm_probability = 1/30 // `nb unused currently
, wind_influence_distance = 1

// People
, person_size = xy(0.3, 0.6)
, person_speed = 0.3
, person_control_rate = 0.05 // rate at which control level increases or drops
, min_person_resistance = 2 * person_control_rate
, person_interaction_window = 15
, interaction_distance = 1
, shoot_drone_window = 15


// Drone
, drone_body_size = xy(0.3, 0.2)
, drone_arm_size = xy(0.4, 0.05) // from center
, drone_blade_size = xy(0.5, 0.05)
, drone_drain_rate = 0.00005 // energy per frame
, drone_low_energy = 0.1
, drone_high_energy = 0.9
, drone_max_sideways_accel = 0.01

// Bullets
, bullet_radius = 0.075
, bullet_hit_distance = 0.5
, bullet_speed = 1.8
, bullet_frequency = 50 // frames between a guard's bullets
, bullet_integrity_decrease = 0.05 // how much structural integrity does a bullet disrupt?

// Items
, battery_size = {x: 0.5, y: 0.3}


// Ideas
, idea_scale = 0.7

// HUD - positions are referenced from the upper right corner of game
, hud_dial_radius = 0.4
, bar_meter_size = xy(2, 0.25)
, energy_meter_position = xy(-6, -0.75)
, integrity_meter_position = xy(-10, -0.75)
, rpm_meter_position = xy(-1.5, -0.75)

// mouse
, mouse_hover_distance = 1


// Colors
, fadeout_color = '#eee'
, environment_color = '#1b1b1b'
, backgroundGradient = [
    [1.0, '#777788'],
    [0.4, '#999999'],
    [0, '#cccccc']
  ]
, awesome_glow_color = '#fff'

, tower_color1 = '#666366'
, tower_color2 = '#555255'
, building_color = '#3E373E'
, door_color = '#636666'

, person_color = '#000'
, controlled_person_color = '#000'

, drone_color = '#000'
, drone_signal_color = '#9eb'

, bullet_color = '#eee'
, battery_color = "#000"
, idea_color = "#ddd"

, hud_color = '#445'
, hud_color_dark = '#aab'
, hud_red = '#811'
, hud_green = '#161'
, hud_text = '#112'

, wind_colors = [
    // color, linewidth, alpha
    ['#ddd', 0.3, 0.05],
    // ['#ddd', 0.2, 0.05],
    ['#fff', 0.1, 0.05]
  ]

;

// `crunch remove this from the css I suppose
$("#game-message").style.color = hud_text;
$("body").style.color = fadeout_color;
$("#game-intro").style.color = fadeout_color;