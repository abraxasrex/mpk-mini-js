var easymidi = require('easymidi');
var input = new easymidi.Input("MPK mini 20:0");

var fluid = require("infusion"),
    flock = require(__dirname + "/node_modules/flocking/nodejs/index.js"), //jshint ignore:line
    enviro = flock.init();

var synths = [];
var synthCount = 1;

/// objects to match up to midi control settings
var control_settings = {
  '1':{
    name:'mod1',
    qual:'freq',
    multiplier:1/50,
    val:1
  },
  '2':{
    name:'mod2',
    qual:'freq',
    multiplier:1/50,
    val:1
  },
  '3':{
    name:'mod3',
    qual:'freq',
    multiplier:1/50,
    val:1
  },
  '4':{
    name:'gran',
    qual:'grainDur',
    multiplier:1/50,
    val:1
  },
  '5':{
    name:'ampMod',
    qual:'freq',
    multiplier:1/25,
    val:1
  },
  '6':{
    name:'bass',
    qual:'speed',
    multiplier:1/50,
    val:1
  },
  '7':{
    name:'kick',
    multiplier:1/50,
    qual:'freq',
    val:1
  },
  '8':{
    name:'snare',
    multiplier:1/50,
    qual:'freq',
    val:1
  }
};

function handleNoteOn(msg){
  defineSynth(msg.note);
  enviro.nodes[enviro.nodes.length-1].set('carrier.freq', flock.midiFreq(msg.note));
  ctrlCheck();
}

function handleNoteOff(msg){
  synthCount -=1;
  enviro.nodes.forEach(function(syn){
    if(syn.namedNodes["carrier"] && Math.floor(syn.namedNodes["carrier"].inputs.freq.output["0"]) == Math.floor(flock.midiFreq(msg.note))){
      synths.splice(synths.indexOf(syn), 1);
      syn.destroy();
    }
  });
}

function handleCtrl(msg){
   synths.forEach(function(syn){
   if(!!syn.namedNodes[control_settings[msg.controller].name]){
      control_settings[msg.controller].val = msg.value;
    }
   });
   ctrlCheck();
}

function ctrlCheck(){
 for(var num in control_settings){
   synths.forEach(function(syn){
    if(!!syn.namedNodes[control_settings[num].name]){
      var setting = control_settings[num].name.toString() + '.' + control_settings[num].qual.toString();
       syn.set(setting, (control_settings[num]['multiplier'] * control_settings[num].val));
     }
   });
 }
}



function defineSynth(note){
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

//     synthDef: {
//     id:'gran',
//     ugen: "flock.ugen.granulator",
//     numGrains: 20,
//     grainDur: 0.5,
//     delayDur: 1/4,
//     mul: 0.5,
//         source: {
//           id:'carrier',
//             ugen: "flock.ugen.lfSaw",
//             mul: 0.5
//         }
// }

// synthDef: {
//      id: "carrier",
//      ugen: "flock.ugen.sinOsc",
//      mul: {
//          id: "ampMod",
//          ugen: "flock.ugen.sinOsc",
//          freq: 1.0,
//          mul: 0.25
//      }
//  }

});
  synths.push(moogSynth);
}


input.on('noteon', handleNoteOn);

input.on('noteoff', handleNoteOff);

input.on('cc', handleCtrl);




var kick = flock.synth({

        synthDef: {
            ugen: "flock.ugen.playBuffer",
            buffer: {
              url: './drumkit/kick.WAV'
            },
            trigger:{
              id:'kick',
              ugen: 'flock.ugen.impulse',
              freq: 2
            },
            start:0,
            loop:1,
            mul:0.5
        }
    });
synths.push(kick);

var snare = flock.synth({
    synthDef: {
      ugen: "flock.ugen.playBuffer",
      buffer: {
        url:'./drumkit/snare.WAV',
      },
      trigger:{
          id:'snare',
          ugen: 'flock.ugen.impulse',
          freq: 2
      },
      start:0,
      loop:1,
      mul:0.5
    }
});
synths.push(snare);



enviro.start();
