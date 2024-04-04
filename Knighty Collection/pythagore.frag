#info pythagore tree 3D
#define providesInit
#define KN_VOLUMETRIC
#define USE_EIFFIE_SHADOW
#define MULTI_SAMPLE_AO
#include "MathUtils.frag"
#include "DE-Kn2.frag"
#group pythagore
// Number of fractal iterations.
uniform int Iterations;  slider[0,5,20]
// Mandelbulb exponent (8 is standard)
uniform float Size; slider[0,1,5]
//
uniform float RotAngle; slider[0.00,0,180]

mat2 rot;
uniform float time;
void init() {
	float r=(RotAngle+36.*time)*PI/180.;
	float c=cos(r), s=sin(r);
	 rot = mat2(c,s,-s,c);
}

float DEbox(vec3 p, float a){
	p=abs(p);
	p=p-vec3(a);
	return max(p.x,max(p.y,p.z));
}
float DEpythagore(vec3 p){
	float is=1.;
	float d=DEbox(p,Size);
	vec3 tr=Size*vec3(3.,0.,1.);
	float BVR=8.*Size;
	for (int i=0; i<Iterations; i++){
#if 1
		float rh=dot(p,p)*is*is;
		float lh=d+BVR*is;
		if(rh>lh*lh) break;
#endif
#if 0
		if(dot(p,p)>BVR*BVR*4.){
			float d1=(length(p)-BVR)*is;
			//float t=clamp(d1/(BVR*(sqrt(2.)-1.)), 0.,1.);
			d=min(d,d1);//
			//d=smoothstep(d,d1,t);//
			break;
		}
#endif
		//if(dot(p,p)>100.) break;
		//rotate
		p.xy=rot*p.xy;//vec2(-1.,1.)*p.yx;
		//fold
		p.x=abs(p.x);
		//translate
		p-=tr;
		//rotate
		p.xz=sqrt(.5)*mat2(1.,1.,-1.,1.)*p.xz;
		//scale
		p*=sqrt(2.); is*=sqrt(.5);
		//translate back
		p+=tr;
		//trap
		d=min(d,DEbox(p,Size)*is);
	}
	return d;// min(d,(length(p)-8.*Size)*is);
}
float DE(vec3 p) {
	//return DEbox(p,1.);
	return DEpythagore(p);
}

#preset Default
FOV = 0.4
Eye = 3.05656,14.1958,0.127179
Target = 0.706381,4.64234,1.91805
Up = 0.0600045,0.16964,0.983678
FocalPlane = 5.80584
Aperture = 0.01807
InFocusAWidth = 0.64286
ApertureNbrSides = 5
ApertureRot = 0
ApStarShaped = false
Gamma = 1
ToneMapping = 2
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Bloom = true
BloomIntensity = 0.05556
BloomPow = 1.236
BloomTaps = 10
Detail = -3
DetailAO = -0.9506
FudgeFactor = 1
MaxRaySteps = 243
MaxDistance = 85.11
Dither = 1
NormalBackStep = 1
AO = 0,0,0,1
AoCorrect = 0
Specular = 1
SpecularExp = 41.665
CamLight = 1,1,1,1
CamLightMin = 0.79518
Glow = 1,1,1,0
GlowMax = 20
Reflection = 0.09474
ReflectionsNumber = 2 Locked
SpotLight = 1,1,1,10
LightPos = -0.9678,-0.9678,8.9248
LightSize = 0.09901
LightFallOff = 0.22472
LightGlowRad = 0.5769
LightGlowExp = 1.519
HardShadow = 1 Locked
ShadowSoft = 0
BaseColor = 0.796078,0.54902,0.372549
OrbitStrength = 0
X = 0.5,0.6,0.6,0.7
Y = 1,0.6,0,0.4
Z = 0.8,0.78,1,0.5
R = 0.4,0.7,1,0.12
BackgroundColor = 0.384314,0.501961,0.6
GradientBackground = 0.3
CycleColors = false
Cycles = 1.1
EnableFloor = true
FloorNormal = 0,0,1
FloorHeight = -1
FloorColor = 0.313725,0.529412,0.376471
HF_Fallof = 0.09091
HF_Const = 0
HF_Intensity = 0.005
HF_Dir = 0,0,1
HF_Offset = 0
HF_Color = 0.619608,0.780392,1,3
Iterations = 15
Size = 1
RotAngle = 59.9994
#endpreset

