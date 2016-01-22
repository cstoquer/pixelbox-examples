var Ball   = require('./Ball');
var Paddle = require('./Paddle');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function MapItem(x, y, sprite) {
	this.x = x;
	this.y = y;
	this.sprite = sprite;
}

MapItem.prototype.draw = function (texture) {
	texture.sprite(this.sprite, this.x * 8, this.y * 8);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Brick(x, y, params, grid) {
	MapItem.call(this, x, y, params.sprite);
	this._nbHit = params.hit || 1;
	this._grid  = grid;
}
inherits(Brick, MapItem);

Brick.prototype.hit = function () {
	if (--(this._nbHit) <= 0) {
		this._grid.removeItem(this.x, this.y);
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Map(w, h) {
	this.width  = 0;
	this.height = 0;
	this.items  = [];
	// TODO add flagMap
	this._texture = new Texture(w * 8, h * 8);

	this._init(w, h);
}

Map.prototype._init = function (w, h) {
	this.width  = w;
	this.height = h;
	this.items  = [];

	for (var x = 0; x < w; x++) {
		this.items.push([]);
		for (var y = 0; y < h; y++) {
			this.items[x][y] = null;
		}
	}
	return this;
};

Map.prototype.addItem = function (x, y, item) {
	this.items[x][y] = item;
	item.draw(this._texture);
};

Map.prototype.removeItem = function (x, y) {
	this.items[x][y] = null;
	this._texture.ctx.clearRect(x * 8, y * 8, 8, 8);
};

Map.prototype.getItem = function (x, y) {
	if (x >= this.width)  return null;
	if (y >= this.height) return null;
	return this.items[x][y];
};

Map.prototype._redraw = function () {
	this._texture.clear();
	for (var x = 0; x < this.width;  x++) {
	for (var y = 0; y < this.height; y++) {
		this.items[x][y] && this.items[x][y].draw(this._texture);
	}}
	this._dirty = false;
};

Map.prototype.draw = function () {
	draw(this._texture); // TODO don't need $screen in next pixelbox version
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Grid(w, h) {
	Map.call(this, w, h);
}
inherits(Grid, Map);

Grid.prototype.checkCollision = function (ball) {
	if (ball.y > this.height * 8) return;
	var x = ~~((ball.x + 4) / 8);
	var y = ~~((ball.y + 4) / 8);
	var sx, sy;
	if (ball.speedX > 0) {
		// bottom
		sx = ~~((ball.x + 8) / 8);
		if (ball.speedY > 0) {
			// right
			sy = ~~((ball.y + 8) / 8);
		} else {
			// left
			sy = ~~(ball.y / 8);
		}
	} else {
		// top
		sx = ~~(ball.x / 8);
		if (ball.speedY > 0) {
			// right
			sy = ~~((ball.y + 8) / 8);
		} else {
			// left
			sy = ~~(ball.y / 8);
		}
	}

	var brick;

	// vertical collision
	brick = this.getItem(sx, y);
	if (brick) {
		brick.hit();
		ball.speedX *= -1;
	}

	// horizontal collision
	brick = this.getItem(x, sy);
	if (brick) {
		brick.hit();
		ball.speedY *= -1;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var grid   = new Grid(16, 8);
var ball   = new Ball();
var paddle = new Paddle();

var level = "A...CBBAABBC...A"
		  + "....CBA..ABC...."
		  + "II..CBBADBBC..II"
		  + "II.CC......CC.II"
		  + "H.CCC.DDDD.CCC.H"
		  + "HH.EE......EE.HH"
		  + "FFFFFFFFFFFFFFFF"
		  + "GGGGGGGGGGGGGGGG";


function setLevelFromString(str) {
	var x = 0;
	var y = 0;

	var brickTypes = {
		A: { sprite: 0x09 },
		B: { sprite: 0x0A },
		C: { sprite: 0x19 },
		D: { sprite: 0x1A },
		E: { sprite: 0x29, hit: 3 },
		F: { sprite: 0x2A, hit: 2 },
		G: { sprite: 0x2B },
		H: { sprite: 0x39 },
		I: { sprite: 0x3B }
	};

	for (var i = 0; i < str.length; i++) {
		var brick = brickTypes[level[i]];

		if (brick) grid.addItem(x, y, new Brick(x, y, brick, grid));

		if (++x >= 16) {
			x = 0;
			y++;
		}
	}
}

setLevelFromString(level);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
	paper(5).cls();

	ball.move();
	paddle.move();

	grid.checkCollision(ball);
	ball.checkPaddle(paddle);

	grid.draw();
	ball.draw();
	paddle.draw();
};
