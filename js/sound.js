// http://jsfiddle.net/o63nb8n5/1/
// http://jsfiddle.net/6no5bpah/

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playFrom(params, t0, tf) {
    if (typeof params.f === 'string') { params.f = freqs[params.f]; }
    var oscillator = audioCtx.createOscillator();
    oscillator.connect(audioCtx.destination);
    oscillator.type = params.type || 'sin';
    oscillator.detune.value = params.det || 0;
    oscillator.frequency.value = params.f;
    oscillator.start(t0);
    oscillator.stop(tf);
}

var freqs = {
    e2: 82.4069,
    g2: 97.9989,
    a2: 110,
    gsh3: 207.652,
    a3: 220,
    c4: 261.626,
    csh4: 277.183
}

var chords = [
    {d: 8, f: [440, 880]},
    {d: 8, f: [329]},
    {d: 8, f: [440]},
    {d: 8, f: [329]},
    {d: 8, f: [880, 440]}
];

var chords = [
    {d: 1, f: [323.778, 440, 390.639,], roll: 0.2},
    {d: 1, f: [323.778, 440, 390.639,], roll: 0.2},
    {d: 1, f: [440, 323.778, 390.639,], roll: 0.2},
];
var chords = [
    {d: 2, f: [324, 440, 390,], roll: 0.5},
    {d: 2, f: [324, 440, 390,], roll: 0.5, pre: 0.1},
    {d: 2, f: [324, 440, 390,], roll: 0.5, pre: 0.1},
    {d: 2, f: [324, 440, 390,], roll: 0.5, pre: 0.1},
    {d: 2, f: [324, 440, 390,], roll: 0.5, pre: 0.1},
];

var chords = [
    {d: 2, f: [162, 220, 195,], roll: 0.5},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
];

var chords = [
    {d: 2, f: [162, 220, 195,], roll: 0.5},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
];

var chords = [
    {d: 2, f: ['e2', 'a2', 'g2',]},
    {d: 2, f: ['e2', 'a2', 'g2',]},
    {d: 2, f: ['e2', 'a2', 'g2',]},
    {d: 2, f: ['e2', 'a2', 'g2',]},
    {d: 2, f: ['e2', 'a2', 'g2',]},
];



var bpm = 60;
var t = 0;
chords.forEach(function(c) {
    var dt = 4*60/(c.d*bpm);
    var i = 0;
    c.f.forEach(function(freq) { playFrom({f: freq}, t + i*c.roll, dt); i += 1; });
    t += dt;
});

var chords2 = [
    {d: 2, f: [162, 220, 195,], roll: 0.5},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
];


