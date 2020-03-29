#version 400 compatibility
#info Mandelbulb Distance Estimator
#info ABS() variant idea
#info Original by user youhn @ http://www.fractalforums.com/gallery-b177/buffalo-fractals

#define providesInit
#define providesBackground

#define WANG_HASH
#include "MathUtils.frag"
#include "CJR_IQPath.frag"
//#include "DE-Kn2cr11.frag"
#group Skybox
uniform samplerCube skybox; file[DragonFire.png]
uniform vec3 bgOffset; slider[(-1,-1,-1),(0,0,0),(1,1,1)]
uniform vec3 bgScale; slider[(-1,-1,-1),(1,-1,1),(1,1,1)]
uniform vec3 bgRotVec; slider[(-1,-1,-1),(0,0,0),(1,1,1)]
uniform float bgRotAngle; slider[-180,0,180]
/*uniform float bgFocus; slider[0.0,0.001,0.5]
vec3  backgroundColor(vec3 dir) {
   dir *= rotationMatrix3(bgRotVec,bgRotAngle);
	if(bgFocus > 0.0)
   	dir += vec3(rand2(dir.xy),rand(dir.z))*bgFocus; 
 	float t = length(from-dir);
	return mix(textureCube(skybox, bgScale*(dir+bgOffset)).rgb, BackgroundColor, 1.0-exp(-pow(Fog,4.0)*t*t));
}*/
vec3  backgroundColor(vec3 dir) {
   dir *= rotationMatrix3(bgRotVec,bgRotAngle);
 	float t = length(from-dir);
	return textureCube(skybox, bgScale*(dir+bgOffset)).rgb;
}
#group Burningbulb

// Number of fractal iterations.
uniform int Iterations;  slider[0,9,100]

// Number of color iterations.
uniform int ColorIterations;  slider[0,9,100]

// Mandelbulb exponent (8 is standard)
uniform float Power; slider[0,8,16]

// Bailout radius
uniform float Bailout; slider[0,5,30]

// mermelada's tweak Derivative bias
uniform float DerivativeBias; slider[0,1,2]

// Alternate is slightly different, but looks more like a Mandelbrot for Power=2
uniform bool AlternateVersion; checkbox[false]

uniform vec3 RotVector; slider[(0,0,0),(1,1,1),(1,1,1)]

uniform float RotAngle; slider[0.00,0,180]

uniform bool Julia; checkbox[false]
uniform vec3 JuliaC; slider[(-2,-2,-2),(0,0,0),(2,2,2)]

uniform bool AbsX; checkbox[false]
uniform bool AbsY; checkbox[false]
uniform bool AbsZ; checkbox[false]

uniform float time;
mat3 rot;
void init() {
	 rot = rotationMatrix3(normalize(RotVector), RotAngle);
}

// This is my power function, based on the standard spherical coordinates as defined here:
// http://en.wikipedia.org/wiki/Spherical_coordinate_system
//
// It seems to be similar to the one Quilez uses:
// http://www.iquilezles.org/www/articles/mandelbulb/mandelbulb.htm
//
// Notice the north and south poles are different here.
void powN1(inout vec3 z, float r, inout float dr) {
	// extract polar coordinates
	float theta = acos(z.z/r);
	float phi = atan(z.y,z.x);
//	dr =  pow( r, Power-1.0)*Power*dr + 1.0;
// mermelada's tweak
	// http://www.fractalforums.com/new-theories-and-research/error-estimation-of-distance-estimators/msg102670/?topicseen#msg102670
	  dr =  max(dr*DerivativeBias,pow( r, Power-1.0)*Power*dr + 1.0);

	// scale and rotate the point
	float zr = pow( r,Power);
	theta = theta*Power;
	phi = phi*Power;

	// convert back to cartesian coordinates
	z = zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
}

