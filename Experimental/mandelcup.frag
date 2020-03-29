#version 400 compatibility
/* A Mandelcup fractal by Pupukuusikko
 
Result of random tinkering with Tglad's Tetrahedral and Dihedral fold fractals,
introduced in http://www.fractalforums.com/the-3d-mandleblulb/2d-conformal-formula-suggestion/

Script is based on Knighty's tetrahedral implementation with Tglad's DE addition from the same source

*/

#info Mandelbulb Distance Estimator
#define providesInit
#include "MathUtils.frag"
#include "DE-Kn2.frag"
#group MandelCup


// Number of fractal iterations.
uniform int Iterations;  slider[0,9,100]

// Number of color iterations.
uniform int ColorIterations;  slider[0,9,100]

 
// adjustable parameters, 
uniform float c1; slider[-10,0,10]
uniform float c2; slider[-10,2,10]
//uniform float c3; slider[-2,2,10]


uniform float Bailout; slider[0,5,10]

// just changed sign of the DE
uniform bool InsideDE; checkbox[false]
// for fine tuning the DE
uniform float DEtuner;slider[0,0.5,2]

uniform bool Julia; checkbox[false]
uniform vec3 JuliaC; slider[(-2,-2,-2),(0,0,0),(2,2,2)]

// abs and rotation included for  fun
uniform bool absX; checkbox[false]
uniform bool absY; checkbox[false]
uniform bool absZ; checkbox[false]

uniform vec3 RotVector; slider[(0,0,0),(1,1,1),(1,1,1)]
uniform float RotAngle; slider[0.00,0,180]

mat3 rot;
uniform float time;
void init() {
	 rot = rotationMatrix3(normalize(RotVector), RotAngle+time*10.0);
}

#define complexMult(a,b) vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x)
#define complexMag(z) dot(z,z)
#define complexReciprocal(z) (vec2(z.x , -z.y)/ complexMag(z))
#define complexDivision(a,b) complexMult(a, complexReciprocal(b))




void dihed2(inout vec3 p) {
	
	//modifiying p.z is probably optional 
	// p.z = p.z*p.z;
	
	//c1 default zero, adjusting is nice for julias 
	vec2 z = complexDivision(p.xy,vec2(p.z,c1));
		
	// repeat for higher powers
	z = complexMult(z,z)*c2;

	// from knighty's tetrahedral frag
	p=vec3(2.*z.x, 2.*z.y, dot(z,z)-1.)/(dot(z,z)+1.);
		
}

float DE(vec3 pos) {
	vec3 z=pos;
	float r;
	float dr=1.0;
	int i=0;
	r=length(z);
	
	
	while(r<Bailout && (i<Iterations)) {
		
		z=z / r ;
		dr = r*2.*dr+1.;
		
		dihed2(z);
		z*=rot;
		z*=r*r;
		
		if (absX) z.x= abs(z.x);
		if (absY) z.y= abs(z.y);
		if (absZ) z.z= abs(z.z);
		
		z+=(Julia ? JuliaC : pos);
	
		r=length(z);
		if (i<ColorIterations) orbitTrap = min(orbitTrap,(abs(vec4(z.x,z.y,z.z,r*r))));
		i++;
	}

	if (InsideDE)
		return -(DEtuner*log(r)*r/dr);
	
	return  DEtuner*log(r)*r/dr;

	
	
}

