var http = require("http");
var mongoose = require('mongoose');
var model = require('./model');
var dao = require('./friendsDAO');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
    // Create your schemas and models here.
});

mongoose.connect('mongodb://localhost/test');

http.createServer(function(request, response) {
    /*var post = new model.posts({id: 1, time: 1, likesCount: 1});

    var friends = new model.friends({id: 1, friends: [2,3,4,5,6,7]});

    friends.save(function(err, result){
        console.log(result);
    });    */
    //dao.getFriends(4, function(data){console.log(data)});
    dao.addFriend(2, 12);
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
}).listen(8888);
