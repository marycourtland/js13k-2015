// All units in game units except for game_scale

// Game and camera settings
var game_scale = {x: 20, y: 20} // pixels > game units conversion
,   game_size = {x: wnd.innerWidth/game_scale.x, y: 30}
,   camera_margin = {x: 4, y: 4}


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
,   environment_color = '#222' // Todo: maybe buildings should be a different color

// People
,   person_size = {x: 0.3, y: 0.6}
,   person_color = '#000'
,   controlled_person_color = '#300'
,   person_interaction_window = 8


// Drone
,   drone_size = {x: 0.6, y: 0.4}
,   drone_color = '#EEE'
,   drone_drain_rate = 0.00005 // energy per frame
,   drone_low_energy = 0.1
,   drone_high_energy = 0.9

// Items
,   battery_size = {x: 0.5, y: 0.3}
,   interaction_distance = 1.2


// HUD - positions are referenced from origin
,   hud_color = '#abb'
,   hud_red = '#811'
,   hud_green = '#161'
,   energy_meter_position = {x: 3, y: 28.5}
,   energy_meter_radius = 1


;