// Output generated from file: /home/toonfish/Fragmentarium/Examples/2D Systems/Mandelbrot-Cellular.frag
// Created: Sat Mar 21 23:53:35 2020
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

uniform float Bailout; slider[0,4,24]
uniform float Divider; slider[0,35,50]

uniform float Slide; slider[0,4,24]

vec2 c2 = vec2(JuliaX,JuliaY);

vec3 color(vec2 c) {
  vec2 z = Julia ?  c : vec2(0.0,0.0);
  // distance to orbit trap
  float trap = (c.x - TrapX)*(c.x - TrapX) + (c.y - TrapY)*(c.y - TrapY);
  float dist = 0.;
  float dist1 = trap;  // closest distance
  float dist2 = 10000.0*dist1;  // 2nd closest distance

	int i = 0;
	for (i = 0; i < Iterations; i++) {
		//z=cAdd(cSqr(cSinh(cSqr(z))), + (Julia ? c2 : c));
   c.x+=c.x*float(i)/float(Iterations+i);
   c.y+=c.y*float(i)/float(Iterations+i);
		z = cMul(z,z) + (Julia ? c2 : c);
		trap = (z.x - TrapX)*(z.x - TrapX) + (z.y - TrapY)*(z.y - TrapY);
		if (trap < dist1) {
			dist2 = dist1;
			dist1 = trap;
		} else if (trap < dist2) {
			dist2 = trap;
		}
		dist = max(dist,length(z));
		if (dist> Bailout) break;
	}

		float halo = 1.0/sqrt(dist1);  // central halo
		float bounds = dist1/dist2;  // cell boundaries

		float co = halo;
		co = sqrt(co/256.0);
		co *= (bounds * Divider);
		return vec3(	.5+.5*cos(6.2831*co+R),
							.5+.5*cos(6.2831*co+G),
							.5+.5*cos(6.2831*co+B) );

}






#preset Default
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
Center = -0.663432561,-0.004256666
Zoom = 0.869565134
R = 0.7
G = 0.4
B = 0
Julia = false
JuliaX = -0.6
JuliaY = 1.3
TrigIter = 5
TrigLimit = 1.10000000000000009
Iterations = 384
TrapX = 0
TrapY = 0
Bailout = 24
Divider = 8.1342435
Slide = 1.01998368
#endpreset

