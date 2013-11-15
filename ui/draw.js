var stageWidth = screen.width * 0.95;
var stageHeight = screen.height * 1;
var bigRoundRad = stageHeight / 5;
var littleRoundRad = stageHeight / 10;
var gradDif = 360 / 5;
var refFromCenter = stageHeight / 2.5;
var viewportRect = new utils.Rect(Math.floor(screen.width * 0.05), Math.floor(screen.height * 0.05),
    Math.floor(screen.width * 0.9), Math.floor(screen.height * 0.9));

var stage = new Kinetic.Stage({
    container: 'container',
    width: stageWidth,
    height: stageHeight
});

var friends = new Array();

var oldLayer = new Kinetic.Layer();
// Надо вынести в константы, чтоль
var radius = 50;
var drawOldItems = function() {
    for(var i = 0; i < 40; i++) {
        var coords = utils.getCircleCoordinates(viewportRect, oldLayer, littleRoundRad);
        if(!coords) {
            console.log('Sorry, we did not find free space, only %s circles drawn', i);
            break;
        }
        var item = new Kinetic.Circle({
            x: coords.x,
            y: coords.y,
            radius: littleRoundRad,
            fillRadialGradientStartRadius: littleRoundRad * 0.9,
            opacity: 0.5,
            fillRadialGradientEndRadius: littleRoundRad,
            fillRadialGradientColorStops: [0, 'green', 1, 'transparent']
        });
        oldLayer.add(item);
    }
};
//drawOldItems();
window.oldLayer = oldLayer;
stage.add(oldLayer);

var layer = new Kinetic.Layer();
var mainCircle = new Kinetic.Circle({
    x: stage.getWidth() / 2,
    y: stage.getHeight() / 2,
    radius: bigRoundRad,
    fill: 'red'
});



mainCircle.on('click', function(e) {
    //myfriend.appear();
    drawFriends();
});


function drawFriends() {
    //var rects = randomRectPosition(5);
    for (var i = 0; i < 5; i++){
		var friend = new Friend(null, utils.getCircleCoordinates(viewportRect, layer, 50), getCoordinatesFromShape(mainCircle), layer);
        friends.push(friend);
		friend.appear();
    }

/*    for (i = 0; i < 5; i++){
        var rot = i * gradDif;
        var multX;
        var multY;
        if((rot >=0 && rot <= 90) || (rot >= 270 && rot <= 360)){
            multY = 1;
        } else {
            multY = -1;
        }
        if(rot >=0 && rot <= 180){
            multX = 1;
        } else {
            multX = -1;
        }
        var xc = stage.getWidth() / 2 +  multX * refFromCenter * Math.abs(Math.sin(rot / 57.29));
        var yc = stage.getHeight() / 2 - multY * refFromCenter * Math.abs(Math.cos(rot / 57.29));
        var littleCircle = new Kinetic.Circle({
            x: xc,
            y: yc,
            radius: littleRoundRad,
            fill: 'green'
        });
        layer.add(littleCircle);
    }
    layer.draw();*/
};

function randomRectPosition(count) {
   count = count || 5;
   var rects = new Array();
   var min = 1;
   var max = 100;
   var y = Math.floor((Math.random() * max) + min);
   for (var i = 0; i < count; i++) {
       rects.push(new utils.Rect(100, 100, Math.floor((Math.random() * max) + min), y));
       if (i == Math.round(count / 2)) {
           y += max;
           min = 1;
           max = 100;
       } else {
           min = max + (max * 2);
           max += max + min;
       }
   }
    return rects;
}

// Конструктор объекта типа "друг" (вообще-то он должен быть универсальным)
function Friend(friend, start_point, end_point, layer) {
    // Круг
    var circle = null;
    var short_line_length = 10;
    var lineAnimation = new Kinetic.Animation(null);
    var circleAnimation  = new Kinetic.Animation(null);
    this.isAnimationStopped = function() {
       return (!lineAnimation.isRunning()) && (!circleAnimation.isRunning());
    }
    this.getCircle = function() {
        return circle;
    }
    // Начало линии
    var short_point = getPointOnLine(start_point, end_point, short_line_length);
    var lineFromSource = new Kinetic.Line({
        points: [start_point.x, start_point.y, short_point.x, short_point.y],
        stroke: 'red',
        strokeWidth: 15,
        lineCap: 'round',
        lineJoin: 'round'
    });
    var lineToSource = new Kinetic.Line({
        points: [end_point.x, end_point.y, short_point.x, short_point.y],
        stroke: 'red',
        strokeWidth: 15,
        lineCap: 'round',
        lineJoin: 'round'
    });

    // Анимация
    this.appear = function() {
        layer.add(lineFromSource);
        layer.add(lineToSource);
        var line_inc = 10;
        var currentLengthIn = short_line_length;
        var currentLengthOut = short_line_length;
        // Анимация развертки блогов и сообщений
        lineAnimation = new Kinetic.Animation(function (frame) {
            currentLengthIn += line_inc;
            var next_point = getPointOnLine(start_point, end_point, currentLengthIn)
            lineFromSource.getPoints()[1].x = next_point.x;
            lineFromSource.getPoints()[1].y = next_point.y;
            if (lineFromSource.intersects(lineToSource.getPoints()[1])) {
                lineAnimation.stop();
                if (circleAnimation.isRunning()) {
                    setTimeout(function () {
                        circleAnimation.stop();
                    }, 500);
                }
            }
        }, layer);
        circleAnimation = new Kinetic.Animation(function (frame) {
            currentLengthOut += line_inc;
            if (circle == null) {
                circle = new Kinetic.Circle({
                    x: lineToSource.getPoints()[1].x,
                    y: lineToSource.getPoints()[1].y,
                    radius: 10,
                    fill: 'red'
                });
                layer.add(circle);
                setTimeout(function () {
                    new Kinetic.Tween({
                        node: circle,
                        duration: 0.5,
                        radius: radius
                    }).play();
                });
            }
            var next_point = getPointOnLine(end_point, start_point, currentLengthOut)
            lineToSource.getPoints()[1].x = next_point.x;
            lineToSource.getPoints()[1].y = next_point.y;
            if (lineFromSource.intersects(lineToSource.getPoints()[1])) {
                circleAnimation.stop();
                if (lineAnimation.isRunning()) {
                    setTimeout(function () {
                        lineAnimation.stop();
                    }, 500);
                }
            }
        }, layer);
        circleAnimation.start();
        lineAnimation.start();
    }
}

function choosePosition() {
    var seed = 1000;
    return {x:Math.round(Math.random()*seed), y:Math.round(Math.random()*seed)};
}

function getPointOnLine(start_point, end_point, distance) {
    var dx = end_point.x - start_point.x;
    var dy = end_point.y - start_point.y;
    var fraction = Math.max(Math.abs(dx), Math.abs(dy)) / distance;
    if (fraction < 1) {
        return end_point;
    } else {
        var x = start_point.x + dx / fraction;
        var y = start_point.y + dy / fraction;
        return {x:Math.round(x), y:Math.round(y)};
    }
}

function pointsEquals(start_point, end_point) {
    var result;
    if (start_point.x == end_point.x && start_point.y == end_point.y) {
        result = true;
    } else {
        result = false;
    }
    return result;
}

function getCoordinatesFromShape(shape) {
     return {x : shape.getX(), y : shape.getY()}
}


// add the shape to the layer
layer.add(mainCircle);

//drawFriends();

// add the shape to the layer
//layer.add(rect);

// add the layer to the stage
stage.add(layer);