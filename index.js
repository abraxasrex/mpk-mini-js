var easymidi = require('easymidi');
var input = new easymidi.Input("MPK mini 20:0");

var fluid = require("infusion"),
    flock = require(__dirname + "/node_modules/flocking/nodejs/index.js"), //jshint ignore:line
    enviro = flock.init();

var synthCount = 1;
//var synth;
var synths = [];

var control_settings = {
  '1':{
    name:'mod1',
    qual:'freq',
    multiplier:1
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
    name:'drum1',
    qual:'speed',
    multiplier:1/10
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

function synthNote(note){

var moogSynth = flock.synth({
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
  synths.push(moogSynth);
}

function sendCtrl(msg){
  var setting = control_settings[msg.controller].name.toString() + '.' + control_settings[msg.controller].qual.toString();
  synths.forEach(function(syn){
    if(!!syn.namedNodes[control_settings[msg.controller].name]){
      syn.set(setting, (control_settings[msg.controller]['multiplier'] * msg.value));
      console.log(setting, 'syn setting');
    }
  });
}

function sendNote(msg){
  enviro.nodes[enviro.nodes.length-1].set('carrier.freq', flock.midiFreq(msg.note));
}


input.on('noteon', function (msg) {
  synthCount +=1;
  synthNote(msg.note);

  synths.forEach(function(syn){
  //  syn.mul = 100 / synthCount;
  });
  sendNote(msg);
});


input.on('noteoff', function (msg) {
  synths.forEach(function(syn){
  //  syn.mul = 100 / synthCount;
  });
  synthCount -=1;

  enviro.nodes.forEach(function(syn){
    if(syn.namedNodes["carrier"] && Math.floor(syn.namedNodes["carrier"].inputs.freq.output["0"]) == Math.floor(flock.midiFreq(msg.note))){
      console.log('note match');
      synths.splice(synths.indexOf(syn), 1);
      syn.destroy();
    }
  });
});

input.on('cc', function(msg){
  sendCtrl(msg);
});

var drum = flock.synth({
    synthDef: {
        id:'drum1',
        ugen: "flock.ugen.playBuffer",
        buffer: {
            id: "drum",
            url: "./drumkit/clap.wav"
        },
        loop: 1,
        start: 0,
        speed:0.5
    }
});
synths.push(drum);
// drum.play();

enviro.start();
