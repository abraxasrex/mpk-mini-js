var easymidi = require('easymidi');
var input = new easymidi.Input("MPK mini 20:0");

var fluid = require("infusion"),
    flock = require(__dirname + "/node_modules/flocking/nodejs/index.js"), //jshint ignore:line
    enviro = flock.init();
input.on('noteon', function (msg) {
  console.log(msg);
  sendNote(msg);
});

input.on('cc', function(msg){
  sendCtrl(msg);
});

function sendCtrl(msg){
  synth.set('mod.freq', msg.value / 10)
  console.log(msg);
}
function sendNote(msg){
  synth.set('carrier.freq', msg.note * 10);
}

var synth = flock.synth({
    synthDef: {
      ugen: "flock.ugen.filter.moog",
        cutoff: {
          id: 'mod',
            ugen: "flock.ugen.sinOsc",
            freq: 1/4,
            mul: 5000,
            add: 7000
        },
        resonance: {
          id:'mod',
            ugen: "flock.ugen.sinOsc",
            freq: 1/2,
            mul: 1.5,
            add: 1.5
        },
        source: {
            id: 'carrier',
            ugen: "flock.ugen.squareOsc"
        },
        mul: 0.5
    }
});

enviro.start();
//synth.play();
