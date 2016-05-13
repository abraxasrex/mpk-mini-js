var easymidi = require('easymidi');
var input = new easymidi.Input("MPK mini 20:0");

var fluid = require("infusion"),
    flock = require(__dirname + "/node_modules/flocking/nodejs/index.js"), //jshint ignore:line
    enviro = flock.init();

var synthCount = 1;

var synths = [];
var rand_drums = [ 'bass (1).wav',
  'bass (10).wav',
  'bass (11).wav',
  'bass (12).wav',
  'bass (13).wav',
  'bass (14).wav',
  'bass (15).wav',
  'bass (16).wav',
  'bass (17).wav',
  'bass (18).wav',
  'bass (19).WAV',
  'bass (2).WAV',
  'bass (20).WAV',
  'bass (21).wav',
  'bass (22).wav',
  'bass (23).wav',
  'bass (3).WAV',
  'bass (4).WAV',
  'bass (5).WAV',
  'bass (6).WAV',
  'bass (7).wav',
  'bass (8).wav',
  'bass (9).wav',
  'bass.wav',
  'clap (1).wav',
  'clap (10).wav',
  'clap (11).wav',
  'clap (12).wav',
  'clap (13).WAV',
  'clap (14).WAV',
  'clap (15).wav',
  'clap (2).wav',
  'clap (3).WAV',
  'clap (4).WAV',
  'clap (5).WAV',
  'clap (6).WAV',
  'clap (7).WAV',
  'clap (8).wav',
  'clap (9).wav',
  'clap.wav',
  'cymbal (1).wav',
  'cymbal (2).wav',
  'cymbal (3).wav',
  'cymbal (4).WAV',
  'cymbal.wav',
  'hi hat (1).WAV',
  'hi hat (10).wav',
  'hi hat (11).wav',
  'hi hat (12).wav',
  'hi hat (13).WAV',
  'hi hat (14).wav',
  'hi hat (15).wav',
  'hi hat (16).wav',
  'hi hat (17).wav',
  'hi hat (18).wav',
  'hi hat (19).wav',
  'hi hat (2).WAV',
  'hi hat (20).wav',
  'hi hat (21).WAV',
  'hi hat (22).wav',
  'hi hat (23).wav',
  'hi hat (24).wav',
  'hi hat (25).wav',
  'hi hat (26).wav',
  'hi hat (27).wav',
  'hi hat (28).WAV',
  'hi hat (29).WAV',
  'hi hat (3).wav',
  'hi hat (30).wav',
  'hi hat (31).wav',
  'hi hat (32).wav',
  'hi hat (33).wav',
  'hi hat (34).wav',
  'hi hat (35).wav',
  'hi hat (36).wav',
  'hi hat (37).WAV',
  'hi hat (38).wav',
  'hi hat (39).wav',
  'hi hat (4).wav',
  'hi hat (5).WAV',
  'hi hat (6).wav',
  'hi hat (7).WAV',
  'hi hat (8).WAV',
  'hi hat (9).wav',
  'hi hat.wav',
  'kick (1).WAV',
  'kick (10).wav',
  'kick (11).wav',
  'kick (12).wav',
  'kick (13).wav',
  'kick (14).wav',
  'kick (15).wav',
  'kick (16).wav',
  'kick (17).wav',
  'kick (18).WAV',
  'kick (19).WAV',
  'kick (2).wav',
  'kick (20).WAV',
  'kick (21).WAV',
  'kick (22).WAV',
  'kick (3).wav',
  'kick (4).wav',
  'kick (5).wav',
  'kick (6).wav',
  'kick (7).wav',
  'kick (8).wav',
  'kick (9).wav',
  'kick.WAV',
  'snare (1).WAV',
  'snare (10).wav',
  'snare (11).wav',
  'snare (12).wav',
  'snare (13).wav',
  'snare (14).wav',
  'snare (15).wav',
  'snare (16).wav',
  'snare (17).wav',
  'snare (18).wav',
  'snare (19).wav',
  'snare (2).WAV',
  'snare (20).wav',
  'snare (21).wav',
  'snare (22).wav',
  'snare (23).wav',
  'snare (24).WAV',
  'snare (25).WAV',
  'snare (26).WAV',
  'snare (27).WAV',
  'snare (28).WAV',
  'snare (29).WAV',
  'snare (3).WAV',
  'snare (30).WAV',
  'snare (31).WAV',
  'snare (32).WAV',
  'snare (33).WAV',
  'snare (34).WAV',
  'snare (35).wav',
  'snare (36).wav',
  'snare (37).wav',
  'snare (38).wav',
  'snare (39).wav',
  'snare (4).WAV',
  'snare (40).wav',
  'snare (41).wav',
  'snare (42).wav',
  'snare (43).wav',
  'snare (44).wav',
  'snare (45).wav',
  'snare (46).WAV',
  'snare (47).wav',
  'snare (48).wav',
  'snare (5).WAV',
  'snare (6).WAV',
  'snare (7).WAV',
  'snare (8).wav',
  'snare (9).wav',
  'snare.WAV',
  'tom (1).WAV',
  'tom (10).WAV',
  'tom (11).wav',
  'tom (12).wav',
  'tom (13).wav',
  'tom (2).WAV',
  'tom (3).wav',
  'tom (4).wav',
  'tom (5).wav',
  'tom (6).wav',
  'tom (7).wav',
  'tom (8).WAV',
  'tom (9).WAV',
  'tom.WAV' ];