// This is a power function taken from the implementation by Enforcer:
// http://www.fractalforums.com/mandelbulb-implementation/realtime-renderingoptimisations/
//
// I cannot follow its derivation from spherical coordinates,
// but it does give a nice mandelbrot like object for Power=2
void powN2(inout vec3 z, float zr0, inout float dr) {
	float zo0 = asin( z.z/zr0 );
	float zi0 = atan( z.y,z.x );
	float zr = pow( zr0, Power-1.0 );
	float zo = zo0 * Power;
	float zi = zi0 * Power;
//	dr = zr*dr*Power + 1.0;
// mermelada's tweak
	// http://www.fractalforums.com/new-theories-and-research/error-estimation-of-distance-estimators/msg102670/?topicseen#msg102670
	  dr = max(dr*DerivativeBias,zr*dr*Power + 1.0);
	zr *= zr0;
	z  = zr*vec3( cos(zo)*cos(zi), cos(zo)*sin(zi), sin(zo) );
}



// Compute the distance from `pos` to the Mandelbox.
float DE(vec3 pos) {
	vec3 z=pos;
	float r=1.0;
	float dr=1.0;
	int i=0;
	r=length(z);
	while(r<Bailout && (i<Iterations)) {

    if(AbsX) z.x = abs(z.x);
    if(AbsY) z.y = abs(z.y);
    if(AbsZ) z.z = abs(z.z);
		
    if (AlternateVersion) {
			powN2(z,r,dr);
		} else {
			powN1(z,r,dr);
		}
		z+=(Julia ? JuliaC : pos);
		r=length(z);
		z*=rot;
		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(z.x,z.y,z.z,r*r)));
		i++;
	}
//	if ((type==1) && r<Bailout) return 0.0;
	return 0.5*log(r)*r/dr;
	/*
	Use this code for some nice intersections (Power=2)
	float a =  max(0.5*log(r)*r/dr, abs(pos.y));
	float b = 1000;
	if (pos.y>0)  b = 0.5*log(r)*r/dr;
	return min(min(a, b),
		max(0.5*log(r)*r/dr, abs(pos.z)));
	*/
}

#include "keyframes.frag"

#preset Default
FOV = 0.62536
Eye = 1.742854,0.1358578,-1.370959
Target = -0.4906801,-0.4830896,-0.4157397
Up = 0.1932022,-0.838823,-0.0917731
EquiRectangular = false
FocalPlane = 1
InFocusAWidth = 0
Aperture = 0
ApertureNbrSides = 2
ApertureRot = 0
ApStarShaped = false
BokehCircle = 1
Gamma = 2
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 6
AntiAliasScale = 3
LensFlare = false
FlareIntensity = 0
FlareSamples = 10
FlareDispersal = 0.5
FlareHaloWidth = 0.5
FlareDistortion = 0.5
Bloom = false
BloomIntensity = 0
BloomPow = 1
BloomTaps = 10
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
RayBounces = 1
RaySteps = 1144
FudgeFactor = 0.1
HitDistance = 1e-05
MaxDepth = 4
Mat_Color = 0.65,0.65,0.65
Mat_Refl = 0
Mat_ReflExp = 0.4351908
UseTexture = true
DeTex = seamless-texture.jpg
DeTexScale = 2
DeTexExposure = 0.3855422
OrbitStrength = 0.5368421
X = 1,1,1,1
Y = 0.345098,0.666667,0,0.1818182
Z = 1,0.666667,0,1
R = 0.0784314,1,0.941176,-1
CycleColors = false
Cycles = 7.719847
SpotLight = 1,0.8,0.5,1.875
SpotLightDir = 0.1126374,-1
SpotSize = 0.5982906
SpotExp = 1.008498
BgColor = 0.3,0.5,0.7,1
Ambience = 2
FogColor = 1,0.7960784,0.3803922,0
GRIter = 3
GRPower = 0.3
skybox = DragonFire.png
bgOffset = 0,0,0
bgScale = 1,-1,1
bgRotVec = 1,0,0
bgRotAngle = 0
Iterations = 60
ColorIterations = 2
Power = 2
Bailout = 3
DerivativeBias = 1
AlternateVersion = false
RotVector = 1,1,1
RotAngle = 0
Julia = false
JuliaC = 0.1007194,-0.5035971,0.5611511
AbsX = true
AbsY = true
AbsZ = true
#endpreset

