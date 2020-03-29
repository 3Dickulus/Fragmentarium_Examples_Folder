#version 410 compatibility
#info Kleinian groups
#info Original idea and code by Jos Leys (Dec 2016)
#info Some cosmetic modifications by Na�t Merzouk Abdelaziz (A.k.a. Knighty)
#info liscence:  Ask Jos Leys ;-)

#info heavily frobbled by pupukuusikko
#info resulting in continuous 3d kleinian-type fractal
#info changes:
#info 	-changed warp to boxfold
#info 	-made  separation line stuff optional
#info 	-added z-axis rotation

#include "MathUtils.frag"
//#include "Fast-Raytracer.frag"
//#define KN_VOLUMETRIC
#define WANG_HASH
#include "DE-Kn2cr11.frag"

#group Kleinian_test
uniform int Box_Iterations;  slider[1,50,100]
//Trace of the transformation a
uniform float KleinR;  slider[1.0,2.0,3.0]
uniform float KleinI;  slider[-0.5,0.0,0.5]
uniform float KleinZ;  slider[-0.2,0.0,0.2]
//To really give a kleinian group they must be of the form cos(PI/n) if <1 and any value if >=1
uniform float box_size_z;  slider[0.0,0.5,1.0]
uniform float box_size_x;  slider[0.0,0.5,1.0]

//WIP: Help get better DE?
uniform int Final_Iterations;  slider[0,5,20]
//Want do show the balls
uniform bool ShowBalls; checkbox[true]
//4 generators or 3? apply y translation
uniform bool FourGen; checkbox[false]
uniform bool boxfold; checkbox[true]
uniform bool separation_line; checkbox[false]

uniform float fold;  slider[-1.,0.25,2.]

//The DE is wilde. It needs some clamping
uniform float Clamp_y;  slider[0.01,1.0,10.0]
uniform float Clamp_DF;    slider[0.0,1.0,10.0]

#group SphInv

//Want do do an inversion
uniform bool DoInversion; checkbox[false]
//Inversion center
uniform vec3 InvCenter; slider[(-1,-1,-1),(0,0,0),(1,1,1)]
//Inversion radius squared
uniform float InvRadius;  slider[0.01,1,2]
//Recenter
uniform vec3 ReCenter; slider[(-5,-5,-5),(0,0,0),(5,5,5)]

float dot2(vec3 z){ return dot(z,z);}

vec3 wrap(vec3 x, vec3 a, vec3 s){
	if (boxfold){
	
		x.y= clamp(x.y, -2.*fold, 2.*fold)*2.  - x.y;
		x.xz= clamp(x.xz, -box_size_x*fold,box_size_z*fold)*2.  - x.xz;
		return x;
	}
	else { 
		x -= s; 
		return (x-a*floor(x/a)) + s;
	}
}
	
vec2 wrap(vec2 x, vec2 a, vec2 s){
	if (boxfold){
		return clamp(x, -box_size_x*fold, box_size_z*fold)*2. - x;
	}
	else { 
		x -= s; 
		return (x-a*floor(x/a)) + s;
	}
}

void TransA(inout vec3 z, inout float DF, float a, float b, float c){
	float iR = 1. / dot2(z);
	z *= -iR;
	z.x =-b - z.x; 
	z.y = a + z.y;
	z.z = c-z.z;
	
	DF *= iR;//max(1.,iR);
}

void TransAInv(inout vec3 z, inout float DF, float a, float b){
	float iR = 1. / dot2(z + vec3(b,-a,0.));
	z.x += b; z.y = a - z.y; 
	z *= iR;
	DF *= iR;//max(1.,iR);
}

