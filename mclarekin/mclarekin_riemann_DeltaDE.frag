// Output generated from file: D:/fractal/Fragmentarium/Output/Sabine/riemann/riemannDeltaDE/mclarekin_riemann_DeltaDE.frag
// Created: Thu Nov 15 18:02:49 2018
#info Link to msltoe's original Riemann-version: http://www.fractalforums.com/new-theories-and-research/another-way-to-make-my-riemann-sphere-'bulb'-using-a-conformal-transformation/
#info This version ported by mclarekin https://fractalforums.org/fragmentarium/17/attempting-to-port-riemann-to-fragmentarium/2263/msg10907#msg10907
#info DeltaDE by buddhi

#include "MathUtils.frag"
//#include "DE-Raytracer.frag"
//#define USE_IQ_CLOUDS
#define KN_VOLUMETRIC
#define USE_EIFFIE_SHADOW
#define MULTI_SAMPLE_AO
#include "DE-Kn2cr11.frag"
//#include "DE-Raytracer.frag"
#define M_PI 3.1415926535897932384626433832795
#group Riemann
uniform float b; slider[-30,0,30]
uniform float c; slider[-30,1,30]
uniform int imax;  slider[0,9,100]
uniform int ColorIterations;  slider[0,3,100]
uniform float scale; slider[-30,1,30]
uniform float ssh; slider[-7,0,7]
uniform float tsh; slider[-7,0,7]
uniform vec3 shift; slider[(-20,-20,-20),(0,0,0),(20,20,20)]
uniform float DEScale; slider[-2,0,2]
uniform float DEOffset; slider[0,0,20]


vec3 DE1(vec3 pos) {
	vec3 z=pos;
	float r = length(z);
	float dr=1.0;
	float dz=1.0;
	int i=0;
	float norm=0.0;
	int iter=1;
 	vec3 oldZ = z;
	float pi = M_PI;
	while ((norm<8. )&&(iter<imax)) { // left most of mclarekins analyticDE code intact as this DeltaDE is work in progress
		// rot
  		// if (r < 1e-21) r = 1e-21;
  		z *= scale / r;
  		dr = dr * scale / r - 0.;
   	float q = 1.0 / (1.0 - z.z);
   	float s = z.x * q;
   	float t = z.y * q;
  	 	float p = 1.0 + s * s + t * t;
  		s = abs(sin(M_PI * s + ssh));
  		t = abs(sin(M_PI * t + tsh));
  		r *= r;
   	//if (r < 1e-21)
   	// r = 1e-21;
 		// if (p > 36) p = 36; // problem with pow()
  		r = -0.25 + pow(r, p);
  		z.x = 2.0 * s;
  		z.y = 2.0 * t;
  		z.z = -1.0 + s * s + t * t;
  		z *= r / (1.0 + s * s + t * t);
		dr = (dr *r / (1.0 + s * s + t * t))*DEScale;
  		z += shift;
		//dz = max(max(z.x*z.y,z.y*z.z),z.z*z.x);
		//dz = sqrt(dz);
		//dz = max(max(z.x,z.y),z.z);
		//dz *= length(oldZ)/length(z);
 		dr = max(dr,dz);
		oldZ = z;
		r = length(z);
   	norm = dot(z,z);
		if (iter<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(z.x,z.y,z.z,r*r)));
   	iter++;
	}
	
	return z;
 }
 
float DE(vec3 p) {
	vec3 z=p;
	float deltavalue = max(length(z) * 0.000001, DEScale * 0.1);
	vec3 deltaX = vec3 (deltavalue, 0.0, 0.0);
	vec3 deltaY = vec3 (0.0, deltavalue, 0.0);
	vec3 deltaZ = vec3 (0.0, 0.0, deltavalue);


	vec3 zCenter = DE1(z);
	float r = length(zCenter);

	vec3 d;
	vec3 zx1 = DE1(z + deltaX);
	vec3 zx2 = DE1(z - deltaX);
	d.x = min(abs(length(zx1) - r), abs(length(zx2) - r)) / deltavalue;

	vec3 zy1 = DE1(z + deltaY);
	vec3 zy2 = DE1(z - deltaY);
	d.y = min(abs(length(zy1) - r), abs(length(zy2) - r)) / deltavalue;

	vec3 zz1 = DE1(z + deltaZ);
	vec3 zz2 = DE1(z - deltaZ);
	d.z = min(abs(length(zz1) - r), abs(length(zz2) - r)) / deltavalue;
	
	float dr = length(d);
	
	return 0.5 * (r) * log(r)/(dr);  //logarythmic DeltaDE
	//return 0.5 * (r-DEOffset)/abs(dr); //linear DeltaDE
	//return 0.5*log(r-DEOffset)/(dr); //logarithmic AnalyticDE
	//return (r-DEOffset)/abs(dr); //linear AnalyticDE

}


