var easymidi = require('easymidi');
var input = new easymidi.Input("MPK mini 20:0");

var fluid = require("infusion"),
    flock = require(__dirname + "/node_modules/flocking/nodejs/index.js"), //jshint ignore:line
    enviro = flock.init();

var control_settings = {
  '1':{
    name:'mod1',
    qual:'freq',
    multiplier:1/10
  },
  '2':{
    name:'mod2',
    qual:'freq',
    multiplier:1/10
  },
  '3':{
    name:'mod3',
    qual:'mul',
    multiplier:1/10
  },
  '4':{
    name:'mod1',
    multiplier:0.001
  },
  '5':{
    name:'mod2',
    multiplier:0.001
  },
  '6':{
    name:'mod3',
    multiplier:0.001
  },
  '7':{
    name:'mod1',
    multiplier:0.001
  },
  '8':{
    name:'mod2',
    multiplier:0.001
  }
}

input.on('noteon', function (msg) {
  sendNote(msg);
});

input.on('cc', function(msg){
  sendCtrl(msg);
});

function sendCtrl(msg){
  var setting = control_settings[msg.controller].name.toString() + '.' + control_settings[msg.controller].qual.toString();
  //console.log(setting);
  synth.set(setting, (control_settings[msg.controller]['multiplier'] * msg.value));
  console.log(control_settings[msg.controller]['multiplier'] * msg.value);
}

function sendNote(msg){
  synth.set('carrier.freq', flock.midiFreq(msg.note));
}

var synth = flock.synth({
    synthDef: {
            id:'mod3',
            ugen: "flock.ugen.filter.moog",
        cutoff: {
            id:'mod1',
            ugen: "flock.ugen.sinOsc",
            freq: 1/4,
            mul: 5000,
            add: 7000
        },
        resonance: {
            id:'mod2',
            ugen: "flock.ugen.sinOsc",
            freq: 1/2,
            mul: 1.5,
            add: 1.5
        },
        source: {
            ugen: "flock.ugen.lfSaw",
            id:"carrier"
        },
        mul: 0.5
    }
});

enviro.start();
//synth.play();
