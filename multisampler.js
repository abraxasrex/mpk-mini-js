var easymidi = require('easymidi');
var input = new easymidi.Input("MPK mini 20:0");
var flock = require(__dirname + "/node_modules/flocking/nodejs/index.js");
var enviro = flock.init();
var synths = [];
function handleNoteOff(msg){
  enviro.nodes.forEach(function(syn){
    // if(syn.namedNodes["samp"] && syn.namedNodes["player"].start == (0.00787401574*note) + 0.05){
      synths.splice(synths.indexOf(syn), 1);
      syn.destroy();
    // }
  });
}

function handleNoteOn(msg){
  console.log(msg.note);
  defineSynth(msg.note);
//  enviro.nodes[enviro.nodes.length-1].set('player.start', (1/ msg.note) + 0.5 );
}

function defineSynth(note){
  var multisampler = flock.synth({
    synthDef: {
      id:"player",
      ugen: "flock.ugen.playBuffer",
      buffer: {
          id: "samp",
          url: "./Chant.wav"
      },
      loop: 1,
      mul:0.5,
      speed: 1.2,
      start: (0.00787401574*note) + 0.05
    }
});
  synths.push(multisampler);
}

input.on('noteon', handleNoteOn);

input.on('noteoff', handleNoteOff);

//input.on('cc', handleCtrl);

enviro.start();
