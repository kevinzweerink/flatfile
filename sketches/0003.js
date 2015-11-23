function sketch_0003() {
	this.meta = {
		title : "Conway's Game of Life",
		displayDate : '2015.11.22',
		id : '0003'
	}

	this.el = document.getElementById(this.meta.id);
	this.w = window.innerWidth;
	this.h = window.innerHeight;
	this.cx = window.innerWidth/2;
	this.cy = window.innerHeight/2;
	this.TAU = Math.PI * 2;
	this.el.width = this.w;
	this.el.height = this.h;
	this.ctx = this.el.getContext('2d');

	this.throttle = 3;
	this.ticks = 0;

	this.cells = [];

	this.resolutionX = 100;
	this.resolutionY = Math.floor((this.h / this.w) * this.resolutionX);

	this.unit = this.w/this.resolutionX;

	this.createGrid = function () {
		var x = 0,
				y = 0,
				i = 0;
		while (y < this.resolutionY) {
			x = 0;
			while (x < this.resolutionX) {
				this.cells.push({
					x : x,
					y : y,
					i : i,
					live : false
				})
				i++;
				x++;
			}
			y++
		}
	}

	this.getCell = function (x, y) {
		if (x < 0 || y < 0 || x >= this.resolutionX || y >= this.resolutionY) {
			return {
				live : false,
				i : -1
			}
		}

		var index = (y * this.resolutionX) + x;
		return this.cells[index];
	}

	this.northwest = function(cell) {
		return this.getCell(cell.x-1, cell.y-1);
	}

	this.north = function (cell) {
		return this.getCell(cell.x, cell.y-1);
	}

	this.northeast = function (cell) {
		return this.getCell(cell.x+1, cell.y-1);
	}

	this.west = function (cell) {
		return this.getCell(cell.x-1, cell.y);
	}

	this.east = function (cell) {
		return this.getCell(cell.x+1, cell.y);
	}

	this.southwest = function (cell) {
		return this.getCell(cell.x-1, cell.y+1);
	}

	this.south = function (cell) {
		return this.getCell(cell.x, cell.y+1);
	}

	this.southeast = function (cell) {
		return this.getCell(cell.x+1, cell.y+1);
	}

	this.pollNeighbors = function(cell) {
		// Returns number alive
		var numAlive = 0;

		if (this.northwest(cell).live) numAlive++;
		if (this.north(cell).live) numAlive++;
		if (this.northeast(cell).live) numAlive++;
		if (this.west(cell).live) numAlive++;
		if (this.east(cell).live) numAlive++;
		if (this.southwest(cell).live) numAlive++;
		if (this.south(cell).live) numAlive++;
		if (this.southeast(cell).live) numAlive++;

		return numAlive;
	}

	this.seed = function () {
		var numToSeed = Math.floor(Math.random() * (this.cells.length/2));
		var cellsAnalog = this.cells.map(function (c) {
			return c.i;
		});

		for (var i = 0; i < this.cells.length; ++i) {
			this.cells[i].live = false;
		}
		
		while (numToSeed > 0) {
			var index = Math.floor(Math.random() * cellsAnalog.length);
			this.cells[cellsAnalog[index]].live = true;
			cellsAnalog.splice(index, 1);
			numToSeed--;
		}
	}

	this.advance = function () {
		for (var i = 0; i < this.cells.length; ++i) {
			var cell = this.cells[i];
			var numAlive = this.pollNeighbors(cell);

			if (cell.live && (numAlive < 2 || numAlive > 3)) {
				cell.live = false;
			} else if (!cell.live && numAlive === 3) {
				cell.live = true;
			}
		}
	}

	this.drawScene = function () {
		this.ctx.fillStyle = '#FFF';
		this.ctx.fillRect(0,0,this.w,this.h);
		for (var i = 0; i < this.cells.length; ++i) {
			var cell = this.cells[i];
			if (cell.live) {
				this.ctx.fillStyle = '#333';
			} else {
				this.ctx.fillStyle = '#FFF';
			}
			var x = cell.x * this.unit;
			var y = cell.y * this.unit;
			this.ctx.fillRect(x, y, this.unit, this.unit);
		}
	}

	this.frame = function () {
		if (this.ticks === 0) {
			this.drawScene();
			this.advance();
		} else if (this.ticks > this.throttle) {
			this.ticks = -1;
		}

		this.ticks++;
	}

	this.init = function () {
		this.ticks = 0;
		this.createGrid();
		this.seed();
	}

	console.log(this.w, this.h);

	this.init();
	this.frame();

	this.el.addEventListener('click', this.seed.bind(this));

	return this;
}