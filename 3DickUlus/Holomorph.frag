
#include "MathUtils.frag"
#include "Complex.frag"
#include "Progressive2D.frag"
#info Holomorphic Mandelbrot extensions
#info https://fractalforums.org/fractal-mathematics-and-new-theories/28/holomorphic-mandelbrot-extensions/1475
#info Mandelbrot foam math
#info https://fractalforums.org/fractal-mathematics-and-new-theories/28/mandelbrot-foam-math/1665

#group Holomorph

// Number of iterations
uniform int  Iterations; slider[10,200,10000]

uniform vec3 RGB; color[0.0,0.4,0.7]
uniform float Escape; slider[0,6,16384]
uniform float ColDiv; slider[1,256,384]

uniform vec2 P; slider[(-2,-2),(1,0),(2,2)]
uniform vec2 Q; slider[(-2,-2),(-1,0),(2,2)]

uniform bool Foam; checkbox[false]

uniform bool absX; checkbox[false]
uniform bool absY; checkbox[false]
// applies ABS(X|Y) to Z
uniform bool toZ; checkbox[false]
// applies ABS(X|Y) to W
uniform bool toW; checkbox[false]

vec3 color(vec2 c) {

	float dist = 0.;
	
	float Escape2 = Escape * Escape;

	vec2 z = sqrt( cMul(-P,Q) * 0.25);
	vec2 w = -z;
	
	int i = 0;
	for (i = 0; i < Iterations; i++) {

		if(toZ){
			if(absX) z.x = abs(z.x);
			if(absY) z.y = -abs(z.y);
		}
		if(toW){
			if(absX) w.x = abs(w.x);
			if(absY) w.y = -abs(w.y);
		}

		vec2 t = z;
		z = cSqr(z) + cMul(P,w) + c;
		if(Foam) {
			// https://fractalforums.org/fractal-mathematics-and-new-theories/28/mandelbrot-foam-math/1665
			w = cDiv(cMul(Q,w),z) + c;
		}
		else {
			// https://fractalforums.org/fractal-mathematics-and-new-theories/28/holomorphic-mandelbrot-extensions/1475
			w = cSqr(w) + cMul(Q,t) + c;
		}
		dist = max(max(dist,dot(z,z)),max(dist,dot(w,w)));

		if (dist > Escape2) break;
	}

	if (i < Iterations) {
		// The color scheme here is based on one
		// from Inigo Quilez's Shader Toy:
		float co =  float(i) + 1. - log2(.5*log2(dist));
		co = 6.2831*sqrt(co/ColDiv);
		return 1.-(.5+.5*cos(co+RGB) );
	}  else {
		return vec3(0.0);
	}
}


#preset Default
Gamma = 2.08335
Brightness = 1
Contrast = 1
Saturation = 1
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = -0.517782748,0.03000325
Zoom = 0.561856823
ToneMapping = 3
Exposure = 0.6522
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 200
RGB = 0,0.4,0.7
Escape = 6
ColDiv = 64
P = 0,0
Q = 0,0
absX = false
absY = false
toZ = false
toW = false
Foam = false
#endpreset

#preset Reply1
Gamma = 2.08335
Brightness = 1
Contrast = 1
Saturation = 1
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = -0.044005167,0.001865563
Zoom = 13.9854353
ToneMapping = 3
Exposure = 0.6522
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 2413
RGB = 0,0.4,0.7
Escape = 6
ColDiv = 256
P = -1,0
Q = 1,0
absX = false
absY = false
toZ = false
toW = false
Foam = false
#endpreset

#preset FoamBrot
Gamma = 2.08335
Brightness = 1
Contrast = 1
Saturation = 1
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = -0.657734454,-0.028889388
Zoom = 0.646135356
ToneMapping = 3
Exposure = 0.6522
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 200
ColDiv = 48
P = 0.005,0
Q = -0.51,0
Foam = true
absX = false
absY = false
toZ = false
toW = false
Escape = 16384
RGB = 0,0.4,0.7
#endpreset

#preset WeleaseDaQuacken
Gamma = 2.08335
Brightness = 1
Contrast = 1
Saturation = 1
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = -0.424886316,0.018265996
Zoom = 0.488571157
ToneMapping = 3
Exposure = 0.6522
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 200
RGB = 0,0.400000006,0.699999988
Escape = 16384
ColDiv = 48
P = 0.005194806,4e-9
Q = -0.534550194,-0.002607562
Foam = true
absX = false
absY = true
toZ = true
toW = false
#endpreset
