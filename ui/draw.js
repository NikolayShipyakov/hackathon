var stageWidth = screen.width * 0.95;
var stageHeight = screen.height * 1;
var bigRoundRad = stageHeight / 5;
var littleRoundRad = stageHeight / 10;
var gradDif = 360 / 5;
var refFromCenter = stageHeight / 2.5;

var stage = new Kinetic.Stage({
    container: 'container',
    width: stageWidth,
    height: stageHeight
});

var isCircleIntercept = function(circles, coords, radius) {
    return circles.some(function(circle) {
        return Math.abs(circle.getX() - coords.x) < (circle.getRadius() + radius)
            && Math.abs(circle.getY() - coords.y) < (circle.getRadius() + radius);
    });
};

var getCircleCoordinatesLight = function(circles, radius) {
    var coords = null,
        weight = stageWidth - radius * 2,
        height = stageHeight - radius * 2;
    tries = 1000;
    do {
        if(!tries) return null;
        coords = {x: weight* Math.random() + radius, y: height * Math.random() + radius};
    } while(isCircleIntercept(circles, coords, radius));
    return coords;
};

var getCircleCoordinatesHeavy = function(circles, radius, step) {
    var availableCoords = [],
        y = radius,
        x = radius;
    step = step || 1;
    while(y + radius < stageHeight) {
        while(x + radius < stageWidth) { 
            var coords = {x: x, y: y};
            if(!isCircleIntercept(circles, coords, radius)) {
                availableCoords.push(coords);
            }
            x += step;
        }
        x = radius
        y += step;
    }
    var coords = null;
    if(availableCoords.length > 0) {
        var index = Math.round(Math.random() * availableCoords.length);
        coords = availableCoords[index];
    }

    return coords;
};


var getCircleCoordinates = function(layer, radius) {
    var circles = layer.getChildren().filter(function(el) {return el instanceof Kinetic.Circle});
    //var coords = getCircleCoordinatesLight(circles, radius);    
    var coords = getCircleCoordinatesHeavy(circles, radius, 10)
    
    return coords;
};

var oldLayer = new Kinetic.Layer();
var drawOldItems = function() {
    for(var i = 0; i < 40; i++) {
        var coords = getCircleCoordinates(oldLayer, littleRoundRad);
        if(!coords) {
            console.log('Sorry, we did not find free space, only %s circles drawn', i)
            break;
        }
        var item = new Kinetic.Circle({
            x: coords.x,
            y: coords.y,
            radius: littleRoundRad,
            fillRadialGradientStartRadius: littleRoundRad * 0.9,
            opacity: 0.5,
            fillRadialGradientEndRadius: littleRoundRad,
            fillRadialGradientColorStops: [0, 'green', 1, 'transparent'],
        });
        oldLayer.add(item);
    }
};
drawOldItems();
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
    for (i = 0; i < 5; i++){
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
};

// add the shape to the layer
layer.add(mainCircle);

drawFriends();

// add the shape to the layer
//layer.add(rect);

// add the layer to the stage
stage.add(layer);