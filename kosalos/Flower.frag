#define providesInit

#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#define float3 vec3
#define float4 vec4

#group Flower

uniform int MaxSteps; slider[2,3,30]
uniform float Scale; slider[0.5,1,3]
uniform float OffsetX; slider[-15,0,15]
uniform float OffsetY; slider[-15,0,15]
uniform float OffsetZ; slider[-15,0,15]
uniform bool doInversion; checkbox[true]
uniform float invX; slider[-5,0,5]
uniform float invY; slider[-5,0,5]
uniform float invZ; slider[-5,0,5]
uniform float invRadius; slider[0.1,4,10]
uniform float invAngle; slider[-10,1,10]

//-------------------------------------------

float4 offset;

void init() {
    offset = float4(OffsetX,OffsetY,OffsetZ,1);
}

//-------------------------------------------
// FlowerHive: https://www.shadertoy.com/view/lt3Gz8

float DE_FLOWER(float3 pos) {
    float4 q = float4(pos, 1);
    
    for(int i = 0; i < MaxSteps; ++i) {
        q.xyz = abs(q.xyz);
        float r = dot(q.xyz, q.xyz);
        q /= clamp(r, 0.0, Scale);
        
        q = 2.0 * q - offset;

 	       orbitTrap = min(orbitTrap, abs(q));
    }
    
    return (length(q.xy)/q.w - 0.003); 
}

float DE(float3 pos) {
	if(doInversion) {
		float3 invCenter = float3(invX,invY,invZ);
		pos = pos - invCenter;
		float r = length(pos);
		float r2 = r*r;
		pos = (invRadius * invRadius / r2 ) * pos + invCenter;
		
		float an = atan(pos.y,pos.x) + invAngle;
		float ra = sqrt(pos.y * pos.y + pos.x * pos.x);
		pos.x = cos(an)*ra;
		pos.y = sin(an)*ra;
		
		float de = DE_FLOWER(pos);
		
		de = r2 * de / (invRadius * invRadius + r * de);
		return de;
	}
	
	return DE_FLOWER(pos);
}


#preset Default

FOV = 0.490883591
Eye = -39.889773,8.2527451,-19.2842066
Target = -17.3525051,2.41305077,-14.6514609
Up = -0.01874303,-0.119443192,-0.059380563
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Stereo = 0
EyeSeparation = 0.51020408
ProjectionPlane = 165.441177
AnaglyphLeft = 1,0,0
AnaglyphRight = 0,1,1
Gamma = 0.861581923
ToneMapping = 1
Exposure = 0.461870503
Brightness = 2.94721408
Contrast = 1.27492878
AvgLumin = 0.5,0.5,0.5
Saturation = 1
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0.270916335
GaussianWeight = 3.515625
AntiAliasScale = 0
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -3.46592489
DetailAO = -6.59479015
FudgeFactor = 0.034638554
MaxDistance = 681.458004
MaxRaySteps = 637
Dither = 1 Locked
NormalBackStep = 0 NotLocked
AO = 0,0,0,0.273913044
Specular = 0.402002862
SpecularExp = 24.1057543
SpecularMax = 72.03125
SpotLight = 1,1,1,0.558730159
SpotLightDir = -0.302891932,0.266362254
CamLight = 1,1,1,0.336507937
CamLightMin = 0.644916541
Glow = 1,1,1,0.133928572
GlowMax = 573
Fog = 0
HardShadow = 0.550680787 NotLocked
ShadowSoft = 5.92705168
QualityShadows = false
Reflection = 0 NotLocked
DebugSun = false NotLocked
BaseColor = 1,0.51372549,0.666666667
OrbitStrength = 0.173312884
X = 1,1,0,0.154727794
Y = 1,0.6,0,-0.169054441
Z = 0.333333333,1,1,-0.10888252
R = 0.4,0.7,1,0.24533716
BackgroundColor = 0,0,0
GradientBackground = 0
CycleColors = false
Cycles = 0.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
MaxSteps = 4
Scale = 0.958276333
OffsetX = 1.06060607
OffsetY = 7.55411256
OffsetZ = 5.34632035
doInversion = true
invX = 0.061391545
invY = -3.74488404
invZ = -1.93042291
invRadius = 4.23470589
invAngle = -0.07342143

#endpreset


