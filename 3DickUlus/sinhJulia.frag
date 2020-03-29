// Output generated from file: /home/toonfish/Fragmentarium/Examples/2D Systems/Mandelbrot-Cellular.frag
// Created: Wed Mar 4 21:06:40 2020
#include "MathUtils.frag"
#include "Complex.frag"
#include "Progressive2D.frag"

#info Mandelbrot Cellular Coloring
#info https://fractalforums.org/programming/11/cellular-coloring-of-mandelbrot-insides/3264
#info https://fractalforums.org/share-a-fractal/22/cellular-coloring-showcase/3346/

#group Mandelbrot

// Number of iterations
uniform int  Iterations; slider[1,200,10000]

uniform float R; slider[0,0,1]
uniform float G; slider[0,0.4,1]
uniform float B; slider[0,0.7,1]

uniform bool Julia; checkbox[false]
uniform float JuliaX; slider[-2,-0.6,2]
uniform float JuliaY; slider[-2,1.3,2]

uniform float TrapX; slider[-6,-0.6,6]
uniform float TrapY; slider[-6,1.3,6]

uniform float Divider; slider[0,35,50]

vec2 c2 = vec2(JuliaX,JuliaY);

vec2 complexMul(vec2 a, vec2 b) {
	return vec2( a.x*b.x -  a.y*b.y,a.x*b.y + a.y * b.x);
}

vec3 color(vec2 c) {
  vec2 z = Julia ?  c : vec2(0.0,0.0);
  // distance to orbit trap
  float trap = (c.x - TrapX)*(c.x - TrapX) + (c.y - TrapY)*(c.y - TrapY);
  float dist1 = trap;  // closest distance
  float dist2 = 10000.0*dist1;  // 2nd closest distance

	int i = 0;
	for (i = 0; i < Iterations; i++) {
		z=cAdd(cSqr(cSinh(cSqr(z))), + (Julia ? c2 : c));
//		z = complexMul(z,z) + (Julia ? c2 : c);
		trap = (z.x - TrapX)*(z.x - TrapX) + (z.y - TrapY)*(z.y - TrapY);
		if (trap < dist1) {
			dist2 = dist1;
			dist1 = trap;
		} else if (trap < dist2) {
			dist2 = trap;
		}
		if(dot(z,z) >24.) break;
	}

		float halo = 1.0/(sqrt(dist1) + 1.0);  // central halo
		float bounds = dist1/dist2;  // cell boundaries
		bounds += halo;

		float co = halo;
		co = sqrt(co/256.0);
		co *= (bounds * Divider);
		return vec3(	.5+.5*cos(6.2831*co+R),
							.5+.5*cos(6.2831*co+G),
							.5+.5*cos(6.2831*co+B) );

}







#preset Default
Center = -0.018226757,-0.002533861
Zoom = 0.955076498
EnableTransform = false
RotateAngle = 90
StretchAngle = 0
StretchAmount = 0
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 1.5
AAExp = 1
GaussianAA = true
Iterations = 1000
R = 0.7
G = 0.4
B = 0
Julia = true
JuliaX = 0.65734268
JuliaY = 0.5738322
TrapX = 0
TrapY = 0
Divider = 22.039943
TrigIter = 5
TrigLimit = 1.10000000000000009
#endpreset

