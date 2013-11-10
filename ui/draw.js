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

var oldLayer = new Kinetic.Layer();
var drawOldItems = function() {
    for(var i = 0; i < 8; i++) {
        var item = new Kinetic.Circle({
            x: stageWidth * Math.random(),
            y: stageHeight * Math.random(),
            radius: littleRoundRad,
            fillRadialGradientStartRadius: littleRoundRad * 0.9,
            opacity: 0.5,
            fillRadialGradientEndRadius: littleRoundRad,
            fillRadialGradientColorStops: [0, 'green', 1, 'white'],
        });
        oldLayer.add(item);
    }
};
drawOldItems();
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