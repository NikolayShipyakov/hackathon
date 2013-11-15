var mongoose = require('mongoose');

var postsSchema = new mongoose.Schema({
    id: Number, time: Number, likesCount: Number, comments: Array
});

var friendsSchema = new mongoose.Schema({
    id: Number, friends: Array
});

var Posts = mongoose.model('Posts', postsSchema);
var Friends = mongoose.model('Friends', friendsSchema);

exports.Posts = Posts;
exports.Friends = Friends;