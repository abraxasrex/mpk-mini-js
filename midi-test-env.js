var easymidi = require('easymidi');
var input = new easymidi.Input('*');

input.on('*', function(msg){
  console.log(msg);
})