#preset LightInTree
FOV = 0.4
Eye = 14.5224,8.71762,3.88391
Target = 5.83805,3.80675,3.20297
Up = -0.0539203,-0.0428225,0.997627
FocalPlane = 5.80584
Aperture = 0.01807
InFocusAWidth = 0.64286
ApertureNbrSides = 5
ApertureRot = 0
ApStarShaped = false
Gamma = 1
ToneMapping = 2
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Bloom = false
BloomIntensity = 0.05556
BloomPow = 1.236
BloomTaps = 10
Detail = -3
DetailAO = -0.9506
FudgeFactor = 1
MaxRaySteps = 243
MaxDistance = 85.11
Dither = 1
NormalBackStep = 1
AO = 0,0,0,1
AoCorrect = 0
Specular = 1
SpecularExp = 41.665
CamLight = 1,1,1,1
CamLightMin = 0.79518
Glow = 1,1,1,0
GlowMax = 20
Reflection = 0.09474
ReflectionsNumber = 2 Locked
SpotGlow = false
SpotLight = 1,1,1,10
LightPos = -2.562,0.4132,4.2148
LightSize = 0.09901
LightFallOff = 0.78632
LightGlowRad = 0.5769
LightGlowExp = 1.519
HardShadow = 1 Locked
ShadowSoft = 0
BaseColor = 0.796078,0.54902,0.372549
OrbitStrength = 0
X = 0.5,0.6,0.6,0.7
Y = 1,0.6,0,0.4
Z = 0.8,0.78,1,0.5
R = 0.4,0.7,1,0.12
BackgroundColor = 0,0,0
GradientBackground = 0.3
CycleColors = false
Cycles = 1.1
EnableFloor = true
FloorNormal = 0,0,1
FloorHeight = -1
FloorColor = 0.313725,0.529412,0.376471
HF_Fallof = 0.44133
HF_Const = 0
HF_Intensity = 0.11927
HF_Anisotropy = 0.63
HF_CastShadow = true
HF_Dir = 0,0,1
HF_Offset = 0
HF_Color = 0.619608,0.780392,1,0
Iterations = 15
Size = 1
RotAngle = 59.9994
HF_Scatter = 4.955
#endpreset

#preset Noname
FOV = 0.4
Eye = 12.5569,7.81196,9.12578
Target = 4.94214,2.91194,4.88268
Up = -0.366011,-0.215073,0.905417
FocalPlane = 5.80584
Aperture = 0.01807
InFocusAWidth = 0.64286
ApertureNbrSides = 5 NotLocked
ApertureRot = 0
ApStarShaped = false NotLocked
Gamma = 1
ToneMapping = 2
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Bloom = false
BloomIntensity = 0.05556
BloomPow = 1.236
BloomTaps = 10
Detail = -3
DetailAO = -0.9506
FudgeFactor = 1
MaxRaySteps = 243
MaxDistance = 85.11
Dither = 0.5102
NormalBackStep = 1
AO = 0,0,0,1
AoCorrect = 0
Specular = 1
SpecularExp = 41.665
CamLight = 1,1,1,1
CamLightMin = 0.79518
Glow = 1,1,1,0
GlowMax = 20
Reflection = 0.27848
ReflectionsNumber = 0 Locked
SpotGlow = false
SpotLight = 1,0.956863,0.768627,10
LightPos = -2.562,0.4132,8.1818
LightSize = 0.14118
LightFallOff = 0.78632
LightGlowRad = 0.5769
LightGlowExp = 1.519
HardShadow = 1 Locked
ShadowSoft = 0
BaseColor = 0.796078,0.54902,0.372549
OrbitStrength = 0
X = 0.5,0.6,0.6,0.7
Y = 1,0.6,0,0.4
Z = 0.8,0.78,1,0.5
R = 0.4,0.7,1,0.12
BackgroundColor = 0.576471,0.780392,0.996078
GradientBackground = 0.3
CycleColors = false
Cycles = 1.1
EnableFloor = true
FloorNormal = 0,0,1
FloorHeight = -1
FloorColor = 0.313725,0.529412,0.376471
HF_Const = 0
HF_Intensity = 0.23077
HF_Dir = 0,0,1
HF_Offset = 0
HF_Color = 0.619608,0.780392,1,0.62265
HF_Scatter = 10
HF_Anisotropy = 0.35714
HF_FogIter = 1
HF_CastShadow = true
CloudScale = 1
CloudFlatness = 0
CloudTops = 1
CloudBase = -1
CloudDensity = 1
CloudRoughness = 1
CloudContrast = 1
CloudColor = 0.65,0.68,0.7
SunLightColor = 0.7,0.5,0.3
Iterations = 3
Size = 1
RotAngle = 64.1376
HF_Fallof = 0.84377
#endpreset
