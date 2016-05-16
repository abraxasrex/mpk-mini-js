var easymidi = require('easymidi');
var input = new easymidi.Input("MPK mini 20:0");

var fluid = require("infusion"),
    flock = require(__dirname + "/node_modules/flocking/nodejs/index.js"), //jshint ignore:line
    enviro = flock.init();

var synthCount = 1;

var sampler = [];

function handleNoteOn(msg){
  console.log(msg.note, 'note is');
  defineSynth(msg.note);
//  enviro.nodes[enviro.nodes.length-1].set('strecher.freq', flock.midiFreq(msg.note));
}

function handleNoteOff(msg){
  synthCount -=1;
  console.log('enviro nodes', enviro.nodes.length);
  sampler.forEach(function(samp){
  //  if(syn.namedNodes["strecher"] && Math.floor(syn.namedNodes["stretcher"].inputs.freq.output["0"]) == Math.floor(flock.midiFreq(msg.note))){
      samp.destroy();
      sampler.splice(sampler.indexOf(samp), 1);
//    }
  });
}

function defineSynth(note){
    console.log('note at definition is', note);
    var sample = flock.synth({
      synthDef: {
        id:'buf',
        ugen: "flock.ugen.readBuffer",
        buffer: enviro.buffers["bass" + note],
      rate: note/127
    }
    });
    //sample.play();
    //id: enviro.buffers["bass" + note]
   //sample["buf"]["buffer"].rate = 366.666667 * note ;
   //sample.namedNodes["flocking-out"].rate = 336.666667 * note;
  // sample.namedNodes["buf"].speed = note / 400;
   sampler.push(sample);
  // console.log(sample);
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

var setter = setInterval(loadSampler, 25);

///


input.on('noteon', handleNoteOn);

input.on('noteoff', handleNoteOff);

enviro.start();
//enviro.nodes
