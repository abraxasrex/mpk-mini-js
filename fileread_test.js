var fs = require('fs');
fs.readdir('./drumkit', function(err,data){
  console.log(data);
});
