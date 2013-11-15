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
    var circle = new Kinetic.Circle({
        x: lineToSource.getPoints()[1].x,
        y: lineToSource.getPoints()[1].y,
        radius: 5,
        fill: 'red'
    });
    layer.add(circle);
    var tweenAnimation = new Kinetic.Tween({
        node: circle,
        duration: 0.5,
        radius: radius
    });

    // Анимация
    this.appear = function() {
        var executeFirst = true;
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
            if (executeFirst) {
                setTimeout(function () {
                   tweenAnimation.play();
                });
                executeFirst = false;
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


var mainMenu = (function(){
    var button={};
    var buttons = new Array();

    button.draw = function(x, y){
         return
    }

    return button;
})

/*
var arc = new Kinetic.Shape({
        drawFunc: function(layer) {
            var x = 100;
            var y = 100;
            var radius = 70;
            var startAngle = 3 * (Math.PI / 2);
            var endAngle = 0 * Math.PI;
            layer.beginPath();
            layer.bezierCurveTo(140, 10, 388, 10, 388, 170);
            layer.lineWidth = 10;
            */
/*layer.arc(x, y, radius, startAngle, endAngle, false);
            layer.fillStrokeShape(this);*//*

        },
    stroke: 'black',
    strokeWidth: 4,
    draggable:true
});
*/
var triangle = new Kinetic.Shape({
    drawFunc: function(context) {
        context.beginPath();
        if (this.getAttr('animate')) {
            var inc = this.getAttr('inc');
            this.getAttr('center').x += inc;
            this.getAttr('center').y -= inc;
        }
        var x = this.getAttr('center').x;
        var y = this.getAttr('center').y;
        var radius = this.getAttr('radius');
        var animate = this.getAttr('animate');
        var startAngle = 3 * (Math.PI / 2);
        var endAngle = 0 * Math.PI;
        context.moveTo(x, y - (radius / 2));
        context.arc(x, y, radius, startAngle, endAngle, false);
        context.lineTo(x + (radius / 2), y);
        context.closePath();

        // KineticJS specific context method
        context.fillStrokeShape(this);
    },
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 4,
    center: getCoordinatesFromShape(mainCircle),
    animate: false,
    radius: 100,
    inc: 0.07
});

var triangle1 = new Kinetic.Shape({
    drawFunc: function(context) {
        context.beginPath();
        if (this.getAttr('animate')) {
            var inc = this.getAttr('inc');
            this.getAttr('center').x += inc;
            this.getAttr('center').y += inc;
        }
        var x = this.getAttr('center').x;
        var y = this.getAttr('center').y;
        var radius = this.getAttr('radius');
        var startAngle = 0;
        var endAngle = Math.PI / 2;
        context.moveTo(x + (radius / 2), y);
        context.arc(x, y, radius, startAngle, endAngle, false);
        context.lineTo(x, y + (radius / 2));
        context.closePath();

        // KineticJS specific context method
        context.fillStrokeShape(this);
    },
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 4,
    center: getCoordinatesFromShape(mainCircle),
    animate: false,
    radius: 100,
    inc: 0.07
});
var triangle2 = new Kinetic.Shape({
    drawFunc: function(context) {
        context.beginPath();
        if (this.getAttr('animate')) {
            var inc = this.getAttr('inc');
            this.getAttr('center').x -= inc;
            this.getAttr('center').y += inc;
        }
        var x = this.getAttr('center').x;
        var y = this.getAttr('center').y;
        var radius = this.getAttr('radius');
        var startAngle = Math.PI / 2;
        var endAngle = Math.PI;
        context.moveTo(x, y + (radius / 2));
        context.arc(x, y, radius, startAngle, endAngle, false);
        context.lineTo(x - (radius / 2), y);
        context.closePath();

        // KineticJS specific context method
        context.fillStrokeShape(this);
    },
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 4,
    center: getCoordinatesFromShape(mainCircle),
    animate: false,
    radius: 100,
    inc: 0.07
});
var triangle3 = new Kinetic.Shape({
    drawFunc: function(context) {
        context.beginPath();
        if (this.getAttr('animate')) {
            var inc = this.getAttr('inc');
            this.getAttr('center').x -= inc;
            this.getAttr('center').y -= inc;
        }
        var x = this.getAttr('center').x;
        var y = this.getAttr('center').y;
        var radius = this.getAttr('radius');
        var startAngle = Math.PI;
        var endAngle = 3 * (Math.PI / 2);
        context.moveTo(x - (radius / 2), y);
        context.arc(x, y, radius, startAngle, endAngle, false);
        context.lineTo(x, y - (radius / 2));
        context.closePath();

        // KineticJS specific context method
        context.fillStrokeShape(this);
    },
    fill: '#00D2FF',
    stroke: 'black',
    strokeWidth: 4,
    center: getCoordinatesFromShape(mainCircle),
    animate: false,
    radius: 100,
    inc: 0.07
});


mainCircle.on('click', function(e) {
    var anim = new Kinetic.Animation(function(frame) {
        var center = getCoordinatesFromShape(mainCircle);
    //    var angleDiff = frame.timeDiff * angularSpeed / 1000;
        var stop = false;
        var buttons = group.getChildren();
        for(var i = 0; i < buttons.length; i++){
            stop = false;
            buttons[i].getAttrs['animate'] = true;
            buttons[i].getAttrs['inc'] = 0.1;
            var buttonRadius = buttons[i].getAttr('radius');
            var circleRadius = mainCircle.getRadius();
            var buttonCenter = buttons[i].getAttr('center');

            if ((Math.abs((buttonCenter.x + buttonRadius)) >= (Math.abs(center.x + circleRadius) - 5)) ||
                (Math.abs((buttonCenter.x - buttonRadius)) >= (Math.abs(center.x - circleRadius) + 5))) {
                stop = true;
            }
        }

            if (stop) {
                this.stop();
            }

   }, layer);
    anim.start();
    //drawFriends();
});


var group = new Kinetic.Group({
});
layer.add(mainCircle);
group.add(triangle);
group.add(triangle1);
group.add(triangle2);
group.add(triangle3);

layer.add(group);

// add the shape to the layer


//drawFriends();

// add the shape to the layer
//layer.add(rect);

// add the layer to the stage
stage.add(layer);

function firstAnimation() {
    new Kinetic.Tween({
        node: mainCircle,
        duration: 0.5,
        duration: 4,
        radius: mainCircle.getRadius() + 50
    }).play();
    var buttons = group.getChildren();
    for (var i = 0; i < buttons.length; i++) {
        new Kinetic.Tween({
            node: buttons[i],
            duration: 0.5,
            duration: 4,
            animate: true,
            radius: buttons[i].getAttr('radius') + 5
        }).play();
    }
}
firstAnimation();