float  JosKleinian(vec3 z)
{
	vec3 lz=z+vec3(1.), llz=z+vec3(-1.);
	float DE=1e10;
	float DF = 1.0;
	
	float a = KleinR, b = KleinI,c=KleinZ;
	
	float f = sign(b) ;     
	for (int i = 0; i < Box_Iterations ; i++) 
	{
		//if(z.y<0. || z.y>a) break;
	
		z.x=z.x+b/a*z.y;
		//z.z = z.z-c/a*z.y;
		
		if (FourGen)
				z = wrap(z, vec3(2. * box_size_x, a, 2. * box_size_z), vec3(- box_size_x,0., - box_size_z));
			else
			z.xz = wrap(z.xz, vec2(2. * box_size_x, 2. * box_size_z), vec2(- box_size_x, - box_size_z));
		
		z.x=z.x-b/a*z.y;
		
		//z.z = z.z+c/a*z.y;
		if (separation_line) {
			// If above the separation line, rotate by 180� about (-b/2, a/2)
			// pupukuusikko: KleinZ not taken into account in in separation line calc	
			if  (z.y >= a * (0.5+  f * 0.25*sign(z.x + b * 0.5)* (1. - exp( - 3.2 * abs(z.x + b * 0.5)))))	
		
				z = vec3(-b, a, c) - z;
				//z.xy = vec2(-b, a) - z.xy;//
		}	
		orbitTrap = min(orbitTrap, abs(vec4(z,dot(z,z))));//For colouring
		
		//Apply transformation a
		TransA(z, DF, a, b,c);
		
		//If the iterated points enters a 2-cycle , bail out.
		if(dot2(z-llz) < 1e-12) {
#if 0
			orbitTrap =vec4(1./float(i),0.,0.,0.);
#endif
			break;
		}
		//Store pr�vious iterates
		llz=lz; lz=z;
	}
	
	//WIP: Push the iterated point left or right depending on the sign of KleinI
	for (int i=0;i<Final_Iterations;i++){
		float y = ShowBalls ? min(z.y, a-z.y) : z.y;
		DE=min(DE,min(y,Clamp_y)/max(DF,Clamp_DF));
		TransA(z, DF, a, b,c);
	}
	float y = ShowBalls ? min(z.y, a-z.y) : z.y;
	DE=min(DE,min(y,Clamp_y)/max(DF,Clamp_DF));

	return DE;
}

float DE(vec3 p) {
	if(DoInversion){
		p=p-InvCenter-ReCenter;
		float r=length(p);
		float r2=r*r;
		p=(InvRadius * InvRadius/r2)*p+InvCenter;
		float de=JosKleinian(p);
		de=r2*de/(InvRadius * InvRadius+r*de);
		return de;
	}
	else return JosKleinian(p);
}
























#preset default
FOV = 0.71698
Eye = -0.721354,0.696069,0.904053
Target = -0.500527,0.829196,-0.118239
Up = -0.140264,0.982869,0.119561
FocalPlane = 1
Aperture = 0
InFocusAWidth = 0
ApertureNbrSides = 5
ApertureRot = 0
ApStarShaped = false
Gamma = 2
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 1.5
Bloom = false
BloomIntensity = 0.25
BloomPow = 2
BloomTaps = 4
Detail = -3.5
DetailAO = -1.5
FudgeFactor = 0.25
MaxRaySteps = 500
MaxDistance = 3
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
AoCorrect = 0
Specular = 0.4
SpecularExp = 16
CamLight = 1,1,1,1.58824
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 0
Reflection = 1,1,1
ReflectionsNumber = 0
SpotGlow = true
SpotLight = 1,1,1,7.75
LightPos = -0.4348,2.75,0.9166
LightSize = 0.02
LightFallOff = 0.19718
LightGlowRad = 0.7353
LightGlowExp = 2.7143
HardShadow = 1 Locked
ShadowSoft = 8.5714
BaseColor = 0.552941,0.552941,0.552941
OrbitStrength = 0.98182
X = 0,1,0.164706,0
Y = 1,0.533333,0,1
Z = 0.603922,0.164706,0.776471,1
R = 0.262745,0.482353,1,-0.025
BackgroundColor = 0.270588,0.403922,0.6
GradientBackground = 0
CycleColors = true
Cycles = 0.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
HF_Fallof = 0.85566
HF_Const = 0.05063
HF_Intensity = 0.125
HF_Dir = 0,0,1
HF_Offset = 0.4878
HF_Color = 0.670588,0.807843,0.890196,1
HF_Scatter = 10
HF_Anisotropy = 0.847059,0.847059,0.847059
HF_FogIter = 1
HF_CastShadow = false
CloudScale = 0.1
CloudFlatness = 0
CloudTops = 1
CloudBase = -1
CloudDensity = 1
CloudRoughness = 1
CloudContrast = 1
CloudColor = 0.65,0.68,0.7
SunLightColor = 0.7,0.5,0.3
WindDir = 0,0,1
WindSpeed = 1
Box_Iterations = 18
KleinR = 1.95936
KleinI = -0.04717
KleinZ = 0
box_size_z = 1
box_size_x = 1
Final_Iterations = 1
ShowBalls = false
FourGen = true
boxfold = true
fold = 0.51515
Clamp_y = 0.08772
Clamp_DF = 0
DoInversion = false
InvCenter = 0.27576,0.52804,0
InvRadius = 0.19853
ReCenter = 0,0,0
separation_line = false
#endpreset

