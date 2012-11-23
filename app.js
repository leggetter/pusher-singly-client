var express = require('express');

var app = express( express.logger() );
app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

app.get('/', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});