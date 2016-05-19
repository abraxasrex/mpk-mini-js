var easymidi = require('easymidi');
var input = new easymidi.Input("MPK mini 20:0");
var flock = require(__dirname + "/node_modules/flocking/nodejs/index.js");
var enviro = flock.init();
var synths = [];
//global bpm
var bpm = 120;
//synth effects can track drum tempo!
var drumFX = 1;
//note amount tracker
var synthCount = 1;
// main synth
var mainSynth  = 0;
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
    name:'bpm',
    multiplier:1,
    qual:'freq',
    val:1
  },
  '8':{
    name:'fast_forward',
    multiplier:1,
    qual:'freq',
    val:1
  }
};


/////drumkit settings

var counters= [0,0,0];
var schedule = [[0,1,0,1,0,0,0,0,1,0,1,1,0,0,0,0],
                [0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
                [0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0]];
//bpm = 120;
var global_interval;
var drums = [];

var kick = flock.synth({
    synthDef: {
        ugen: "flock.ugen.playBuffer",
        buffer: {
            url: "./drumkit/kick.WAV"
        },
        trigger: {
          id:"trig",
          ugen: "flock.ugen.inputChangeTrigger",
            source: 0,
            duration: 0.01
        },
        mul:0.5
    }
});

var snare = flock.synth({
    synthDef: {
        ugen: "flock.ugen.playBuffer",
        buffer: {
            url: "./drumkit/snare.WAV"
        },
        trigger:  {
          id:"trig",
          ugen: "flock.ugen.inputChangeTrigger",
            source: 0,
            duration: 0.01
        },
        mul:0.5
    }
});

var hihat = flock.synth({
    synthDef: {
        ugen: "flock.ugen.playBuffer",
        buffer: {
            url: "./drumkit/hi hat.wav"
        },
        trigger:  {
          id:"trig",
          ugen: "flock.ugen.inputChangeTrigger",
            source: 0,
            duration: 0.01
        },
        mul:0.5
    }
});

function drumMachine(){
  drums.forEach(function(drum, index){
    drum.set('trig.source', schedule[index][counters[index]]);
    counters[index] +=1;
    if(counters[index] === schedule[index].length){
      counters[index] = 0;
    }
  });
}

function reSchedule(){
  clearInterval(global_interval);
  global_interval = setInterval(drumMachine, (15000/bpm));
}

//////

function handleNoteOn(msg){
  console.log(msg.note, ' is da note');
  chooseSynth(mainSynth);
//onsole.log(synths[synths.length-1])
  if(!!enviro.nodes[enviro.nodes.length-1].namedNodes["carrier"]){
    console.log('found carrier');
    enviro.nodes[enviro.nodes.length-1].set('carrier.freq', flock.midiFreq(msg.note));
  }
  if(!!enviro.nodes[enviro.nodes.length-1].namedNodes["player"]){
    enviro.nodes[enviro.nodes.length-1].set('player.start', (0.00787401574 *msg.note) + 0.05);
  }
  ctrlCheck();
}

function handleNoteOff(msg){
  synthCount -=1;
  enviro.nodes.forEach(function(syn){
    if(syn.namedNodes["carrier"] && Math.floor(syn.namedNodes["carrier"].inputs.freq.output["0"]) == Math.floor(flock.midiFreq(msg.note))){
      synths.splice(synths.indexOf(syn), 1);
      syn.destroy();
    // }else if(syn.namedNodes["samp"] && syn.namedNodes["player"].start == (0.00787401574*note) + 0.05){
    }else if(syn.namedNodes["player"]){
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
   if(msg.controller == 7){
     bpm = msg.value * 2;
     reSchedule();
   }
   if(msg.controller == 8){
     synths.forEach(function(syn){
       if(!!syn.namedNodes["carrier"]){
         console.log('found carrier');
         syn.set('mod1.freq', bpm/msg.value);
         syn.set('mod2.freq', bpm/msg.value);
         syn.set('mod3.freq', bpm/msg.value);
       }
     })
   }
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

function chooseSynth(idx){
  var arr = [
            {
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
    },
    {
    id:'gran',
    ugen: "flock.ugen.granulator",
    numGrains: 20,
    grainDur: 0.5,
    delayDur: 1/4,
    mul: 0.5,
        source: {
          id:'carrier',
            ugen: "flock.ugen.lfSaw",
            mul: 0.5
        }
    },

   {
     id: "carrier",
     ugen: "flock.ugen.sinOsc",
     mul: {
         id: "ampMod",
         ugen: "flock.ugen.sinOsc",
         freq: 1.0,
         mul: 0.25
     }
 },
   {
     id:"player",
     ugen: "flock.ugen.playBuffer",
     buffer: {
         id: "samp",
         url: "./Chant.wav"
     },
     mul:0.5,
     speed: 1.2,
     start: 0
   }
 ];

  synths.push(flock.synth({synthDef:arr[idx]}));
}

input.on('noteon', handleNoteOn);

input.on('noteoff', handleNoteOff);

input.on('cc', handleCtrl);

///init drums
drums.push(kick);
drums.push(snare);
drums.push(hihat);
global_interval = setInterval(drumMachine, (15000/bpm));
/////

//seSynth(0);
enviro.start();

//require('./drumkit.js')(enviro);

process.stdin.setEncoding('utf8');

process.stdin.on('data', function (res) {
  mainSynth = parseInt(res);
});
