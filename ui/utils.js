var utils = (function() {
	var exports = {};

	var Rect = function(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	};
	exports.Rect = Rect;

	var isCircleIntercept = function(circles, coords, radius) {
	    return circles.some(function(circle) {
	        return Math.abs(circle.getX() - coords.x) < (circle.getRadius() + radius)
	            && Math.abs(circle.getY() - coords.y) < (circle.getRadius() + radius);
	    });
	};

	var getCircleCoordinatesByRandom = function(circles, radius, rect, tries) {
	    var width = rect.width - radius * 2,
	    	height = rect.height - radius * 2,
	    	coords = null;
	    tries = tries || 100;
	    do {
	        if(!tries--) return null;
	        coords = {
	        	x: rect.x + (width * Math.random() + radius),
	        	y: rect.y + (height * Math.random() + radius)
	        };
	    } while(isCircleIntercept(circles, coords, radius));
	    return coords;
	};

	var getHalfRect = function(rect) {
		var quaterWidth = Math.floor(rect.width / 4);
		var quaterHeight = Math.floor(rect.height / 4);
		var halfRect = new Rect(
			rect.x + quaterWidth,
			rect.y + quaterHeight,
			Math.floor(rect.width / 2),
			Math.floor(rect.height / 2)
		); 
		return halfRect;	
	};

	exports.getCircleCoordinates = function(rect, layer, radius) {
		var circles = layer.getChildren().filter(function(el) {return el instanceof Kinetic.Circle});
		var halfRect = getHalfRect(rect);
		var quaterRect = getHalfRect(halfRect);
		var coords = getCircleCoordinatesByRandom(circles, radius, quaterRect, 5);
		if(!coords) {
			coords = getCircleCoordinatesByRandom(circles, radius, halfRect, 20);
		}
		if(!coords) {
			coords = getCircleCoordinatesByRandom(circles, radius, rect, 1000);
		}		
		return coords;
	};
	return exports;
})();