#preset AbsX
FOV = 0.62536
Eye = -0.4400001,-0.0541667,-2
Target = -0.4400001,-0.0541667,2.5
Up = 0,-1,0
EquiRectangular = false
Gamma = 2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 1
DepthToAlpha = true
ShowDepth = false
DepthMagnitude = 1
Detail = -2.84956
FudgeFactor = 1
MaxRaySteps = 164
NormalBackStep = 1
CamLight = 1,1,1,1
BaseColor = 1,1,1
OrbitStrength = 0.14286
X = 1,1,1,1
Y = 0.345098,0.666667,0,0.02912
Z = 1,0.666667,0,1
R = 0.0784314,1,0.941176,-0.0194
BackgroundColor = 0.607843,0.866667,0.560784
GradientBackground = 0.3261
CycleColors = false
Cycles = 4.04901
EnableFloor = false NotLocked
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
AutoFocus = false
FocalPlane = 1
Aperture = 0
DetailAO = -1.35716
MaxDistance = 1000
Dither = 0.51754
AO = 0,0,0,1
Specular = 0.288
SpecularExp = 20
SpecularMax = 10.46512
SpotLight = 1,1,1,0.5
SpotLightDir = -0.6,0.6
CamLightMin = 0
Glow = 1,1,1,0.2743363
GlowMax = 152
Fog = 0
HardShadow = 1
ShadowSoft = 20
QualityShadows = true
Reflection = 0
DebugSun = false
Iterations = 12
ColorIterations = 8
Power = 2
Bailout = 6.279
DerivativeBias = 2
AlternateVersion = true
RotVector = 1,0,0
RotAngle = 0
Julia = false
JuliaC = 0,0,0
AbsX = true
AbsY = false
AbsZ = false
#endpreset

#preset AbsY
FOV = 0.62536
Eye = -0.4400001,-0.0541667,-2
Target = -0.4400001,-0.0541667,2.5
Up = 0,-1,0
EquiRectangular = false
Gamma = 2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 1
DepthToAlpha = true
ShowDepth = false
DepthMagnitude = 1
Detail = -2.84956
FudgeFactor = 1
MaxRaySteps = 164
NormalBackStep = 1
CamLight = 1,1,1,1
BaseColor = 1,1,1
OrbitStrength = 0.14286
X = 1,1,1,1
Y = 0.345098,0.666667,0,0.02912
Z = 1,0.666667,0,1
R = 0.0784314,1,0.941176,-0.0194
BackgroundColor = 0.607843,0.866667,0.560784
GradientBackground = 0.3261
CycleColors = false
Cycles = 4.04901
EnableFloor = false NotLocked
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
AutoFocus = false
FocalPlane = 1
Aperture = 0
DetailAO = -1.35716
MaxDistance = 1000
Dither = 0.51754
AO = 0,0,0,1
Specular = 0.288
SpecularExp = 20
SpecularMax = 10.46512
SpotLight = 1,1,1,0.5
SpotLightDir = -0.6,0.6
CamLightMin = 0
Glow = 1,1,1,0.2743363
GlowMax = 152
Fog = 0
HardShadow = 1
ShadowSoft = 20
QualityShadows = true
Reflection = 0
DebugSun = false
Iterations = 12
ColorIterations = 8
Power = 2
Bailout = 6.279
DerivativeBias = 2
AlternateVersion = true
RotVector = 1,0,0
RotAngle = 0
Julia = false
JuliaC = 0,0,0
AbsX = false
AbsY = true
AbsZ = false
#endpreset

