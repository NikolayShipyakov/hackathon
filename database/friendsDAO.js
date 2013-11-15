var model = require('./model');
exports.getFriends = function(userId, callback){
     model.Friends.findOne({id:userId}, callback);
};

exports.addFriend = function (userId, friendId, callback) {
    exports.getFriends(userId, function (err, data) {
        if (data) {
            if (data["friends"].indexOf(friendId) == -1) {
                var newFriendsList = data["friends"].concat(friendId);
                model.Friends.update({id: userId}, {$set: {friends: newFriendsList}}, function (err, result) {
                    if (err) {
                        console.log('error:' + err);
                    } else {
                        console.log(result);
                    }
                });
            }
        } else {
            var newFriends = new model.Friends({id: userId, friends: friendsArr});
            newFriends.save(function (err, result) {
                console.log(result);
            });
        }
    })
};

