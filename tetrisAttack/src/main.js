var grid, newLine, cursor, scroll, speed, gameover, gameoverX, gameoverY;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function destroy() {
	var changed = false;
	for (var x = 0; x < grid.width;  x++) {
	for (var y = 0; y < grid.height; y++) {
		var cell = grid.get(x, y);
		if (cell._destroy) {
			grid.set(x, y, 0);
			changed = true;
		}
	}}
	return changed;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function markLineToDestroy(x1, x2, y) {
	while (x1 < x2) {
		var cell = grid.get(x1++, y);
		cell._destroy = true;
		cell._locked  = true;
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function markColumnToDestroy(x, y1, y2) {
	while (y1 < y2) {
		var cell = grid.get(x, y1++);
		cell._destroy = true;
		cell._locked  = true;
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function checkLines() {
	for (var y = 0; y < grid.height; y++) {
		var current = grid.get(0, y);
		current = current && current.tile;
		var start = 0;
		for (var x = 1; x < grid.width; x++) {
			var tile = grid.get(x, y).tile;
			if (tile === current) continue;
			if (current && x - start >= 3) markLineToDestroy(start, x, y); 
			start = x;
			current = tile;
		}
		if (current && x - start >= 3) markLineToDestroy(start, x, y); 
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function checkColumns() {
	for (var x = 0; x < grid.width; x++) {
		var current = grid.get(x, 0);
		current = current && current.tile;
		var start = 0;
		for (var y = 1; y < grid.height; y++) {
			var tile = grid.get(x, y).tile;
			if (tile === current) continue;
			if (current && y - start >= 3) markColumnToDestroy(x, start, y); 
			start = y;
			current = tile;
		}
		if (current && y - start >= 3) markColumnToDestroy(x, start, y); 
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function makeTileFall() {
	var changed = false;
	for (var x = 0; x < grid.width; x++) {
		var lastEmpty = null;
		for (var y = grid.height - 1; y >= 0; y--) {
			var tile = grid.get(x, y).tile;
			if (tile && lastEmpty) {
				grid.set(x, y, 0);
				grid.set(x, lastEmpty, tile);
				changed = true;
				lastEmpty -= 1;
			} else if (!tile && !lastEmpty) {
				lastEmpty = y;
			}
		}
	}
	return changed;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function checkGrid() {
	checkLines();
	checkColumns();
	var changed = destroy();
	changed = makeTileFall() || changed;
	return changed;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function checkRecurse() {
	if (checkGrid()) checkRecurse();
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function switchTiles(cursor) {
	var x = cursor.x;
	var y = cursor.y;

	// get the two cells to be switched
	var cellA = grid.get(x,     y);
	var cellB = grid.get(x + 1, y);

	// if both cells are the same (or empty), do nothing
	if (cellA.tile === cellB.tile) return;

	// check that one cell is not locked
	if (cellA._locked || cellB._locked) return;

	// switch first cell
	grid.set(x, y, cellB.tile);

	// switch the other cell
	grid.set(x + 1, y, cellA.tile);

	// check combos
	checkRecurse();
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function addNewLine() {
	// check line at the top => GAME OVER
	for (var x = 0; x < grid.width; x++) {
		if (grid.get(x, 0).tile) gameover = true;
	}
	if (gameover) return;

	// shift the grid up
	grid.paste(grid, 0, -1);
	scroll -= 16;

	// copy new line at the bottom and generate another random new line
	var y = grid.height - 1;
	for (var x = 0; x < grid.width; x++) {
		var tile = newLine.get(x, 0).tile - 64;
		grid.set(x, y, tile);
		newLine.set(x, 0, random(5) + 65);
	}

	// shift cursor with the grid
	if (cursor.y > 0) cursor.y -= 1;

	// check if combo occurs with the new line appearing
	checkRecurse();
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function gameoverAnimation() {
	if (gameoverY > grid.height) {
		// check for button press and restart game
		if (btnp.A) startGame();
		return;
	}

	// animation
	if (gameoverY === grid.height) {
		var tile = newLine.get(gameoverX, 0).tile;
		newLine.set(gameoverX, 0, tile + 16);
	} else {
		var tile = grid.get(gameoverX, gameoverY).tile;
		if (tile) grid.set(gameoverX, gameoverY, tile + 80);
	}

	// TODO: screen shake

	// rendering
	cls();
	draw(grid, 0, -scroll);
	draw(newLine, 0, 11 * 16 - scroll);

	// increment
	gameoverX += 1;
	if (gameoverX >= grid.width) {
		gameoverX = 0;
		gameoverY += 1;
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function startGame() {
	camera(0, -16);
	grid      = getMap('test1').copy(); // TODO: randomize
	newLine   = getMap('newLine').copy(); // TODO: randomize
	cursor    = { x: 2, y: 7 };
	scroll    = 0;
	speed     = 0.05;
	gameover  = false;
	gameoverX = 0;
	gameoverY = 0;
	// first check before start
	checkRecurse();
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
startGame();

// Update is called once per frame
exports.update = function () {
	// gameover
	if (gameover) return gameoverAnimation();

	// timer & scroll
	scroll += speed;
	if (scroll >= 16) addNewLine();

	// rendering
	cls();
	draw(grid, 0, -scroll);
	draw(newLine, 0, 11 * 16 - scroll);
	draw(assets.cursor, cursor.x * 16 - 2, cursor.y * 16 - 2 - scroll);

	// controls
	if (btnp.A) switchTiles(cursor);
	if (btnp.left  && cursor.x > 0)               cursor.x -= 1;
	if (btnp.right && cursor.x < grid.width  - 2) cursor.x += 1;
	if (btnp.up    && cursor.y > 0)               cursor.y -= 1;
	if (btnp.down  && cursor.y < grid.height - 1) cursor.y += 1;
};