#preset AbsXY
FOV = 0.62536
Eye = -0.4400001,-0.5708333,-2
Target = -0.4400001,-0.5708333,2.5
Up = 0,-1,0
EquiRectangular = false
Gamma = 2
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 1
DepthToAlpha = true
ShowDepth = false
DepthMagnitude = 1
Detail = -2.84956
FudgeFactor = 1
MaxRaySteps = 164
NormalBackStep = 1
CamLight = 1,1,1,1
BaseColor = 1,1,1
OrbitStrength = 0.14286
X = 1,1,1,1
Y = 0.345098,0.666667,0,0.02912
Z = 1,0.666667,0,1
R = 0.0784314,1,0.941176,-0.0194
BackgroundColor = 0.607843,0.866667,0.560784
GradientBackground = 0.3261
CycleColors = false
Cycles = 4.04901
EnableFloor = false NotLocked
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
AutoFocus = false
FocalPlane = 1
Aperture = 0
DetailAO = -1.35716
MaxDistance = 1000
Dither = 0.51754
AO = 0,0,0,1
Specular = 0.288
SpecularExp = 20
SpecularMax = 10.46512
SpotLight = 1,1,1,0.5
SpotLightDir = -0.6,0.6
CamLightMin = 0
Glow = 1,1,1,0.2743363
GlowMax = 152
Fog = 0
HardShadow = 1
ShadowSoft = 20
QualityShadows = true
Reflection = 0
DebugSun = false
Iterations = 12
ColorIterations = 8
Power = 2
Bailout = 6.279
DerivativeBias = 2
AlternateVersion = true
RotVector = 1,0,0
RotAngle = 0
Julia = false
JuliaC = 0,0,0
AbsX = true
AbsY = true
AbsZ = false
#endpreset

#preset Tangles
FOV = 0.56
Eye = 1.027312,-1.022152,0.8223372
Target = -0.0420337,-1.733906,-1.330357
Up = 0.780306,-0.0480833,-0.371717
EquiRectangular = false
Gamma = 2
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 6.027397
AntiAliasScale = 2
RayBounces = 1
RaySteps = 1000
FudgeFactor = 1
HitDistance = 1e-05
MaxDepth = 10
Mat_Color = 0.65,0.65,0.65
Mat_Refl = 1
Mat_ReflExp = 0.4351908
UseTexture = true
DeTex = seamless-texture.jpg
DeTexScale = 1
DeTexExposure = 0.4096386
OrbitStrength = 0.5368421
X = 1,1,1,0.4848485
Y = 0.345098,0.666667,0,0.4090909
Z = 1,0.666667,0,0.5877863
R = 0.0784314,1,0.941176,-0.4848485
CycleColors = false
Cycles = 0.1
SpotLight = 1,0.8,0.5,1.875
SpotLightDir = 0.5959596,0.9191919
SpotSize = 0.5982906
SpotExp = 1.008498
BgColor = 0.3,0.5,0.7,1
Ambience = 2
Fog = 1.5
GRIter = 2
GRPower = 0.2910448
Iterations = 32
ColorIterations = 6
Power = 2
Bailout = 30
DerivativeBias = 0
AlternateVersion = false
RotVector = 1,1,1
RotAngle = 0
Julia = false
JuliaC = 0.1007194,-0.5035971,0.5611511
AbsX = true
AbsY = true
AbsZ = true
FocalPlane = 1
Aperture = 0
ApertureNbrSides = 2
ApertureRot = 0
ApStarShaped = false
BokehCircle = 2
InFocusAWidth = 0
#endpreset

#preset BowDet
FOV = 0.56
Eye = -1.531552,0.0081898,0.8474788
Target = 0.376677,-0.1842366,1.435923
Up = 0.0658753,0.7442694,0.0297596
EquiRectangular = false
Gamma = 2
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 6.027397
AntiAliasScale = 2
RayBounces = 1
RaySteps = 1000
FudgeFactor = 1
HitDistance = 1e-05
MaxDepth = 10
Mat_Color = 0.65,0.65,0.65
Mat_Refl = 1
Mat_ReflExp = 0.4351908
UseTexture = true
DeTex = seamless-texture.jpg
DeTexScale = 1
DeTexExposure = 0.4096386
OrbitStrength = 0.5368421
X = 1,1,1,0.4848485
Y = 0.345098,0.666667,0,0.4090909
Z = 1,0.666667,0,0.5877863
R = 0.0784314,1,0.941176,-0.4848485
CycleColors = false
Cycles = 0.1
SpotLight = 1,0.8,0.5,1.875
SpotLightDir = 0.2727273,1
SpotSize = 0.5982906
SpotExp = 1.008498
BgColor = 0.3,0.5,0.7,1.5
Ambience = 2
Fog = 1
GRIter = 0
GRPower = 0.2238806
Iterations = 32
ColorIterations = 6
Power = 2
Bailout = 30
DerivativeBias = 0
AlternateVersion = false
RotVector = 1,1,1
RotAngle = 0
Julia = false
JuliaC = 0.1007194,-0.5035971,0.5611511
AbsX = true
AbsY = true
AbsZ = true
FocalPlane = 1
Aperture = 0
ApertureNbrSides = 2
ApertureRot = 0
ApStarShaped = false
BokehCircle = 2
InFocusAWidth = 0
#endpreset

