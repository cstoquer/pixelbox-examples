var Ball   = require('./Ball');
var Paddle = require('./Paddle');

var ball   = new Ball();
var paddle = new Paddle();


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
	paper(5).cls();
	ball.move();
	paddle.move();

	ball.checkPaddle(paddle);

	ball.draw();
	paddle.draw();
};
