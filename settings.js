// Game settings
var game_scale = {x: 20, y: 20}, // pixels > game units conversion
    game_size = {x: wnd.outerWidth/game_scale.x, y: 30}, // game units
    fps = 30
;

// Aesthetic stuff
var backgroundGradient = [
        // gradient color stops,
        // [0.9, '#101035'],
        // [0.4, '#e0c7be'],
        // [0.1, '#f4e5a4']

        [1.0, '#111320'],
        [0.85, '#17182a'],
        [0.7, '#1f2035'],
        [0.4, '#433b4b'],
        // [0.2, '#765955'],
        [0.0, '#a16e4f']
      // [0, 'red'], [1, 'blue']
    ]
; 

// People (units in scaled game units)
var person_size = {x: 0.3, y: 0.6},
    person_color = '#511'
;


// stuff...
var tickity = function(item) { item.tick(); }
var drawity = function(item) { item.draw(); }