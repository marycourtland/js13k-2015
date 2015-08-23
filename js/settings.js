// All units in game units except for game_scale

// Game and camera settings
var game_scale = xy(20, 20) // pixels -> game units conversion
,   game_size = xy(wnd.innerWidth/game_scale.x, 30)
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

// Environment
,   environment_color = '#222'
,   building_color = '#444'
,   num_building_clumps = 10
,   num_buildings_per_clump = 6
,   building_clump_width = 40

// Dynamics
// *** Gravity estimate is very sensitive to FPS measurement
,   min_dynamics_frame = 5
,   gravAccel = function() { return xy(0, gameplay_frame < min_dynamics_frame ? 0 : -9.8 / 2 / min(max(avg_fps * avg_fps, 0), 1000))} // 9.8 m/s^2 translated to units/frame^2

// Lightning
,   lightning_chance = 0.001        // Chance that lightning will start on any given frame
,   lightning_chance_drone = 0.05   // Of each lightning strike, chance that it will hit the drone

// People
,   person_size = xy(0.3, 0.6)
,   person_color = '#000'
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


// HUD - positions are referenced from origin
,   hud_color = '#abb'
,   hud_color_dark = '#355'
,   hud_red = '#811'
,   hud_green = '#161'
,   hud_dial_radius = 1
,   energy_meter_position = xy(2, 28.5)
,   energy_meter_size = xy(4, 0.5)
,   rpm_meter_position = xy(10, 28.5)

;