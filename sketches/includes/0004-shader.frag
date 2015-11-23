precision highp float;

uniform float time;
uniform float width;
uniform float height;
float rand_seed = 1.0;
float cx = width / 2.0;
float cy = height / 2.0;

float distBetween(vec2 a, vec2 b) {
	float ox = a.x - b.x;
	float oy = a.y - b.y;
	return sqrt((ox * ox) + (oy * oy));
}

float seeded_rand(float n) {
	return fract(sin(n) * 43758.5453123);
}

float rand() {
	rand_seed += 1.0;
	return fract(sin(rand_seed) * 43758.5453123);
}

void main() {
	vec4 coord = gl_FragCoord;
	float distFromCenter = distBetween( coord.xy, vec2(cx, cy) );
	float relativeDist = cos(distFromCenter / 10.0) / 2.0 + 2.0;
	gl_FragColor = vec4((time/2.0 + 0.75) * (relativeDist * (coord.x / width)), (time/2.0 + 0.75) * (relativeDist * (coord.y / height)), time + 0.5, (seeded_rand(distFromCenter) / 10.0) + 0.9 );
}