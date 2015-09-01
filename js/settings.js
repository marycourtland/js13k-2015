// All units in game units except for game_scale

// Game and camera settings
var game_scale = xy(18, 18) // pixels -> game units conversion
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
,   lightning_integrity_decrease = 0.3 // OUCH!

// People
,   person_size = xy(0.3, 0.6)
,   person_color = '#000'
,   person_speed = 0.3
,   controlled_person_color = '#000'
,   person_control_rate = 0.05 // rate at which control level increases or drops
,   min_person_resistance = 2 * person_control_rate
,   person_interaction_window = 15
,   interaction_distance = 1
,   shoot_drone_window = 15


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

// Bullets
,   bullet_radius = 0.075
,   bullet_hit_distance = 0.5
,   bullet_speed = 1.8
,   bullet_color = '#eee'
,   bullet_frequency = 50 // frames between a guard's bullets
,   bullet_integrity_decrease = 0.05 // how much structural integrity does a bullet disrupt?

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
,   bar_meter_size = xy(4, 0.5)
,   energy_meter_position = xy(-12, -1.5)
,   integrity_meter_position = xy(-20, -1.5)
,   rpm_meter_position = xy(-3, -1.5)

;