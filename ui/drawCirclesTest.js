var friends = [{"name":"Ivan"}, {"name":"Vlad"}, {"name":"Anton"}, {"name":"Сергей"}, {"name":"Вован"}, {"name":"Петька"}];

function process() {
	for (i=0; i<friends.size; i++) {
		drawFriend(friends[i]);
	}
}


function drawFriend(friend, layer) {
	var friend = new Kinetic.Group({
        x: 220,
        y: 40
    });
    var littleCircle = new Kinetic.Circle({
        x: 50,
        y: 50,
        radius: 100,
        fill: 'green'
    });
    var content = new Kinetic.Text({
        x: 50,
        y: 50,
        text: friend.name,
        fontSize: 30,
        fontFamily: 'Calibri',
        fill: 'red'
      });

    friend.add(littleCircle);
    friend.add(content);
    layer.add(friend);
}

function choosePosition() {
	var seed = 200;
    return [Math.round(Math.random()*seed), Math.round(Math.random()*seed)];
}