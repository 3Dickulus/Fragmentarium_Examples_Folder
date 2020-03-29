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
//		z=cAdd(cSqr(cSinh(cSqr(z))), + (Julia ? c2 : c));
		z = cMul(z,z) + (Julia ? c2 : c);
		trap = (z.x - TrapX)*(z.x - TrapX) + (z.y - TrapY)*(z.y - TrapY);
		if (trap < dist1) {
			dist2 = dist1;
			dist1 = trap;
		} else if (trap < dist2) {
			dist2 = trap;
		}
		dist = max(dist,dot(z,z));
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
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = -0.765950383,-0.002296438
Zoom = 0.756143595
EnableTransform = true
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
Julia = false
JuliaX = -0.6
JuliaY = 1.3
TrapX = 0
TrapY = 0
Bailout = 24
Divider = 10
#endpreset

#preset Julia1
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = 0.072974428,-0.014773198
Zoom = 0.831771184
EnableTransform = true
RotateAngle = 0
StretchAngle = 0
StretchAmount = 0
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 70
R = 0.78037905
G = 0.36231884
B = 0.82051283
Julia = true
JuliaX = 0.00071896
JuliaY = -0.00376032
TrapX = 0
TrapY = 0
Bailout = 24
Divider = 0.5706135
#endpreset

#preset nice
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = 0.16416,0.0265285
Zoom = 0.854514
EnableTransform = true
RotateAngle = 0
StretchAngle = 0
StretchAmount = 0
Gamma = 2.2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 1000
R = 0
G = 0.4
B = 0.7
Julia = true
JuliaX = -0.20588
JuliaY = 0.62038076
TrapX = -0.27547584
TrapY = 0.39641664
Bailout = 24
Divider = 0.5706135
#endpreset

#preset BlueBirds
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = -0.000361203,-0.018951969
Zoom = 0.999999904
EnableTransform = true
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
JuliaX = 0.29930072
JuliaY = 0.01958044
TrapX = 0
TrapY = 0
Bailout = 24
Divider = 5.1355205
#endpreset