#preset Default
FOV = 0.3157895
Eye = 0.0170859,-5.997446,0.0556834
Target = -0.2070382,4.962074,-0.8601221
Up = 0,0,-0.9959208
EquiRectangular = false
FocalPlane = 3.705299
Aperture = 0.0146628
InFocusAWidth = 1
DofCorrect = true
ApertureNbrSides = 7
ApertureRot = 0
ApStarShaped = false
Gamma = 1
ToneMapping = 5
Exposure = 0.6522
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 0.5
Bloom = false
BloomIntensity = 0
BloomPow = 2
BloomTaps = 4
BloomStrong = 1
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -2.5
RefineSteps = 4
FudgeFactor = 0.0296384
MaxDistance = 67.10605
Dither = 1
NormalBackStep = 10
DetailAO = -0.1765276
coneApertureAO = 0.1933373
maxIterAO = 46
FudgeAO = 0.9405941
AO_ambient = 0.935167
AO_camlight = 1.069813
AO_pointlight = 1.189723
AoCorrect = 0.3280794
Specular = 0.5907336
SpecularExp = 16.364
CamLight = 1,0.8078431,0.5843138,1.549229
AmbiantLight = 0.7098039,0.8666667,1,1.233813
Reflection = 0.9882353,0.8705882,0.7529412
ReflectionsNumber = 3
SpotGlow = true
SpotLight = 1,0.9098039,0.7529412,4.066066
LightPos = -0.8244994,-1.861013,-2.096584
LightSize = 0
LightFallOff = 0.1686508
LightGlowRad = 0
LightGlowExp = 0.5730404
HardShadow = 0.99
ShadowSoft = 0
ShadowBlur = 0
perf = false
SSS = false
sss1 = 0.1
sss2 = 0.5
BaseColor = 1,0.7372549,0.6117647
OrbitStrength = 1
X = 1,1,1,1
Y = 0.345098,0.666667,0,0.1186047
Z = 1,0.666667,0,1
R = 0.2470588,0.3176471,0.1764706,0.8836533
BackgroundColor = 0.1137255,0.1921569,0.2470588
GradientBackground = 1.231231
CycleColors = true
Cycles = 2.825333
EnableFloor = true NotLocked
FloorNormal = 0,0,1
FloorHeight = 1.024662
FloorColor = 0.3803922,0.3254902,0.282353
HF_Fallof = 0.2118705
HF_Const = 0
HF_Intensity = 0
HF_Dir = 0,0,1
HF_Offset = -9.111374
HF_Color = 0.7764706,0.8470588,1,3
HF_Scatter = 0
HF_Anisotropy = 0,0,0
HF_FogIter = 1
HF_CastShadow = false
EnCloudsDir = false
CloudDir = 0,0,1
CloudScale = 1
CloudFlatness = 0
CloudTops = 1
CloudBase = -1
CloudDensity = 1
CloudRoughness = 1
CloudContrast = 1
CloudColor = 0.65,0.68,0.7
CloudColor2 = 0.07,0.17,0.24
SunLightColor = 0.7,0.5,0.3
Cloudvar1 = 0.99
Cloudvar2 = 1
CloudIter = 5
CloudBgMix = 1
WindDir = 0,0,1
WindSpeed = 1
b = 0
c = 1
imax = 18
ColorIterations = 9
scale = 1
ssh = 0
tsh = 0
shift = -0.1964182,-0.5430387,0.774119
DEScale = 2
DEOffset = 0
MaxRaySteps = 5000
#endpreset

