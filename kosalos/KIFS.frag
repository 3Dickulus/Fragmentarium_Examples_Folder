#define providesInit

#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#define float3 vec3
#define float4 vec4

#group KIFS

uniform int MaxSteps; slider[2,3,8]
uniform float kX; slider[0.4,1,7]
uniform float kY; slider[0.9,1,7]
uniform float kZ; slider[0.9,1,6]

uniform bool doInversion; checkbox[true]
uniform float invX; slider[-5,0,5]
uniform float invY; slider[-5,0,5]
uniform float invZ; slider[-5,0,5]
uniform float invRadius; slider[0.1,4,10]
uniform float invAngle; slider[-10,1,10]

//-------------------------------------------

float3 offset;
float3 offset2;
float q;

void init() {
   offset = float3(kX,1.1,0.5);
   offset2 = offset * (kY - 1.0);
   q = offset.z * (kY - kZ);
}

//-------------------------------------------
// EvilRyu's KIFS : https://www.shadertoy.com/view/MdlSRM

float DE_KIFS(float3 pos) {
    float4 z = float4(pos,1.0);
    
    for(int n = 0; n < MaxSteps; ++n) {
        z = abs(z);
        if (z.x < z.y) z.xy = z.yx;
        if (z.x < z.z) z.xz = z.zx;
        if (z.y < z.z) z.yz = z.zy;

        z = z * kY;
        z.xyz -= offset2; 
        
        if(z.z < -0.5 * q)
            z.z += q;

        orbitTrap = min(orbitTrap, abs(z));
    }
    
    return(length(max(abs(z.xyz)-float3(1.0),0.0))-0.05)/z.w;
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
		
		float de = DE_KIFS(pos);
		
		de = r2 * de / (invRadius * invRadius + r * de);
		return de;
	}
	
	return DE_KIFS(pos);
}


#preset Default

FOV = 0.674698796
Eye = -1.87950974,-0.947743191,2.13134164
Target = -0.893371388,-7.94535229,-18.3117984
Up = -0.024495654,-0.127102775,0.042325173
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Stereo = 0
EyeSeparation = 0.51020408
ProjectionPlane = 165.441177
AnaglyphLeft = 1,0,0
AnaglyphRight = 0,1,1
Gamma = 1.33211679
ToneMapping = 1
Exposure = 0.515887851
Brightness = 1.97318008
Contrast = 1.94649447
AvgLumin = 0.5,0.5,0.5
Saturation = 1
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0.427101201
GaussianWeight = 0
AntiAliasScale = 0
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 0
Detail = -3.01788908
DetailAO = -5.53672315
FudgeFactor = 0.799603175
MaxDistance = 148.619958
MaxRaySteps = 333
Dither = 1 Locked
NormalBackStep = 0 NotLocked
AO = 0,0,0,0.266932271
Specular = 0
SpecularExp = 0
SpecularMax = 26.5486726
SpotLight = 1,1,1,0.506787331
SpotLightDir = -0.368869936,-0.074626865
CamLight = 1,1,1,0.606334843
CamLightMin = 0.605095542
Glow = 1,1,1,0
GlowMax = 0
Fog = 0
HardShadow = 0.357293869 NotLocked
ShadowSoft = 0.04255319
QualityShadows = true
Reflection = 0 NotLocked
DebugSun = false NotLocked
BaseColor = 1,1,1
OrbitStrength = 0.481707318
X = 1,1,0,0.795539035
Y = 1,0.6,0,-0.35315985
Z = 1,0.188235294,0.690196078,0.215613384
R = 0.4,0.7,1,0.50837989
BackgroundColor = 0,0,0
GradientBackground = 0
CycleColors = true
Cycles = 1.4441016
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
MaxSteps = 5
kX = 3.05986622
kY = 1.63444816
kZ = 3.569398
doInversion = true
invX = -3.69109947
invY = -4.23211169
invZ = -3.34205934
invRadius = 4.38365385
invAngle = -1.18198866

#endpreset


