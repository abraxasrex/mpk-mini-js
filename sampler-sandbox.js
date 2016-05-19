var easymidi = require('easymidi');
var input = new easymidi.Input("MPK mini 20:0");

var fluid = require("infusion"),
    flock = require(__dirname + "/node_modules/flocking/nodejs/index.js"), //jshint ignore:line
    enviro = flock.init();

var sampler = [];
var synthCount = 0;

var pool = require("./node_modules/pitch-shift/node_modules/typedarray-pool/pool.js")
var pitchShift = require("pitch-shift")


// function createProcessingNode(context) {
//   var queue = []
//   var frame_size = 1024
//   var hop_size = 256
//
//   var shifter = pitchShift(function(data) {
//     var buf = pool.mallocFloat32(data.length)
//     buf.set(data)
//     queue.push(buf)
//   }, function(t, pitch) {
//     console.log(t, pitch)
//     return 0.1 * (Math.round(t) % 15) + 0.5
//   }, {
//     frameSize: frame_size,
//     hopSize: hop_size
//   })
//
//   //Enque some garbage to buffer stuff
//   shifter(new Float32Array(frame_size))
//   shifter(new Float32Array(frame_size))
//   shifter(new Float32Array(frame_size))
//   shifter(new Float32Array(frame_size))
//   shifter(new Float32Array(frame_size))
//
//   //Create a script node
//   var scriptNode = context.createScriptProcessor(frame_size, 1, 1)
//   scriptNode.onaudioprocess = function(e){
//     shifter(e.inputBuffer.getChannelData(0))
//     var out = e.outputBuffer.getChannelData(0)
//     var q = queue[0]
//     queue.shift()
//     out.set(q)
//     pool.freeFloat32(q)
//   }
//
//   return scriptNode
// }



function handleNoteOn(msg){
  console.log(msg.note, 'note is');
  defineSynth(msg.note);
}

function handleNoteOff(msg){
  synthCount -=1;
  console.log('enviro nodes', enviro.nodes.length);
  sampler.forEach(function(samp){
      samp.destroy();
      sampler.splice(sampler.indexOf(samp), 1);

  });
}

function defineSynth(note){
    console.log('note at definition is', note);
    var sample = flock.synth({
      synthDef: {
        id:'buf',
        ugen: "flock.ugen.readBuffer",
      //  buffer: enviro.buffers["bass" + note],
      buffer: {
        url:'./ah.wav'
      }
    }
  });
   sampler.push(sample);
   console.log(sample);

}

//var sample;
////load sampler
var i = 1;

function loadSampler(){
  if(i < 127){
      i+=1;
    //  var buffer;
        flock.audio.decode({
          src: "./ah.wav", // src can also be a File object or Data URL.
          sampleRate: 48000,
          success: function (bufferDescription) {
          //  var buffer = bufferDescription;
              bufferDescription.id = "bass" + i;
              enviro.registerBuffer(bufferDescription);
          },
          error: function (err) {
              console.log('err at ', err);
          }
      });
    }else{
      clearInterval(setter);
      console.log('loading done');
      for(var key in enviro){
      //  console.log(key["adui"]);
      }
    //  console.log(enviro.audioSettings);
    }
}

//var setter = setInterval(loadSampler, 25);

///


input.on('noteon', handleNoteOn);

input.on('noteoff', handleNoteOff);

enviro.start();
//enviro.nodes
