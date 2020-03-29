// Output generated from file: C:/Users/graeme/Downloads/Fragmentarium-2.5.0-181027-winex/Fragmentarium-2.5.0-181027.winex/Examples/mclarekin/msltoe_juliaBulbSym4 addPos.frag
// Created: Tue Nov 20 17:28:30 2018

//MsltoeJuiliaBulbSym4Mod  Based on the formula from Mandelbulb3D
// @reference http://www.fractalforums.com/theory/choosing-the-squaring-formula-by-location/15/
// this is another trial for adding in some iteration color in FragM,
// it can be easily removed.  mclarekin 24-02-19

#info Mandelbulb Distance Estimator
#define providesInit

#include "MathUtils.frag"
#include "DE-Raytracer.frag"
#group Sym4JuliaBulb

// Number of fractal iterations.
uniform int Iterations;  slider[0,9,100]

// Number of color iterations.
uniform int ColorIterations;  slider[0,9,100]

// Bailout radius
uniform float Bailout; slider[0,14,30]

// use XYZscale with care (bad DE)
uniform vec3 XYZscale; slider[(-5,-5,-5),(1,1,1),(5,5,5)]
uniform vec3 JuliaOffset; slider[(-5,-5,-5),(0,0,0),(5,5,5)]
uniform vec3 OrigPtOffset; slider[(-5,-5,-5),(0,0,0),(5,5,5)]
uniform vec3 Rotation; slider[(-180,-180,-180),(0,0,0),(180,180,180)]
uniform bool IterCol; checkbox[false]
uniform vec3 ColFactor; slider[(-5,-5,-5),(0.1,0.1,0.1),(5,5,5)]

uniform float time;
mat3 rot;


void init() {

 rot = rotationMatrixXYZ(Rotation);
}

float DE(vec3 pos) {
	vec3 z = pos;
	float r = length(z);
	float Dd=1.0;
	int i=0;
	vec3 Col = vec3(0.0,0.0,0.0);
	r=length(z);
	vec3 OrigPoint = pos * OrigPtOffset;

	while(r<Bailout && (i<Iterations)) {
	vec3 c = pos;
	vec3 oldZ = z;
	Dd = Dd * 2.0 * r;
	vec3 temp = z;
	float tempL = length(temp);
	z *= XYZscale;
 	z += OrigPoint;
	Dd *= abs(length(z) / tempL);

	float temp1 = abs(z.x) - abs(z.z);
	if (temp1 < 0.0) 
	{	z.xz = z.zx;
		Col.x += ColFactor.x * temp1;}

	temp1 = abs(z.x) - abs(z.y);
	if (temp1 < 0.0)
	{	z.xy = z.yx;
		Col.y += ColFactor.y * temp1;}

	temp1 = abs(z.y) - abs(z.z);
	if (temp1 < 0.0)
	{	z.yz = z.zy;
		Col.z += ColFactor.z * temp1;}

	if (z.x * z.z < 0.0) z.z = -z.z;
	if (z.x * z.y < 0.0) z.y = -z.y;

	temp.x = z.x * z.x - z.y * z.y - z.z * z.z;
	temp.y = 2.0 * z.x * z.y;
	temp.z = 2.0 * z.x * z.z;

	z = temp + JuliaOffset;

	z *= rot;

	r = length(z);

 
  if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(Col.x+z.x,Col.y+z.y,Col.z+z.z,r*r))); 
  //if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(Col.x,Col.y,Col.z,r*r))); 	
	//if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(z.x,z.y,z.z,r*r)));
	
	i++;
	}

	return 0.5*log(r)*r/Dd;

}

#preset Default
FOV = 0.4
Eye = 0,0,-10
Target = 0,0,0
Up = 0,1,0
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Gamma = 2
ToneMapping = 4
Exposure = 1
Brightness = 1
Contrast = 1
AvgLumin = 0.5,0.5,0.5
Saturation = 1
LumCoeff = 0.2125,0.7154,0.0721
Hue = 0
GaussianWeight = 1
AntiAliasScale = 2
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -2.3
DetailAO = -0.5
FudgeFactor = 1
MaxDistance = 1000
MaxRaySteps = 56
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.699999988
Specular = 0.4
SpecularExp = 16
SpecularMax = 10
SpotLight = 1,1,1,0.400000006
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
QualityShadows = false
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 0
X = 0.5,0.6,0.6,0.699999988
Y = 1,0.6,0,0.400000006
Z = 0.8,0.78,1,0.5
R = 0.4,0.7,1,0.119999997
BackgroundColor = 0.6,0.6,0.45
GradientBackground = 0.3
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 9
ColorIterations = 9
Bailout = 30
XYZscale = 0.9518349,1.2041285,0.5389909
JuliaOffset = -1.3583815,-0.3641618,-2.16763
OrigPtOffset = 0.1586369,-0.0646298,0
Rotation = 78.6976776,10.4651172,84.5581428
IterCol = false
ColFactor = 0.3164557,-0.70771,1.1104719
#endpreset

