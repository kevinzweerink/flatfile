precision highp float;

uniform float time;
uniform float resolutionX;
uniform float resolutionY;

float rand2d(vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898,78.233) )) * 43758.5453123);
}

float rand(float i) {
	return fract(sin(i) * 43758.5453123);
} 

float noise2d(vec2 st) {
	vec2 i = floor(st);
	vec2 f = fract(st);

	float a = rand2d(i);
	float b = rand2d( i + vec2(1.0, 0.0));
	float c = rand2d( i + vec2(0.0, 1.0));
	float d = rand2d( i + vec2(1.0, 1.0));

	vec2 u = smoothstep(0.0, 1.0, f);

	return mix(a, b, u.x) + 
				 (c - a) * u.y * (1.0 - u.x) + 
				 (d - b) * u.x * u.y; 
}

float fractalNoise(vec2 st) {
	float f = 0.0;
	mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
	f =  0.5000*noise2d( st ); 
	st = m*st;
	f += 0.2500*noise2d( st ); 
	st = m*st;
	f += 0.1250*noise2d( st ); 
	st = m*st;
	f += 0.0625*noise2d( st ); st = m*st;

	return f;
}

float distortedFractalNoise(vec2 st) {
	vec2 q = vec2(fractalNoise(st + vec2(0.0, 0.0)), 
								fractalNoise(st + vec2(7.3, 3.67)) );
	vec2 r = vec2(fractalNoise(st + 4.0*q + vec2(1.7, 8.3)),
								fractalNoise(st + 4.0*q + vec2(sin(time / 5000.0) * 12.52, cos(time / 5000.0) * 5.0432)));
	return fractalNoise(st + 4.0*r);
}

void main() {
	vec2 resolution = vec2(resolutionX, resolutionY);
	vec4 coord = gl_FragCoord;
	vec2 st = coord.xy/resolution.xy;
	float n = distortedFractalNoise(st * 8.0);
	gl_FragColor = vec4(0.1 + n, n, 1.0, 1.0);
}