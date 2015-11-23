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