#preset basicSphere
FOV = 0.4
Eye = 0,0,-4.799996
Target = 0,0,5.199997
Up = 0,1,0
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Gamma = 2
ToneMapping = 4
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -2.792746
DetailAO = -0.6639566
FudgeFactor = 1
MaxDistance = 287.0091
MaxRaySteps = 53
Dither = 0.5
NormalBackStep = 0
AO = 0,0,0,0.7
Specular = 0.4
SpecularExp = 16
SpecularMax = 10
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
QualityShadows = false
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.3607843,0.3921569,0.9411765,0.6084656
Y = 0.1372549,0.3333333,0.1372549,-0.7308707
Z = 0.3333333,0.08235294,0.05882353,0.3139842
R = 0.8117647,0.8352941,0.3764706,0.3809524
BackgroundColor = 0.6,0.6,0.45
GradientBackground = 0.3
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 9
ColorIterations = 9
Bailout = 14
XYZscale = 1,1,1
JuliaOffset = 0,0,0
Rotation = 0,0,0
IterCol = false
ColFactor = 0.1,0.1,0.1
OrigPtOffset = 0,0,0
#endpreset

#preset rot
FOV = 0.4
Eye = 0,0,-4.799996
Target = 0,0,5.199997
Up = 0,1,0
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Gamma = 2
ToneMapping = 4
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -2.792746
DetailAO = -0.6639566
FudgeFactor = 1
MaxDistance = 287.0091
MaxRaySteps = 53
Dither = 0.5
NormalBackStep = 0
AO = 0,0,0,0.7
Specular = 0.4
SpecularExp = 16
SpecularMax = 10
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
QualityShadows = false
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 1
X = 0.3607843,0.3921569,0.9411765,0.6084656
Y = 0.1372549,0.3333333,0.1372549,-0.7308707
Z = 0.3333333,0.08235294,0.05882353,0.3139842
R = 0.8117647,0.8352941,0.3764706,0.3809524
BackgroundColor = 0.6,0.6,0.45
GradientBackground = 0.3
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 9
ColorIterations = 9
Bailout = 14
XYZscale = 1,1,1
JuliaOffset = 0.4771784,-0.8506224,0
Rotation = 0.7531381,-14.30962,0
IterCol = false
ColFactor = 1.341463,-3.00813,0.2845528
OrigPtOffset = 0,0,0
#endpreset

#preset ex
FOV = 0.4
Eye = 0,0,-4.799996
Target = 0,0,5.199997
Up = 0,1,0
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Gamma = 2
ToneMapping = 4
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -2.792746
DetailAO = -0.6639566
FudgeFactor = 1
MaxDistance = 287.0091
MaxRaySteps = 53
Dither = 0.5
NormalBackStep = 0
AO = 0,0,0,0.7
Specular = 0.4
SpecularExp = 16
SpecularMax = 10
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
QualityShadows = false
Reflection = 0
DebugSun = false
BaseColor = 1,0.5137255,0.3529412
OrbitStrength = 0.5482456
X = 0.3607843,0.3921569,0.9411765,0.6846154
Y = 0.3294118,0.1411765,0.08627451,0.4099617
Z = 0.3333333,1,1,-0.0957854
R = 0.8117647,0.8352941,0.3764706,0.2692308
BackgroundColor = 0.6,0.6,0.45
GradientBackground = 0.3
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 9
ColorIterations = 5
Bailout = 5
XYZscale = 1,1.028571,0.8285714
JuliaOffset = -0.6725146,-0.9356725,0.7602339
Rotation = -10.58824,180,52.94118
IterCol = true
ColFactor = 0.4471545,-3.943089,0.9756098
OrigPtOffset = 0,0,0
#endpreset
