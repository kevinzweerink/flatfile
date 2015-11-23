 function sketch_0001 () {
	this.meta = {
		id: '0001',
		displayDate : '2015.11.20',
		title : 'Tracing of the Presignifying Semiotic'
	}

	this.el = document.getElementById(this.meta.id);
	this.w = window.innerWidth;
	this.h = window.innerHeight;
	this.cx = window.innerWidth/2;
	this.cy = window.innerHeight/2;

	this.el.width = this.w;
	this.el.height = this.h;

	this.ctx = this.el.getContext('2d');
	this.particles = [];
	this.TAU = Math.PI * 2;

	this.notInTransitColor = [250,169,125];
	this.inTransitColor = [191,75,52];

	this.lerp = function (a, b, theta) {
		return a + ((b-a) * theta)
	}

	this.lerpArray = function (a, b, theta) {
		var _this = this;
		return a.map(function (n, i) {
			return _this.lerp(n, b[i], theta);
		})
	}

	this.radiusForValence = function (v) {
		return ((this.cy - 100) / this.numLevels) * v;
	}

	this.positionForRadiusAndAngle = function (r, a) {
		return {
			x : this.cx + r * Math.cos(a),
			y : this.cy + r * Math.sin(a)
		};
	}

	this.particle = function () {
		var valence = Math.ceil(Math.random() * this.numLevels);
		var r = this.radiusForValence(valence);
		var velocity = ((Math.random() * .005) + 0.003) * (Math.random() > 0.5 ? 1 : -1);
		var theta = Math.random() * this.TAU;
		var position = this.positionForRadiusAndAngle(r, theta);
		return {
			valence : valence,
			goalValence : valence,
			r : r,
			theta : theta,
			velocity : velocity,
			angularVelocity : 0,
			x : position.x,
			y : position.y,
			inTransit : false,
			tail : [],
			alpha : 0
		}
	}

	this.init = function () {
		this.particles = [];
		this.numLevels = Math.ceil(Math.random() * 3) * 4;
		this.numParticles = Math.ceil(Math.random() * 30) + 100;
		for (var i = 0; i < this.numParticles; ++i) {
			this.particles.push(this.particle());
		}

		this.setup();
		this.frame();
	}

	this.setup = function () {
		this.ctx.fillStyle = '#FAF87D';
		this.ctx.fillRect(0,0,this.w,this.h);
	}

	this.drawScene = function () {
		for (var i = 0; i < this.particles.length; ++i) {
			var p = this.particles[i];
			this.ctx.strokeStyle = '#FAA97D'
			this.ctx.beginPath();
			for (var j = 0; j < p.tail.length; ++j) {
				var pos = p.tail[j];
				this.ctx.lineTo(pos[0], pos[1]);
			}
			this.ctx.stroke();
		}

		for (var i = 0; i < this.particles.length; ++i) {
			var p = this.particles[i];
			
			if (p.inTransit) {
				this.ctx.strokeStyle = 'rgba(90,119,250,' + p.alpha + ')';
				this.ctx.beginPath();
				this.ctx.moveTo(p.x, p.y);
				this.ctx.lineTo(this.particles[p.partner].x, this.particles[p.partner].y);
				this.ctx.stroke();
			}

			var color = this.lerpArray(this.notInTransitColor, this.inTransitColor, p.alpha);
			this.ctx.fillStyle = 'rgba(' + Math.round(color[0]) + ',' + Math.round(color[1]) + ',' + Math.round(color[2]) + ',1)';

			this.ctx.beginPath();
			this.ctx.arc(p.x, p.y, 3, 0, this.TAU, false);
			this.ctx.fill();
		}
	}

	this.checkForJumps = function (p, i) {
		if (p.inTransit) return;
		for (var j = 0; j < this.particles.length; ++j) {

			if (j === i) continue;
			var pb = this.particles[j];
			if (pb.inTransit) continue;
			if (pb.goalValence === p.goalValence) continue;
			if (Math.abs(pb.theta - p.theta) > 0.001) continue;

			p.inTransit = true;
			pb.inTransit = true;

			var va = p.goalValence;
			var vb = pb.goalValence;

			p.goalValence = vb;
			pb.goalValence = va;

			p.partner = j;
			pb.partner = i;

			p.alpha = 1;
			pb.alpha = 1;
			break;

		}
	}


	this.frame = function () {
		var _this = this;

		this.setup();
		this.drawScene();

		this.particles.forEach(function (p, i) {
			p.theta += p.velocity;
			var newPos = _this.positionForRadiusAndAngle(p.r, p.theta);
			p.x = newPos.x;
			p.y = newPos.y;
			p.tail.push([p.x, p.y]);

			if (p.inTransit && Math.abs(p.goalValence - p.valence) > .001) {
				var dif = p.goalValence - p.valence;
				var d = (0.01 * dif);
				p.angularVelocity += d;
			} else {
				if (Math.abs(p.angularVelocity) < 0.001) {
					p.inTransit = false;
					p.valence = p.goalValence;
				}
			}

			if (p.tail.length > 200) {
				p.tail.splice(0, p.tail.length - 200);
			}

			p.angularVelocity *= .98;
			p.valence += p.angularVelocity;
			p.r = _this.radiusForValence(p.valence);
			
			if (p.alpha > 0) {
				p.alpha -= 0.01;
			}

			_this.checkForJumps(p, i);
		})
	}

	this.el.addEventListener('click', this.init.bind(this));
	this.init();
	return this;
}
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

	this.throttle = 1;
	this.ticks = 0;

	this.cells = [];

	this.resolutionX = 200;
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
		var numToSeed = Math.floor(Math.random() * (this.cells.length/10));
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
function sketch_0004() {
	this.meta = {
		title : 'Shader Test',
		displayDate : '2015.11.23',
		id : '0004'
	}

	this.el = document.getElementById(this.meta.id);
	this.w = window.innerWidth;
	this.h = window.innerHeight;
	this.cx = window.innerWidth/2;
	this.cy = window.innerHeight/2;
	this.TAU = Math.PI * 2;
	this.el.width = this.w;
	this.el.height = this.h;
	this.ctx = this.el.getContext('webgl');

	this.doWebGL = function () {
		var gl = this.ctx;

		gl.clearColor(0,1,1,1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		var vertexShader = gl.createShader(gl.VERTEX_SHADER)
		gl.shaderSource(vertexShader, [
		  'attribute vec2 position;',
		  'void main() {',
		    'gl_Position = vec4(position, 0.0, 1.0);',
		  '}'
		].join('\n'))
		gl.compileShader(vertexShader)

		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
		gl.shaderSource(fragmentShader, [
		  'precision highp float;',
		  'uniform float time;',
		  'void main() {',
		  	'vec4 coord = gl_FragCoord;',
	    	'gl_FragColor = vec4(coord.x / 1280.0, coord.y / 700.0, time + 0.5, 1.0);',
		  '}'
		].join('\n'))
		gl.compileShader(fragmentShader)

		this.program = gl.createProgram();
		gl.attachShader(this.program, vertexShader);
		gl.attachShader(this.program, fragmentShader);
		gl.linkProgram(this.program);

		var vertices = new Float32Array([
			-0.4, -0.5,
			0.4, -0.5,
			0.0, 0.5
		]);

		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		gl.useProgram(this.program);

		this.program.position = gl.getAttribLocation(this.program, 'position');
		gl.enableVertexAttribArray(this.program.position);
		gl.vertexAttribPointer(this.program.position, 2, gl.FLOAT, false, 0, 0);

		this.program.time = gl.getUniformLocation(this.program, 'time');

		gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
	}

	this.frame = function () {
		// Once we want to animate do stuff here

		var gl = this.ctx;
		gl.clearColor(0,1,1,1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		var t = (Math.sin(new Date().getTime() / 1000) / 4) + 0.25;

		var vertices = new Float32Array([
			-1, -1,
			1, -1,
			-1, 1,
			1, 1,
			1, -1,
			-1, 1
		]);

		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		gl.useProgram(this.program);

		this.program.position = gl.getAttribLocation(this.program, 'position');
		gl.enableVertexAttribArray(this.program.position);
		gl.vertexAttribPointer(this.program.position, 2, gl.FLOAT, false, 0, 0);

		gl.uniform1f(this.program.time, t);

		gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);

	}

	this.doWebGL();
	return this;
}
var manifest = ['0001', '0002', '0003', '0004'];

function Blog(postIds, container) {
	this.postIds = postIds;
	this.container = document.querySelector(container);
	this.gatherTemplates();
}

Blog.prototype.gatherTemplates = function () {
	var tmp = this.container.querySelectorAll('.template');
	this.templates = {};
	for (var i = 0; i < tmp.length; ++i) {
		var t = tmp[i];
		t.classList.remove('template');
		this.templates[t.getAttribute('class')] = t.cloneNode(true);
		t.parentNode.removeChild(t);
	}
}

Blog.prototype.render = function () {
	var _this = this;
	this.postVisualizations = this.postIds.map(function(id) {
		var post = _this.templates['item'].cloneNode(true);
		_this.container.insertBefore(post, _this.container.firstChild);

		var canvas = post.querySelector('canvas');
		canvas.setAttribute('id', id);
		var vis = new window['sketch_' + id]();
		post.querySelector('h1').innerHTML = vis.meta.title;
		post.querySelector('h2').innerHTML = vis.meta.displayDate;

		return vis;
	});

	console.log(this.postVisualizations);

	this.logItemHeight();
}

Blog.prototype.logItemHeight = function () {
	var el = this.container.querySelector('.item');
	var baseHeight = el.offsetHeight;
	var styles = window.getComputedStyle(el);
	var top = parseFloat(styles['marginTop']);
	var bottom = parseFloat(styles['marginBottom']);

	this.itemHeight = baseHeight + top + bottom;
}

Blog.prototype.frame = function () {
	var index = (this.postVisualizations.length -1) - Math.round(document.body.scrollTop / this.itemHeight);
	this.postVisualizations[index].frame();
	window.requestAnimationFrame(this.frame.bind(this));
	// window.addEventListener('click', this.frame.bind(this));
}

var b = new Blog(manifest, '.bloggle');
b.render();
b.frame();