// var fs = require('fs');
// fs.readdir('./drumkit', function(err,data){
//   rand_drums.push(data);
// });

var control_settings = {
  '1':{
    name:'mod1',
    qual:'freq',
    multiplier:1/15
  },
  '2':{
    name:'mod2',
    qual:'freq',
    multiplier:1/10
  },
  '3':{
    name:'mod3',
    qual:'freq',
    multiplier:1/10
  },
  '4':{
    name:'drum1',
    qual:'speed',
    multiplier:1/10
  },
  '5':{
    name:'drum1',
    qual:'buffer.url',
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
    // synthDef: {
    //         id:'mod3',
    //         ugen: "flock.ugen.filter.moog",
    //     cutoff: {
    //         id:'mod1',
    //         ugen: "flock.ugen.sinOsc",
    //         freq: 1/4,
    //         mul: 5000,
    //         add: 7000
    //     },
    //     resonance: {
    //         id:'mod2',
    //         ugen: "flock.ugen.sinOsc",
    //         freq: 1/2,
    //         mul: 1.5,
    //         add: 1.5
    //     },
    //     source: {
    //         ugen: "flock.ugen.lfSaw",
    //         id:"carrier"
    //     },
    //     mul: 0.5
    // }

       synthDef: {
          id:'mod1',
           ugen: "flock.ugen.granulator",
           numGrains: 1,
           grainDur: 0.5,
           delayDur: 0.25,
           mul: 0.5,
           source: {
                 id:'carrier',
                   ugen: "flock.ugen.lfSaw",
                   freq: 400,
                   mul: 0.25
               }
       }


});
  synths.push(moogSynth);
}

function sendCtrl(msg){
  var setting = control_settings[msg.controller].name.toString() + '.' + control_settings[msg.controller].qual.toString();
  synths.forEach(function(syn){
    // if(msg.controller == 5 && syn.namedNodes["drum"]){
    //
    // }
   if(!!syn.namedNodes[control_settings[msg.controller].name]){
      syn.set(setting, (control_settings[msg.controller]['multiplier'] * msg.value));
    }
  });
}

function sendNote(msg){
  enviro.nodes[enviro.nodes.length-1].set('carrier.freq', flock.midiFreq(msg.note));
}


input.on('noteon', function (msg) {
  synthCount +=1;
  synthNote(msg.note);
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
            id: "drum2",
            url: "./drumkit/kick.WAV"
        },
        loop: 1,
        start: 0,
        speed:1
    }
});
synths.push(drum);
// drum.play();
function randomDrums(){
  var random_i = Math.floor(Math.random()*rand_drums.length);
  console.log(drum["drum2"]);
  console.log(drum.get('drum2.src'));
  //drum.set('drum2.url', './' + rand_drums[random_i]);
}
//randomDrums();
// var src = drum.get('drum1.buffer.src');
//   console.log(src);

enviro.start();
