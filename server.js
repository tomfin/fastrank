var express = require('express');
var path = require('path');
var app = express();

// set the port of our application
var port = process.env.PORT || 80;

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/dist'));

// re-write any contexts to hit the index and be picked up by angularjs
app.use(function(req, res) {
	res.sendFile(__dirname + '/dist/index.html');
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
