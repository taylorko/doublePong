"use strict";

var gamestage = new createjs.Stage("gamecanvas");

function checkCollision(object1, object2) {
	return !(object1.y + object1.spriteSheet._frameHeight < object2.y || object1.y > object2.y + object2.spriteSheet._frameHeight || object1.x > object2.x + object2.spriteSheet._frameWidth || object1.x + object1.spriteSheet._frameWidth < object2.x
	);
}

var Ball = function(i) {
	this.animations = new createjs.Sprite(new createjs.SpriteSheet({
		"images" : ["./ball.png"],
		"frames" : {
			"width" : 16,
			"height" : 16,
			"count" : 4
		},
		"animations" : {
			"ball" : {
				"frames" : [0, 1, 2, 3, 0, 0, 0],
				"speed" : 0.25
			}
		}
	}), "ball");

	this.animations.x = 32 * i;
	this.animations.y = 32 * i;
	this.xdirection = 1;
	this.ydirection = 1;

	gamestage.addChild(this.animations);

	this.checkCollisions = function() {
		if(this.animations.x < 0 || (this.animations.x + this.animations.spriteSheet._frameWidth > gamestage.canvas.width)) {
			location.reload();
		} 
		if(this.animations.y < 0 || this.animations.y + this.animations.spriteSheet._frameHeight > gamestage.canvas.height) {
			this.ydirection *= -1;
		}
		if(checkCollision(paddleLeft.animations, this.animations)) {
			this.xdirection *= -1;
		}
		if(checkCollision(paddleRight.animations, this.animations)) {
			this.xdirection *= -1;
		}
	};

	this.updatePosition = function() {
		this.animations.y += this.ydirection;
		this.animations.x += this.xdirection;
	};
};
var PaddleL = function() {

	this.animations = new createjs.Sprite(new createjs.SpriteSheet({
		"images" : ["./paddle.png"],
		"frames" : {
			"width" : 8,
			"height" : 32,
			"count" : 1
		},
		"animations" : {
			"paddleLeft" : {
				"frames" : [0]
			}
		}
	}), "paddleLeft");

	this.animations.x = 16;
	this.animations.y = 32;

	this.downwardmovement = false;
	this.upwardmovement = false;

	gamestage.addChild(this.animations);

	this.updatePosition = function() {
		if(this.downwardmovement) {
			this.animations.y++;
		} else if(this.upwardmovement) {
			this.animations.y--;
		}
	};
};
var PaddleR = function() {

	this.animations = new createjs.Sprite(new createjs.SpriteSheet({
		"images" : ["./paddle.png"],
		"frames" : {
			"width" : 8,
			"height" : 32,
			"count" : 1
		},
		"animations" : {
			"paddle" : {
				"frames" : [0]
			}
		}
	}), "paddle");

	this.animations.x = 275;
	this.animations.y = 32;

	this.downwardmovement = false;
	this.upwardmovement = false;

	gamestage.addChild(this.animations);

	this.updatePosition = function() {
		if(this.downwardmovement) {
			this.animations.y++;
		} else if(this.upwardmovement) {
			this.animations.y--;
		}
	};
};
var balls = [];
for(var i = 0; i < 1; i++) {
	balls[i] = new Ball(i + 1);
}
//var ball = new Ball();
var paddleLeft = new PaddleL();
var paddleRight = new PaddleR();

var frameTick = function() {
	for(var i = 0; i < balls.length; i++) {
		balls[i].checkCollisions();
		balls[i].updatePosition();
	}

	paddleLeft.updatePosition();
	paddleRight.updatePosition();
	isMoving(this);
	console.log("Moving is: " + moving);

	gamestage.update();
};

document.onkeydown = function(event) {
	if(event.keyCode === 40) {
		paddleLeft.downwardmovement = true;
		paddleLeft.upwardmovement = false;
	} else if(event.keyCode === 38) {
		paddleLeft.downwardmovement = false;
		paddleLeft.upwardmovement = true;
	}
};

document.onkeyup = function(event) {
	if(event.keyCode === 40) {
		paddleLeft.downwardmovement = false;
	} else if(event.keyCode === 38) {
		paddleLeft.upwardmovement = false;
	}
};
var prevX = 0;
var prevY = 0;

// see if mouse is moving or stopped
function isMoving(event) {
	if(moving) {
		document.onmousemove = function(event) {
			// if the mouse is moving up
			if((prevY > event.clientY) && moving) {
				console.log("the mouse is moving up");
				paddleRight.downwardmovement = false;
				paddleRight.upwardmovement = true;

				//mouse is moving down
			} else if((prevY < event.clientY) && moving) {
				console.log("the mouse is moving down");
				paddleRight.downwardmovement = true;
				paddleRight.upwardmovement = false;
			}
			prevY = event.clientY;
		}
	} else {
		paddleRight.downwardmovement = false;
		paddleRight.upwardmovement = false;
	}
}

var timer;
// boolean to see if mouse is moving
var moving = false;
document.addEventListener("mousemove", function() {
	moving = true;
	clearTimeout(timer);
	timer = setTimeout(function() {
		moving = false
	}, 1);
})

createjs.Ticker.addEventListener("tick", frameTick);
createjs.Ticker.setFPS(60);
