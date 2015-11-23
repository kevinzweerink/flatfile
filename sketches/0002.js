function sketch_0002 () {
	this.meta = {
		title : 'Magnet Puzzle',
		displayDate : '2015.11.22',
		id : '0002'
	}

	this.el = document.getElementById(this.meta.id);
	this.w = window.innerWidth;
	this.h = window.innerHeight;
	this.cx = window.innerWidth/2;
	this.cy = window.innerHeight/2;
	this.TAU = Math.PI * 2;
	this.ticks = 0;
	this.ttl = Math.random() * 1000;

	this.blue = '#333';
	this.red = '#FFF';

	this.el.width = this.w;
	this.el.height = this.h;
	this.ctx = this.el.getContext('2d');

	this.poleRingSize = this.cy - 50;
	this.dials = [];
	this.pole = {
		angle : 0,
		velocity : 0,
		goal : this.TAU * Math.random(),
		x : this.poleRingSize * Math.cos(0) + this.cx,
		y : this.poleRingSize * Math.sin(0) + this.cy
	}

	this.setup = function () {
		var unit = 50,
				x = 0,
				y = 0;
		while (y < this.h) {
			while (x < this.w) {
				this.dials.push({
					x : x,
					y : y,
					angle : Math.random() * this.TAU,
					velocity : 0
				});
				x += unit;
			}
			x=0;
			y += unit;
		}
	}

	this.drawScene = function () {
		for (var i = 0; i < this.dials.length; ++i) {
			var dial = this.dials[i];
			this.ctx.save();

			this.ctx.translate(dial.x, dial.y);
			this.ctx.rotate(dial.angle);
			this.ctx.fillStyle = this.red;
			this.ctx.fillRect(-17,-4,17,8);

			this.ctx.fillStyle = this.blue;
			this.ctx.fillRect(0,-4,17,8);

			this.ctx.restore();
		}
	}

	this.movePole = function () {
		var offset = this.pole.goal - this.pole.angle;
		this.pole.velocity += 0.01 * offset;
		this.pole.velocity *= 0.9;
		this.pole.angle += this.pole.velocity;

		this.pole.x = this.poleRingSize * Math.cos(this.pole.angle) + this.cx;
		this.pole.y = this.poleRingSize * Math.sin(this.pole.angle) + this.cy;
	}

	this.updateDials = function () {
		for (var i = 0; i < this.dials.length; ++i) {
			var dial = this.dials[i];
			var goal = Math.atan2(this.pole.y - dial.y, this.pole.x - dial.x);
			var offset = goal - dial.angle;
			dial.velocity += 0.01 * offset;
			dial.velocity *= 0.95;
			dial.angle += dial.velocity;
		}
	}

	this.update = function () {
		this.movePole();
		this.updateDials();
	}


	this.frame = function () {
		if (this.ticks > this.ttl) {
			this.ttl = Math.random() * 1000;
			this.ticks = 0;
			this.pole.goal = Math.random() * this.TAU;
		}

		this.ctx.fillStyle = '#ddd'
		this.ctx.fillRect(0,0,this.w,this.h);
		this.drawScene();
		this.update();
		this.ticks++;
	}

	this.setup();
	this.frame();
	return this;
}