function sketch_0007() {
	this.meta = {
		title : 'Perlin Variation 2',
		displayDate : '2015.11.24',
		id : '0007'
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

	this.vertices = new Float32Array([
		-1, -1,
		1, -1,
		-1, 1,
		1, 1,
		1, -1,
		-1, 1
	]);

	this.setupGL = function () {
		var gl = this.ctx;

		var vSource = fs.readFileSync('./sketches/includes/0007-shader.vert', 'utf8');
		var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, vSource);
		gl.compileShader(vertexShader);

		var fSource = fs.readFileSync('./sketches/includes/0007-shader.frag', 'utf8');
		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, fSource);
		gl.compileShader(fragmentShader);

		this.program = gl.createProgram();
		gl.attachShader(this.program, vertexShader);
		gl.attachShader(this.program, fragmentShader);
		gl.linkProgram(this.program);

		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

		this.program.position = gl.getAttribLocation(this.program, 'position');
		gl.enableVertexAttribArray(this.program.position);
		gl.vertexAttribPointer(this.program.position, 2, gl.FLOAT, false, 0, 0);

		this.program.time = gl.getUniformLocation(this.program, 'time');

		this.program.resolutionX = gl.getUniformLocation(this.program, 'resolutionX');
		this.program.resolutionY = gl.getUniformLocation(this.program, 'resolutionY');

		gl.useProgram(this.program);

		gl.uniform1f(this.program.resolutionX, this.w);
		gl.uniform1f(this.program.resolutionY, this.h);
	}

	this.frame = function () {
		if (this.t) {
			this.t++
		} else {
			this.t = 1;
		}

		var gl = this.ctx;

		gl.clearColor(0.9,0.9,0.9,1);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.uniform1f(this.program.time, this.t);
		gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 2)
	}

	this.setupGL();
	this.frame();

	return this;

}