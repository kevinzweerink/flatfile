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