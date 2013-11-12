var http = require("http");
var MongoClient = require('mongodb').MongoClient;


http.createServer(function(request, response) {
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
        if(err) {
            console.log("err = ", err);
            throw err;
        }

        var collection = db.collection('test_insert1');
        collection.insert({b:3, c:1}, function(err, docs) {

            collection.count(function(err, count) {
                console.log("count = ", count);
            });

            // Locate all the entries using find
            /*collection.find().toArray(function(err, results) {
                console.dir(results);
                // Let's close the db
                db.close();
            });*/
            collection.findOne({b: 3}, function(err, results) {
                console.dir(results);
                // Let's close the db
                db.close();
            })
        });
    });
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
}).listen(8888);