#preset invspirals
FOV = 0.71698
Eye = -0.155432,-0.0438824,0.378368
Target = 0.668942,0.587132,0.194202
Up = 0.592657,-0.793247,-0.139705
FocalPlane = 1
Aperture = 0
InFocusAWidth = 0
ApertureNbrSides = 5
ApertureRot = 0
ApStarShaped = false
Gamma = 2
ToneMapping = 5
Exposure = 1.57896
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 1.5
Bloom = false
BloomIntensity = 0.25
BloomPow = 2
BloomTaps = 4
Detail = -4.97098
DetailAO = -0.73682
FudgeFactor = 0.73684
MaxRaySteps = 870
MaxDistance = 23.81
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
AoCorrect = 0
Specular = 0.4
SpecularExp = 16
CamLight = 1,1,1,2
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 0
Reflection = 1,1,1
ReflectionsNumber = 0
SpotGlow = true
SpotLight = 1,1,1,5.082
LightPos = -0.4348,2.75,0.9166
LightSize = 0.02
LightFallOff = 0.19718
LightGlowRad = 0.7353
LightGlowExp = 2.7143
HardShadow = 1 Locked
ShadowSoft = 8.5714
BaseColor = 0.552941,0.552941,0.552941
OrbitStrength = 0.83333
X = 0,1,0.164706,0
Y = 1,0.533333,0,1
Z = 0.603922,0.164706,0.776471,1
R = 0.262745,0.482353,1,0.92942
BackgroundColor = 0.270588,0.403922,0.6
GradientBackground = 0
CycleColors = true
Cycles = 3.16673
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
HF_Fallof = 0.85566
HF_Const = 0.05063
HF_Intensity = 0.125
HF_Dir = -0.01176,0,1
HF_Offset = -6.0656
HF_Color = 0.670588,0.807843,0.890196,1
HF_Scatter = 10
HF_Anisotropy = 0.847059,0.847059,0.847059
HF_FogIter = 1
HF_CastShadow = false
CloudScale = 0.1
CloudFlatness = 0
CloudTops = 1
CloudBase = -1
CloudDensity = 1
CloudRoughness = 1
CloudContrast = 1
CloudColor = 0.65,0.68,0.7
SunLightColor = 0.7,0.5,0.3
WindDir = 0,0,1
WindSpeed = 1
Box_Iterations = 35
KleinR = 1.97826
KleinI = 0.02174
KleinZ = -0.00298
box_size_z = 1
box_size_x = 1
Final_Iterations = 0
ShowBalls = true
FourGen = true
boxfold = true
fold = 0.51947
Clamp_y = 0.01
Clamp_DF = 0
DoInversion = true
InvCenter = 0.2647,0.44118,0.38236
InvRadius = 0.19853
ReCenter = 0,0,0
separation_line = false
#endpreset


