module.exports = function(enviro){


var flock = require(__dirname + "/node_modules/flocking/nodejs/index.js");
//var enviro = flock.init();

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
        }
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
        }
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
        }
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
  setInterval(drumMachine, (15000/bpm));
}

drums.push(kick);
drums.push(snare);
drums.push(hihat);

global_interval = setInterval(drumMachine, (15000/bpm));

enviro.start();

}
