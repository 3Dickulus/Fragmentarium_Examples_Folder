// Output generated from file: D:/fragmentarium/aboxMinR2Bias-2_Files/aboxMinR2BiasMod3.frag
// Created: Wed Jul 26 10:47:02 2017
// Output generated from file: D:/fragmentarium/AboxMinR2Bias.frag
// Created: Wed Jul 26 04:29:02 2017
#info ABOX_MINR2_BIAS
// Abox made from examples/historical/mandelbox.frag (& other frags)
// some MinR2 tweaks coded by mclarekin
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
uniform float MinR2;  slider[0,0.25,2.0]
uniform bool enableBias; checkbox[True]
uniform bool absMode; checkbox[True]
uniform vec3 biasScale; slider[(-1.0,-1.0,-1.0),(0.0,0.0,0.0),(1.0,1.0,1.0)]
uniform int StartVaryMinR2;  slider[0,0,300]
uniform int StopVaryMinR2;  slider[0,300,300]
uniform float varyMinR2Scale;  slider[-5.0,0.0,5.0]
uniform float varyMinR2Offset;  slider[-5.0,0.0,5.0]

//float SdmR2 = Scale/MinR2;
uniform vec3 c3Mul; slider[(-5.0,-5.0,-5.0),(1.0,1.0,1.0),(5.0,5.0,5.0)]
uniform vec3 cJulia; slider[(-5.0,-5.0,-5.0),(0.0,0.0,0.0),(5.0,5.0,5.0)]

uniform vec3 RotVector; slider[(0,0,0),(1,1,1),(1,1,1)] 
uniform float RotAngle; slider[0.00,0,180]
mat3 rot;

void init() {
	 rot = rotationMatrix3(normalize(RotVector), RotAngle);
}
//float absScalem1 = abs(Scale - 1.0);
//float AbsScaleRaisedTo1mIters = pow(abs(Scale), float(1-Iterations));


float DE(vec3 pos)
{
	float Dd = 1.0;	
	vec3 p3 = pos;
	vec3 c3 = pos * c3Mul;	
	float m;
	float r2;
	
	float minR2;
	float temp3 = MinR2;
	float lengthP;
	vec3 Zed3;
	
	if (enableBias)
	{ Zed3 = p3;
		lengthP = length(p3);
		if (absMode) Zed3 = abs(Zed3);
		Zed3 *= biasScale;
		temp3 = MinR2 + (Zed3.x + Zed3.y + Zed3.z) / lengthP;
	}

	float actualMinR2 = temp3;

	for (int i=0; i<Iterations; i++)
	{
		p3 = abs(p3 + limit) - abs(p3 - limit) - p3; //tglad fold
		minR2 = temp3;
		m = Scale;
		r2 = dot(p3,p3);

		if ( i >= StartVaryMinR2 && i < StopVaryMinR2)
		{
			actualMinR2 = minR2 + varyMinR2Scale * (abs(actualMinR2) - varyMinR2Offset); 
			minR2 = actualMinR2;
		}
		if ( i >= StopVaryMinR2)
		{
			minR2 = actualMinR2;
		}
	
		if (r2 < minR2) m *= MaxR2 /minR2; //native_divide(MaxR2, MinR2);
		else if (r2 < MaxR2) m *= MaxR2 / r2; //native_divide(MaxR2,r2);

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
Up = 1,-0.0161812,0
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
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,1
Specular = 0.01987
SpecularExp = 69.118
SpecularMax = 10
SpotLight = 1,1,1,1
SpotLightDir = -0.7936,0.5882353
CamLight = 1,1,1,0.6171
CamLightMin = 1
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 1
ShadowSoft = 20
Reflection = 0
DebugSun = false
BaseColor = 0.4745098,0.6470588,0.5294118
OrbitStrength = 0.3928571
X = 0.5,0.6,0.6,0.3
Y = 1,0.6,0,0.3
Z = 0.4862745,0.02352941,0.007843137,0.3
R = 0.4,0.7,1,-0.2042254
BackgroundColor = 1,1,1
GradientBackground = 0.3
CycleColors = false
Cycles = 0.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
MaxRaySteps = 56
Iterations = 60
Bailout = 100
ColorIterations = 3
limit = 1,1,1
Scale = -1.5
MaxR2 = 1
MinR2 = 0.25
enableBias = true
absMode = false
biasScale = 0.1304348,-0.0988142,-0.3280632
StartVaryMinR2 = 0
StopVaryMinR2 = 300
varyMinR2Scale = -0.2995392
varyMinR2Offset = -0.1401869
c3Mul = 0.9,0.9,1
cJulia = 0,0,0
RotVector = 1,0,0
RotAngle = 0
#endpreset