#preset BowDet2
FOV = 0.56
Eye = -1.574246,0.0147717,0.8637701
Target = 0.4197636,0.0865078,1.072116
Up = -0.0270084,0.7472821,0.0011896
EquiRectangular = false
Gamma = 2
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 6.027397
AntiAliasScale = 2
RayBounces = 1
RaySteps = 1000
FudgeFactor = 1
HitDistance = 1e-05
MaxDepth = 10
Mat_Color = 0.65,0.65,0.65
Mat_Refl = 1
Mat_ReflExp = 0.4351908
UseTexture = true
DeTex = seamless-texture.jpg
DeTexScale = 1
DeTexExposure = 0.4096386
OrbitStrength = 0.5368421
X = 1,1,1,0.4848485
Y = 0.345098,0.666667,0,0.4090909
Z = 1,0.666667,0,0.5877863
R = 0.0784314,1,0.941176,-0.4848485
CycleColors = false
Cycles = 0.1
SpotLight = 1,0.8,0.5,1.875
SpotLightDir = 0.2727273,1
SpotSize = 0.5982906
SpotExp = 1.008498
BgColor = 0.3,0.5,0.7,1.5
Ambience = 2
Fog = 1
GRIter = 0
GRPower = 0.2238806
Iterations = 32
ColorIterations = 6
Power = 2
Bailout = 30
DerivativeBias = 0
AlternateVersion = false
RotVector = 1,1,1
RotAngle = 0
Julia = false
JuliaC = 0.1007194,-0.5035971,0.5611511
AbsX = true
AbsY = true
AbsZ = true
FocalPlane = 1
Aperture = 0
ApertureNbrSides = 2
ApertureRot = 0
ApStarShaped = false
BokehCircle = 2
InFocusAWidth = 0
#endpreset

#preset BowDet3
FOV = 0.56
Eye = -1.596903,0.0296358,0.8961152
Target = 0.3724009,-0.024441,0.5172514
Up = 0.0235384,0.7472354,0.0156945
EquiRectangular = false
Gamma = 2
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 6.027397
AntiAliasScale = 2
RayBounces = 1
RaySteps = 1000
FudgeFactor = 1
HitDistance = 1e-05
MaxDepth = 10
Mat_Color = 0.65,0.65,0.65
Mat_Refl = 0
Mat_ReflExp = 1e-05
UseTexture = true
DeTex = seamless-texture.jpg
DeTexScale = 1
DeTexExposure = 0.3614458
OrbitStrength = 0.5368421
X = 1,1,1,0.4848485
Y = 0.345098,0.666667,0,0.4090909
Z = 1,0.666667,0,0.5877863
R = 0.0784314,1,0.941176,-0.4848485
CycleColors = true
Cycles = 12.1
SpotLight = 1,0.8,0.5,1.875
SpotLightDir = -0.5959596,-0.6363636
SpotSize = 0.5982906
SpotExp = 1.008498
BgColor = 0.3,0.5,0.7,1.5
Ambience = 2
Fog = 1
GRIter = 0
GRPower = 0.4701493
Iterations = 40
ColorIterations = 8
Power = 2
Bailout = 30
DerivativeBias = 0
AlternateVersion = false
RotVector = 1,1,1
RotAngle = 0
Julia = false
JuliaC = 0.1007194,-0.5035971,0.5611511
AbsX = true
AbsY = true
AbsZ = true
FocalPlane = 1
Aperture = 0
ApertureNbrSides = 2
ApertureRot = 0
ApStarShaped = false
BokehCircle = 2
InFocusAWidth = 0
#endpreset

