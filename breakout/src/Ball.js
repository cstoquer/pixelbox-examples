function Ball() {
	EventEmitter.call(this);
	this.x = 0;
	this.y = 100;
	this.speedX = 1;
	this.speedY = -1;
	this.frame = 0;
}
inherits(Ball, EventEmitter);
module.exports = Ball;


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Ball.prototype.move = function () {
	this.x += this.speedX;
	this.y += this.speedY;

	// collision with borders
	if (this.x < 0) {
		this.x = 0;
		this.speedX *= -1;
	} else if (this.x > 120) {
		this.x = 120;
		this.speedX *= -1;
	}

	if (this.y < 0) {
		this.y = 0;
		this.speedY *= -1;
	} else if (this.y > 128) {
		this.emit('fall');
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Ball.prototype.checkPaddle = function (paddle) {
	if (this.speedY <= 0) return;
	if (this.y < 100 || this.y > 103) return;
	if (this.x + 8 >= paddle.x && this.x <= paddle.x + paddle.width) {
		this.y = 100;
		this.speedY *= -1;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Ball.prototype.draw = function () {
	this.frame += this.speedY * 0.3;
	if (this.frame < 0) this.frame = 5.9;
	if (this.frame >= 6) this.frame = 0;
	sprite(0x90 + ~~this.frame, this.x, this.y);
};
