var easymidi = require('easymidi');
var input = new easymidi.Input("MPK mini 20:0");

var fluid = require("infusion"),
    flock = require(__dirname + "/node_modules/flocking/nodejs/index.js"), //jshint ignore:line
    enviro = flock.init();

var synthCount = 1;

var sampler = [];
var synths = [];

var control_settings = {
  '1':{
    name:'israel',
    qual:'speed',
    multiplier:1/100
  },
  '2':{
    name:'israel',
    qual:'start',
    multiplier:1/150
  },
  '3':{
    name:'israel',
    qual:'end',
    multiplier:1/150
  },
  '4':{
    name:'israel',
    qual:'sampleRate',
    multiplier:40
  },
  '5':{
    name:'gran',
    qual:'delayDur',
    multiplier:1/200
  },
  '6':{
    name:'gransaw',
    qual:'grainDur',
    multiplier:1/200
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

    synthDef: {
      id:'gran'
    ugen: "flock.ugen.granulator",
    numGrains: 40,
    grainDur: 0.05,
    delayDur: 4,
    mul: 0.5,
        source: {
            id:'carrier',
            ugen: "flock.ugen.lfSaw",
            freq: 440,
            mul: 0.25
        }
    }

});
  synths.push(moogSynth);
}



function sendCtrl(msg){
  var setting = control_settings[msg.controller].name.toString() + '.' + control_settings[msg.controller].qual.toString();
  synths.forEach(function(syn){
   if(!!syn.namedNodes[control_settings[msg.controller].name]){
      syn.set(setting, (control_settings[msg.controller]['multiplier'] * msg.value));
    }
  });
}

function sendNote(msg){
  enviro.nodes[enviro.nodes.length-1].set('carrier.freq', flock.midiFreq(msg.note));
}

function sampNote(note){
 var samp = flock.synth({
   synthDef: {
         id: 'samplerNote' + note,
         ugen: "flock.ugen.playBuffer",
         buffer: {
             src: './drumkit/kick.WAV',
             sampleRate: note * 500
         },
         loop: 1,
         start: 0,
         speed:1,
         mul:0
     }
 });
 synths.push(samp);
 console.log(synths[synths.length-1].namedNodes);
}

function sendSamp(msg){
   console.log(enviro.namedNodes.length, 'after');
   console.log(enviro.nodes.length, 'after');
enviro.nodes[enviro.nodes.length-1].mul = 1;
}

input.on('noteon', function (msg) {
  synthCount +=1;
  // synthNote(msg.note);
  // sendNote(msg);
  //  sampNote(msg.note);
    sendSamp(msg);
    console.log('note played', msg.note);
});

var samplerOn = 1;
input.on('noteoff', function (msg) {
  synthCount -=1;

  enviro.nodes.forEach(function(syn){
    if(syn.namedNodes["carrier"] && Math.floor(syn.namedNodes["carrier"].inputs.freq.output["0"]) == Math.floor(flock.midiFreq(msg.note))){
      console.log('note match');
      synths.splice(synths.indexOf(syn), 1);
      syn.destroy();
    }
    if(samplerOn && syn.id == 'samplerNote' + msg.note){
        synths.splice(synths.indexOf(syn), 1);
    }
  });
});

input.on('cc', function(msg){
  sendCtrl(msg);
});

// var band = flock.band({
//     components: {
//         sinSynth: {
//             type: "flock.synth",
//             options: {
//                 synthDef: {
//                     id: "carrier",
//                     ugen: "flock.ugen.sinOsc",
//                     freq: 220,
//                     mul: {
//                         ugen: "flock.ugen.line",
//                         start: 0,
//                         end: 0.25,
//                         duration: 1.0
//                     }
//                 }
//             }
//         },
//
//         scheduler: {
//             type: "flock.scheduler.async",
//             options: {
//                 components: {
//                     synthContext: "{sinSynth}"
//                 },
//
//                 score: [
//                     {
//                         interval: "repeat",
//                         time: 1.0,
//                         change: {
//                             values: {
//                                 "carrier.freq": {
//                                     synthDef: {
//                                         ugen: "flock.ugen.sequence",
//                                         values: [330, 440, 550, 660, 880, 990, 1100, 1210]
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 ]
//             }
//         }
//     }
// });

var piano = flock.synth({
    synthDef: {
        id:'israel',
        ugen: "flock.ugen.playBuffer",
        buffer: {
            id: "israel_buf",
            url: "./Israel.wav"
        },
        loop: 1,
        start: 0,
        speed:1
    }
});
synths.push(piano);

// function setSampler(noteNum){
// var buffer;
//
// flock.audio.decode({
//     src: "./drumkit/bass.wav", // src can also be a File object or Data URL.
//     // no idea if this sample rate is right
//     sampleRate: noteNum * 500,
//     success: function (bufferDescription) {
//         console.log('one loaded:', noteNum);
//         //console.log(enviro.bufferSources);
//         buffer = bufferDescription;
//         buffer.id = "samplerNote" + notenum;
//         sampNote(noteNum);
//     },
//     error: function (err) {
//         console.log('error');    }
// });
// }
//
// for(var i = 0; i < 127; i ++){
//   sampNote(i);
// }

enviro.start();
//console.log(enviro);
//console.log(enviro.nodes[50], 'before');
