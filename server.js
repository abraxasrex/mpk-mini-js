var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
app.listen(port);

app.get('*', function (req, res) {
  res.sendFile('./waves-test.html');
});

console.log('port: ', port)
