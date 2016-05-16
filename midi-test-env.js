var easymidi = require('easymidi');

//get input names
console.log('MIDI inputs:');
console.log(easymidi.getInputs());

//get output names
console.log('MIDI outputs:');
console.log(easymidi.getOutputs());

//get note message specs
input.on('noteOn', function(msg){
  console.log(msg);
});

//get control message specs
input.on('cc', function(msg){
  console.log(msg);
})