#preset Snuffleupagus
FOV = 0.56
Eye = -1.256232,-0.0417639,0.4269367
Target = -0.1755846,1.559651,0.9675829
Up = -0.5497599,0.4498446,-0.2335933
EquiRectangular = false
Aperture = 0
Gamma = 2
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 6.027397
AntiAliasScale = 2
OrbitStrength = 0.5368421
X = 1,1,1,0.4848485
Y = 0.345098,0.666667,0,0.4090909
Z = 1,0.666667,0,0.5877863
R = 0.0784314,1,0.941176,-0.4848485
CycleColors = false
Cycles = 0.1
Iterations = 32
ColorIterations = 6
Power = 2
Bailout = 30
DerivativeBias = 0
AlternateVersion = false
RotVector = 1,1,1
RotAngle = 0
Julia = false
JuliaC = 0.1007194,-0.5035971,0.5611511
FocalPlane = 1
InFocusAWidth = 0
ApertureNbrSides = 2
ApertureRot = 0
ApStarShaped = false
BokehCircle = 1
RayBounces = 1
RaySteps = 1000
FudgeFactor = 1
HitDistance = 1e-05
MaxDepth = 10
Mat_Color = 0.65,0.65,0.65
Mat_Refl = 1
Mat_ReflExp = 0.4351908
UseTexture = true
DeTex = seamless-texture.jpg
DeTexScale = 1
DeTexExposure = 0.4096386
SpotLight = 1,0.8,0.5,1.875
SpotLightDir = 0.2727273,1
SpotSize = 0.5982906
SpotExp = 1.008498
BgColor = 0.3,0.5,0.7,1.5
Ambience = 2
Fog = 1
GRIter = 2
GRPower = 1
AbsX = true
AbsY = true
AbsZ = true
#endpreset

#preset CaveWithAView
FOV = 0.75
Eye = -0.576269,-0.0350148,-0.6389729
Target = -1.300226,-0.412928,-2.508859
Up = 0.0165231,-0.9504753,0.1856986
EquiRectangular = false
Aperture = 0.0001
Gamma = 2
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 6
AntiAliasScale = 3
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
OrbitStrength = 0.53
X = 1,1,1,1
Y = 0.345098,0.666667,0,0.1818182
Z = 1,0.666667,0,1
R = 0.0784314,1,0.941176,-1
CycleColors = false
Cycles = 32.3
Iterations = 100
ColorIterations = 2
Power = 2
Bailout = 6
DerivativeBias = 0.5
AlternateVersion = false
RotVector = 1,1,1
RotAngle = 0
Julia = false
JuliaC = -1.238095,-0.5238095,1.380952
FocalPlane = 5
InFocusAWidth = 0
ApertureNbrSides = 5
ApertureRot = 0
ApStarShaped = false
BokehCircle = 1
LensFlare = false
FlareIntensity = 0
FlareSamples = 10
FlareDispersal = 0.5
FlareHaloWidth = 0.5
FlareDistortion = 0.5
Bloom = false
BloomIntensity = 0
BloomPow = 1
BloomTaps = 10
RayBounces = 1
RaySteps = 3500
FudgeFactor = 0.1
HitDistance = 1e-05
MaxDepth = 5
Mat_Color = 0.65,0.65,0.65
Mat_Refl = 1
Mat_ReflExp = 1
UseTexture = true
DeTex = seamless-texture.jpg
DeTexScale = 1
DeTexExposure = 0.75
SpotLight = 1,0.8,0.5,1.5
SpotLightDir = 0.8214286,-0.956044
SpotSize = 0.1
SpotExp = 20
BgColor = 0.8784314,0.4235294,0.1137255,1
Ambience = 2
Fog = 0
GRIter = 3
GRPower = 0.3
skybox = DragonFire.png
bgOffset = 0,0,0.5
bgScale = -1,-1,-1
bgRotVec = 1,0.2832215,-0.0657718
bgRotAngle = 14.07821
bgFocus = 5e-05
AbsX = true
AbsY = true
AbsZ = true
#endpreset
