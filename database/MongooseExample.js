var http = require("http");
var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
    // Create your schemas and models here.
});

mongoose.connect('mongodb://localhost/test');

var movieSchema = new mongoose.Schema({
    title: { type: String }
    , rating: String
    , releaseYear: Number
});

var Movie = mongoose.model('Movie', movieSchema);

http.createServer(function(request, response) {
    var thor = new Movie({
        title: 'Thor 2'
        , rating: '8/10'
        , releaseYear: '2013'  // Notice the use of a String rather than a Number - Mongoose will automatically convert this for us.
    });

    thor.save(function(err, thor) {
        if (err) return console.error(err);
        console.dir(thor);
    });
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
}).listen(8888);
