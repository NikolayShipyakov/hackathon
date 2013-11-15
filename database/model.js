var mongoose = require('mongoose');

var postsSchema = new mongoose.Schema({
    id: Number, time: Number, likesCount: Number
});

var friendsSchema = new mongoose.Schema({
    id: Number, friends: Array
});

Posts = mongoose.model('Posts', postsSchema);
Friends = mongoose.model('Friends', friendsSchema);

exports.posts = Posts;
exports.friends = Friends;