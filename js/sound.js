var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playFrom(params, t0, tf) {
    var oscillator = audioCtx.createOscillator();
    oscillator.connect(audioCtx.destination);
    oscillator.type = params.type || 'triangle';
    oscillator.detune.value = params.det || 0;
    oscillator.frequency.value = params.f;
    oscillator.start(t0);
    oscillator.stop(tf);
}

var chords = [
    {d: 2, f: [323.778, 440, 390.639,], roll: 0.2},
    {d: 2, f: [162, 220, 195], roll: 0.2},
    // {d: 2, f: [323.778, 440, 390.639,], roll: 0.2, pre: 0.1},
    // {d: 2, f: [323.778, 440, 390.639,], roll: 0.2, pre: 0.1},
    // {d: 2, f: [323.778, 440, 390.639,], roll: 0.2, pre: 0.1},
    // {d: 2, f: [323.778, 440, 390.639,], roll: 0.2, pre: 0.1},
];
var chords = [
    {d: 2, f: [162, 220, 195,], roll: 0.5},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
    {d: 2, f: [162, 220, 195,], roll: 0.5, pre: 0.1},
];


var bpm = 60;
var t = 0;
chords.forEach(function(c) {
    var dt = 4*60/(c.d*bpm);
    var i = 0;
    c.f.forEach(function(freq) { playFrom({f: freq}, t + i*c.roll - (c.pre || 0), t + dt); i += 1; });
    t += dt;
});

playFrom({f: 440}, 0, 2);