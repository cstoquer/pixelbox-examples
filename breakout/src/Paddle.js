function Paddle() {
	this.x = 0;
	this.width = 30;
}
module.exports = Paddle;

Paddle.prototype.move = function() {
	if (btn.right) {
		this.x += 1;
	} else if (btn.left) {
		this.x -= 1;
	}
};

Paddle.prototype.draw = function() {
	paper(15);
	rectfill(this.x, 108, this.width, 5);
};
