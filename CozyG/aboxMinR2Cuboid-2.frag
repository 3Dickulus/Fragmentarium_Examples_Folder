// Output generated from file: D:/fragmentarium/aboxMinR2Bias-2_Files/AboxMinR2Cuboid.frag
// Created: Sat Jul 29 07:32:30 2017
// Output generated from file: D:/fragmentarium/AboxMinR2MaxR2Cuboid.frag
// Created: Wed Jul 26 04:29:02 2017
#info ABOX_MINR2_BIAS
// Abox made from examples/historical/mandelbox.frag (& other frags)
// http://www.fractalforums.com/amazing-box-amazing-surf-and-variations/generalized-shape-inversion-applied-to-the-mandelbox/msg102850/#new
// MaxR2 is the outer radius and MinR2 is the radius to the cuboid for the point
// If (minR2 > MaxR2) minR2 = MaxR2
#define providesInit
#include "MathUtils.frag"
#include "DE-Raytracer.frag"
#group AboxMinR2Bias

/*
The distance estimator below was originally devised by Buddhi.

See this thread for more info: http://www.fractalforums.com/3d-fractal-generation/a-mandelbox-distance-estimate-formula/15/
*/

// Number of fractal iterations.
uniform int Iterations;  slider[0,60,300]
uniform float Bailout;  slider[0,100,1000]
uniform int ColorIterations;  slider[0,3,300]
uniform vec3 limit; slider[(-5.0,-5.0,-5.0),(1.0,1.0,1.0),(5.0,5.0,5.0)]
uniform float Scale;  slider[-5.0,2.0,5.0]

uniform float MaxR2;  slider[0,1.0,2.0]
uniform bool z2; checkbox[False]
uniform vec3 limitMinR2; slider[(0.0,0.0,0.0),(0.2,0.2,0.2),(2.0,2.0,2.0)]

uniform vec3 c3Mul; slider[(-5.0,-5.0,-5.0),(1.0,1.0,1.0),(5.0,5.0,5.0)]
uniform vec3 cJulia; slider[(-5.0,-5.0,-5.0),(0.0,0.0,0.0),(5.0,5.0,5.0)]

uniform vec3 RotVector; slider[(0,0,0),(1,1,1),(1,1,1)] 
uniform float RotAngle; slider[0.00,0,180]
mat3 rot;

void init() {
	 rot = rotationMatrix3(normalize(RotVector), RotAngle);
}


float DE(vec3 pos)
{
	float Dd = 1.0;	
	vec3 p3 = pos;
	vec3 c3 = pos * c3Mul;	
	float m;
	float r2;
	
	float MinR2;
	vec3 temp3;
	vec3 R2;	

	float minR2 = MinR2;

	for (int i=0; i<Iterations; i++)
	{
		p3 = abs(p3 + limit) - abs(p3 - limit) - p3; //tglad fold

		m = Scale;
		r2 = dot(p3,p3);

		temp3 = abs(p3);
		if (z2) temp3 *= temp3;

		if (temp3.x < limitMinR2.x && temp3.y < limitMinR2.y && temp3.z < limitMinR2.z)
		{
			R2.x =  limitMinR2.x /temp3.x; 
			R2.y =  limitMinR2.y /temp3.y;
			R2.z =  limitMinR2.z /temp3.z;
			float First = min(R2.x, min(R2.y, R2.z));
			minR2 = r2 * First;
			if (minR2 > MaxR2) minR2 = MaxR2; // stop overlapping potential
			m *= MaxR2/minR2;		
		}
		else if ( r2 < MaxR2)
		{
		  m *= MaxR2/r2;
		}	

		p3 *=rot;	

		p3 = p3 * m + cJulia + c3;
		Dd = Dd * abs(m) + 1.0;


		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(p3,r2)));

		r2 = dot(p3, p3);
	 // can remove & bailout using the r2 after tglad fold. Smooths the shape?

	   if ( r2>Bailout)		
		{
		float r = length(p3);
		return r / abs(Dd);
		break;
		}
	}
}








#preset Default
FOV = 0.4
Eye = 0,-8,0
Target = 0,0,0
Up = 1,0,0
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Gamma = 1
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Detail = -3
DetailAO = -1.77779
FudgeFactor = 0.7
MaxRaySteps = 100
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,1
Specular = 0.01987
SpecularExp = 69.118
SpecularMax = 10
SpotLight = 1,1,1,1
SpotLightDir = -0.6386555,0.4789916
CamLight = 1,1,1,0.6171
CamLightMin = 1
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 1
ShadowSoft = 20
Reflection = 0
DebugSun = false
BaseColor = 0.2588235,0.2117647,0.6196078
OrbitStrength = 0.1785714
X = 0.5,0.6,0.6,0.333
Y = 1,0.6,0,0.333
Z = 0.4862745,0.02352941,0.007843137,0.333
R = 0.4,0.7,1,-0.6338028
BackgroundColor = 1,1,1
GradientBackground = 0.3
CycleColors = true
Cycles = 11.80909
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 60
Bailout = 100
ColorIterations = 3
limit = 1,1,1
Scale = -1.5
MaxR2 = 1
z2 = false
c3Mul = 1,1,1
cJulia = 0,0,0
RotVector = 1,0,0
RotAngle = 0
limitMinR2 = 0.2,0.4,0.4
#endpreset

