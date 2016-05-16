var easymidi = require('easymidi');
var input = new easymidi.Input("MPK mini 20:0");

var fluid = require("infusion"),
    flock = require(__dirname + "/node_modules/flocking/nodejs/index.js"), //jshint ignore:line
    enviro = flock.init();

var synths = [];
var synthCount = 1;


var band = flock.band({
components: {
kick: {
    type: "flock.synth",
    options: {
        synthDef: {
            ugen: "flock.ugen.playBuffer",
            buffer: {
              id: 'kick',
              url: './drumkit/kick.WAV',
              start:0,
              loop:1
            }
        }
    }
},
snare: {
  type:'flock.synth',
  options: {
    synthDef: {
      ugen: "flock.ugen.playBuffer",
      buffer: {
        id:'snare',
        url:'./drumkit/snare.WAV',
        start:0,
        loop:1
      }
    }
  }
}
}
});

//
// var drum = flock.synth({
//   synthDef: {
//         ugen: "flock.ugen.playBuffer",
//         buffer: {
//           id:'snare',
//           url:'./drumkit/snare.WAV',
//           start:0,
//           loop:1
//         }
//       }
// })
// drum.play()


enviro.start();
