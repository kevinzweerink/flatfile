function sketch_0004() {
	// Works with node-brfs to compile shaders
	var fs = require('fs');

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
	this.t = 0;
	this.walker = Math.random() / 3 + 0.6666;

	this.doWebGL = function () {
		var gl = this.ctx;

		gl.clearColor(0,1,1,1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		var vSource = fs.readFileSync('./sketches/includes/0004-shader.vert', 'utf8');
		var vertexShader = gl.createShader(gl.VERTEX_SHADER)
		gl.shaderSource(vertexShader, vSource);
		gl.compileShader(vertexShader)

		var fSource = fs.readFileSync('./sketches/includes/0004-shader.frag', 'utf8');
		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, fSource);
		gl.compileShader(fragmentShader);

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

		this.program.width = gl.getUniformLocation(this.program, 'width');
		this.program.height = gl.getUniformLocation(this.program, 'height');

		gl.uniform1f(this.program.width, this.w);
		gl.uniform1f(this.program.height, this.h);


		gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
	}

	this.transitionWalker = function () {
		var upper = 1;
		var lower = 0.666;
		var increment = 0.005;

		if (this.walker >= upper) {
			var flip = Math.round(Math.random());
			this.walker = flip ? this.walker - increment : this.walker; 
		} else if (this.walker <= lower) {
			var flip = Math.round(Math.random());
			this.walker = flip ? this.walker + increment : this.walker;
		} else {
			var shouldMove = Math.round(Math.random());
			var direction = Math.round(Math.random());
			if (!shouldMove) return;
			this.walker = direction ? this.walker + increment : this.walker - increment;
		}
	}

	this.frame = function () {
		// Once we want to animate do stuff here

		var gl = this.ctx;
		gl.clearColor(0,1,1,1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		this.t++;

		this.transitionWalker();

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
		gl.uniform1f(this.program.time, (Math.sin(this.t / 100) * .25) + .5 );

		gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);

	}

	this.doWebGL();
	this.frame();
	return this;
}