#preset Default
FOV = 1
Eye = 0.123987,0.0972892,-2.16996
Target = -3.86917,-0.348189,7.04045
FocalPlane = 0.14055
Aperture = 0
InFocusAWidth = 0
ApertureNbrSides = 5
ApertureRot = 0
ApStarShaped = false
Gamma = 2
ToneMapping = 3
Exposure = 0.72882
Brightness = 2.093
Contrast = 1.00885
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Bloom = false
BloomIntensity = 0.25
BloomPow = 2
BloomTaps = 4
Detail = -3.46731
DetailAO = 0
FudgeFactor = 1
MaxRaySteps = 2000
MaxDistance = 20
Dither = 1
NormalBackStep = 1
AO = 0,0,0,0.45643
AoCorrect = 0
Specular = 0.4
SpecularExp = 0
CamLight = 1,1,1,1.05344
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 0
Reflection = 0,0,0
ReflectionsNumber = 0
SpotGlow = true
SpotLight = 1,1,1,1
LightPos = 0,0,0
LightSize = 0.1
LightFallOff = 0
LightGlowRad = 0
LightGlowExp = 1
HardShadow = 0
ShadowSoft = 10.3448
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.6,0.6,-0.16022
Y = 1,0.6,0,-0.38122
Z = 0.8,0.78,1,-0.48066
R = 0.4,0.7,1,0.72682
BackgroundColor = 1,1,1
GradientBackground = 0.3
CycleColors = true
Cycles = 0.96006
EnableFloor = false
FloorNormal = 0,0,-0.10256
FloorHeight = 0.25
FloorColor = 0.666667,0,0
HF_Fallof = 0.1
HF_Const = 0
HF_Intensity = 0
HF_Dir = 0,0,1
HF_Offset = 0
HF_Color = 1,1,1,1
Iterations = 19
ColorIterations = 20
c1 = 0
c2 = 2
Bailout = 5
InsideDE = false
DEtuner = 0.20482
Julia = false
JuliaC = -0.3908,-0.18392,0
absX = false
absY = false
absZ = false
RotVector = 1,1,1
RotAngle = 0
Up = 0,-1,0
#endpreset

#preset sideview
FOV = 1
Eye = 1.68812,0,0.405997
Target = -8.34793,-0.136374,0.890178
Up = 0.00553223,0.000295943,-0.999985
EquiRectangular = false
FocalPlane = 0.14055
Aperture = 0
Gamma = 2
ToneMapping = 3
Exposure = 0.72882
Brightness = 2.0058
Contrast = 1.00885
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Detail = -3.46731
DetailAO = 0
FudgeFactor = 1
MaxRaySteps = 2000
Dither = 1
NormalBackStep = 1
AO = 0,0,0,0.45643
Specular = 0.4
SpecularExp = 0
SpecularMax = 0
SpotLight = 1,1,1,1
SpotLightDir = -0.02778,1
CamLight = 1,1,1,1.05344
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 0
Fog = 0
HardShadow = 0
ShadowSoft = 10.3448
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.6,0.6,-0.16022
Y = 1,0.6,0,-0.38122
Z = 0.8,0.78,1,-0.48066
R = 0.4,0.7,1,0.72682
BackgroundColor = 1,1,1
GradientBackground = 0.3
CycleColors = true
Cycles = 1.19061
EnableFloor = false
FloorNormal = 0,0,-0.10256
FloorHeight = 0.25
FloorColor = 0.666667,0,0
Iterations = 19
ColorIterations = 20
c1 = 0
c2 = 2
Bailout = 5
InsideDE = false
DEtuner = 0.36144
Julia = false
JuliaC = -0.3908,-0.18392,0
absX = false
absY = false
absZ = false
RotVector = 1,1,1
RotAngle = 0
#endpreset

#preset inside
FOV = 1.65
Eye = 0.0404575,0.054741,-1.27891
Target = -0.131535,-0.302088,8.76193
Up = 0.287253,0.950357,0.038694
EquiRectangular = false
FocalPlane = 0.14055
Aperture = 0
Gamma = 2
ToneMapping = 3
Exposure = 0.72882
Brightness = 2.093
Contrast = 1.00885
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Detail = -4.47118
DetailAO = 0
FudgeFactor = 1
MaxRaySteps = 2000
Dither = 1
NormalBackStep = 1
AO = 0,0,0,0.45643
Specular = 0.4
SpecularExp = 0
SpecularMax = 0
SpotLight = 1,1,1,1
SpotLightDir = -0.47222,-0.40278
CamLight = 1,1,1,0.35114
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 0
Fog = 0.69518
HardShadow = 0
ShadowSoft = 10.3448
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.5,0.6,0.6,-0.16022
Y = 1,0.6,0,0.33334
Z = 0.8,0.78,1,-0.48066
R = 0.4,0.7,1,0.72682
BackgroundColor = 1,1,1
GradientBackground = 0.3
CycleColors = true
Cycles = 1.63626
EnableFloor = false
FloorNormal = 0,0,-0.10256
FloorHeight = 0.25
FloorColor = 0.666667,0,0
Iterations = 25
ColorIterations = 20
c1 = 0
c2 = 1
Bailout = 535.48
InsideDE = true
DEtuner = 0.09578
Julia = true
JuliaC = 0.13736,0.0184,0.56368
absX = false
absY = false
absZ = false
RotVector = 1,1,1
RotAngle = 0
#endpreset
