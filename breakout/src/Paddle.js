function Paddle() {
	this.x = 0;
	this.y = 108;
	this.width = 30;
	this.height = 5;
}
module.exports = Paddle;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Paddle.prototype.move = function() {
	if (btn.right && this.x + this.width < 128) {
		this.x += 1;
	} else if (btn.left && this.x > 0) {
		this.x -= 1;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Paddle.prototype.draw = function() {
	paper(0);
	rectfill(this.x + 1, this.y + 1, this.width, this.height);
	paper(15);
	rectfill(this.x, this.y, this.width, this.height);
};
