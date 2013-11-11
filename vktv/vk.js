
function getFriends(callback){
   VK.Api.call('friends.get', {fields:'first_name,photo, last_name, sex'}, callback);
}

function getUserInfo(callback){
        VK.api("getProfiles", {uids:idVk,fields:'first_name,photo, last_name, sex'}, callback);
}