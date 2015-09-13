var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var master_volume = audioCtx.createGain();
master_volume.connect(audioCtx.destination);
master_volume.gain.value = 1;

function playInfiniteChord(chord) {
    return chord.map(function(note) {
        var oscillator = audioCtx.createOscillator();
        oscillator.connect(master_volume);
        oscillator.type = 'triangle';
        oscillator.frequency.value = note;
        oscillator.start();
        return oscillator;
    });
}

var Sound = {
    muted: false,
    volume: 1,
    buzzes: [],
    startBuzz: function () {
        this.buzzes = playInfiniteChord([162, 220, 195], 0);
    },
    toggleMute: function() {
        this.muted = !this.muted;
        master_volume.gain.value = this.muted ? 0 : this.volume;
    },
}


Sound.startBuzz();