// Output generated from file: /home/toonfish/Fragmentarium/ActPack-2/JuliaMand.frag
// Created: Sat Mar 7 02:31:01 2020
#include "MathUtils.frag"
#include "Complex.frag"
#include "Progressive2D.frag"
#info JulMan

#group JulMan

// Number of iterations
uniform int  Iterations; slider[10,200,1000]

uniform float R; slider[0,0,1]
uniform float G; slider[0,0.4,1]
uniform float B; slider[0,0.7,1]
uniform float Bailout; slider[0,6,384]
uniform float ColDiv; slider[1,256,384]

uniform vec2 CC; slider[(-2,-2),(0,0),(2,2)]
uniform vec2 Trap; slider[(-6,-6),(-0.6,1.3),(6,6)]

// Scale color function
uniform float Multiplier; slider[-10,0,10]
uniform float Divider; slider[0,35,50]
uniform float StripeDensity; slider[-10,1,10]
uniform float EscapeRadius2; slider[0,1000,100000]

vec3 color(vec2 c) {

	float dist = 0.;
	vec2 z = c;
	int i = 0;
	float count = 0.0;
	float avg = 0.0; // our average
	float lastAdded = 0.0;
	float z2 = 0.0; // last squared length
  // distance to orbit trap
  float trap = (c.x - Trap.x)*(c.x - Trap.x) + (c.y - Trap.y)*(c.y - Trap.y);
  float dist1 = trap;  // closest distance
  float dist2 = 10000.0*dist1;  // 2nd closest distance

	for (i = 0; i < Iterations; i++) {
		z = cSqr(z) + CC;
		z = cSqr(z) + c;
		trap = (z.x - Trap.x)*(z.x - Trap.x) + (z.y - Trap.y)*(z.y - Trap.y);
		if (trap < dist1) {
			dist2 = dist1;
			dist1 = trap;
		} else if (trap < dist2) {
			dist2 = trap;
		}
		count++;	
		lastAdded = 0.5+0.5*sin(StripeDensity*atan(z.y,z.x));		
		avg +=  lastAdded;
		z2 = dot(z,z);
		if (z2 > EscapeRadius2) break;
//		dist = max(dist,z2);
//		if (dist> Bailout) break;
	}

	float prevAvg = (avg -lastAdded)/(count-1.0);
	avg = avg/count;
	float frac =1.+(log2(log(EscapeRadius2)/log(z2)));	
	float mix = (1.0+frac)*avg+(1.0-frac)*prevAvg;
	if (i < Iterations && mix == mix) { // NaN check
		float co = mix*pow(10.0,Multiplier);
		co = clamp(co,0.0,10000.0);
		return vec3( .5+.5*cos(6.2831*co+R),.5+.5*cos(6.2831*co + G),.5+.5*cos(6.2831*co +B) );		
	} else {		
		float halo = 1.0/(sqrt(dist1) + 1.0);  // central halo
		float bounds = dist1/dist2;  // cell boundaries

		float co = halo;
		co = sqrt(co/256.0);
		co *= (bounds * Divider);
		return vec3(	.5+.5*cos(6.2831*co+R),
							.5+.5*cos(6.2831*co+G),
							.5+.5*cos(6.2831*co+B) );
	}	
		return vec3(0.0);		

}





#preset Default
Gamma = 2.08335
Brightness = 1
Contrast = 1
Saturation = 1
TrigIter = 5
TrigLimit = 1.10000000000000009
Center = 0.548636895,0.815820563
Zoom = 352.425384
EnableTransform = true
RotateAngle = -30
StretchAngle = 0
StretchAmount = 0
ToneMapping = 3
Exposure = 0.9940005
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 200
R = 0
G = 0.4
B = 0.7
Bailout = 19.62044
ColDiv = 384
CC = 0.57735,-1
Multiplier = 0.4656376
StripeDensity = -2
EscapeRadius2 = 100000
Divider = 50
Trap = 0.76880232,1.1866296
CC1:CosineCurve:44:1.0:-1.0:1:250:0.3:1:1.7:1:0
CC2:SineCurve:43:-1.0:1.0:1:250:0.3:1:1.7:1:0
#endpreset

