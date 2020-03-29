#define providesInit

#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#define float3 vec3
#define float4 vec4

#group Rontgen

uniform int MaxSteps; slider[1,3,15]
uniform float kX; slider[-10,0,10]
uniform float kY; slider[-10,0,10]
uniform float kZ; slider[-10,0,10]
uniform float Angle; slider[-4,0,4]

uniform bool doInversion; checkbox[true]
uniform float invX; slider[-5,0,5]
uniform float invY; slider[-5,0,5]
uniform float invZ; slider[-5,0,5]
uniform float invRadius; slider[0.1,4,10]
uniform float invAngle; slider[-10,1,10]

//-------------------------------------------

float3 param;

void init() {
   param = float3(kX,kY,kZ);
}

float3 rotatePosition(float3 pos, int axis, float angle) {
   float ss = sin(angle);
   float cc = cos(angle);
   float qt;
   
   if(axis == 0) {
      qt = pos.x;
      pos.x = pos.x * cc - pos.y * ss;
      pos.y =    qt * ss + pos.y * cc;
   }
   
   if(axis == 1) {
      qt = pos.x;
      pos.x = pos.x * cc - pos.z * ss;
      pos.z =    qt * ss + pos.z * cc;
   }
   
   if(axis == 2) {
      qt = pos.y;
      pos.y = pos.y * cc - pos.z * ss;
      pos.z =    qt * ss + pos.z * cc;
   }
   
   return pos;
}

//-------------------------------------------
// Kali Rontgen : https://www.shadertoy.com/view/XlXcRj

float DE_KALI_RONTGEN(float3 pos) {
    float d = 10000.;
    float4 p = float4(pos, 1.);
    
    for(int i = 0; i < MaxSteps; ++i) {
        p = abs(p) / dot(p.xyz, p.xyz);
        
        d = min(d, (length(p.xy - float2(0,.01))-.03) / p.w);
        if(d > 4) break;
        
        p.xyz -= param;
        p.xyz = rotatePosition(p.xyz,1,Angle);
        
        orbitTrap = min(orbitTrap, abs(p));
    }

    return d;
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
		
		float de = DE_KALI_RONTGEN(pos);
		
		de = r2 * de / (invRadius * invRadius + r * de);
		return de;
	}
	
	return DE_KALI_RONTGEN(pos);
}


#preset Default

FOV = 0.674698796
Eye = -1.75417657,-0.909712458,1.8937907
Target = 11.3075963,6.70213379,-13.575885
Up = -0.012690876,-0.117111612,-0.068340213
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Stereo = 0
EyeSeparation = 0.51020408
ProjectionPlane = 165.441177
AnaglyphLeft = 1,0,0
AnaglyphRight = 0,1,1
Gamma = 1.05839416
ToneMapping = 1
Exposure = 0.521495327
Brightness = 2.1072797
Contrast = 2.5092251
AvgLumin = 0.5,0.5,0.5
Saturation = 1
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0.427101201
GaussianWeight = 0
AntiAliasScale = 0
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 0
Detail = -2.52951699
DetailAO = -6.76271186
FudgeFactor = 0.551587302
MaxDistance = 63.6942685
MaxRaySteps = 263
Dither = 1 Locked
NormalBackStep = 0 NotLocked
AO = 0,0,0,0.143426295
Specular = 0
SpecularExp = 0
SpecularMax = 4.86725662
SpotLight = 1,1,1,0.583710408
SpotLightDir = -0.663113005,-0.074626865
CamLight = 1,1,1,0.692307694
CamLightMin = 0.605095542
Glow = 1,1,1,0
GlowMax = 0
Fog = 0
HardShadow = 0.190274841 NotLocked
ShadowSoft = 0
QualityShadows = true
Reflection = 0 NotLocked
DebugSun = false NotLocked
BaseColor = 1,1,1
OrbitStrength = 0.593495935
X = 1,1,0,0.795539035
Y = 1,0.6,0,-0.033457248
Z = 1,0.188235294,0.690196078,0.215613384
R = 0.4,0.7,1,0.50837989
BackgroundColor = 0,0,0
GradientBackground = 0
CycleColors = true
Cycles = 2.14537202
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1

MaxSteps = 5
kX = 0.500863567
kY = 1.2953368
kZ = 0.915371347
Angle = -1.1234347
doInversion = false
invX = -2.62652705
invY = -4.44153578
invZ = -4.21465969
invRadius = 4.555
invAngle = -1.17082533

#endpreset


