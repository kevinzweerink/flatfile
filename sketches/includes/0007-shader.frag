precision highp float;

uniform float time;
uniform float resolutionX;
uniform float resolutionY;

float rand_seed = 0.0;

float rand2d(vec2 st) {
	return fract(sin(dot(st.xy, vec2(12.9898,78.233) )) * 43758.5453123);
}

float rand(float i) {
	return fract(sin(i) * 43758.5453123);
} 

float seeded_rand() {
	rand_seed++;
	return rand(rand_seed);
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

vec3 warp(vec2 p, float t) {
	vec2 q = vec2(fractalNoise(p), 
							  fractalNoise(p + vec2(seeded_rand() * 10.0, seeded_rand() * 10.0)));

	vec2 r = vec2(fractalNoise(p + 4.0*q*t + vec2(seeded_rand() * 10.0, seeded_rand() * 10.0)),
								fractalNoise(p + 4.0*q*t + vec2(seeded_rand() * 10.0, seeded_rand() * 10.0)));

	return vec3(fractalNoise(p + 4.0*r), q.x, r.x);
}

vec3 createColor(vec2 p, float t) {
	vec3 components = warp(p, t);
	return vec3(
		components.x * components.y,
		components.x * components.z * (t/4.0 + 1.5),
		components.x * components.z
	);
}

void main() {
	vec2 resolution = vec2(resolutionX, resolutionY);
	vec4 coord = gl_FragCoord;
	vec2 st = (coord.xy/resolution.xy + vec2(1.0, 1.0)) * 3.0;
	float t = cos(time/1000.0);
	gl_FragColor = vec4(createColor(st, t), 1.0);
}