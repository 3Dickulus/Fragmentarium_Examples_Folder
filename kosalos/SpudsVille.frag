#info https://github.com/3Dickulus/FragM/blob/master/Fragmentarium-Source/Examples/Experimental/Spudsville2.frag
#include "MathUtils.frag"
#include "DE-Raytracer.frag"
#group Params

#define float3 vec3
#define float4 vec4
#define float4x4 mat4

uniform int maxSteps; slider[3,5,30]
uniform float power; slider[1.5,4,12]
uniform float MinRad; slider[-5,0,5]
uniform float FixedRad; slider[-5,0,5]
uniform float FoldLimit; slider[-5,0,5]
uniform float FoldLimit2; slider[-5,0,5]
uniform float ZMUL; slider[-10,0,10]
uniform float Scale; slider[-5,0,5]
uniform float Scale2; slider[-5,0,5]

uniform bool doInversion; checkbox[true]
uniform float invX; slider[-5,-0.96,5]
uniform float invY; slider[-5,-0.52,5]
uniform float invZ; slider[-5,-2.304,5]
uniform float invRadius; slider[0.1,4.01,10]
uniform float invAngle; slider[-10,1.34,10]

void spudsSphereFold(inout float3 z,inout float dz) {
    float r2 = dot(z,z);

    if (r2< MinRad) {
        float temp = (FixedRad / MinRad);
        z *= temp;
        dz *= temp;
    } else if (r2 < FixedRad) {
        float temp = FixedRad /r2;
        z *= temp;
        dz *= temp;
    }
}

void spudsBoxFold(inout float3 z,inout float dz) {
    z = clamp(z, -FoldLimit, FoldLimit) * 2.0 - z;
}

void spudsBoxFold3(inout float3 z,inout float dz) {
    z = clamp(z, -FoldLimit2,FoldLimit2) * 2.0 - z;
}

void spudsPowN2(inout float3 z, float zr0, inout float dr) {
    float zo0 = asin( z.z/zr0 );
    float zi0 = atan( z.y,z.x );
    float zr = pow( zr0, power-1.0 );
    float zo = zo0 * power;
    float zi = zi0 * power;
    dr = zr*dr * power * abs(length(float3(1.0,1.0,ZMUL)/sqrt(3.0))) + 1.0;
    zr *= zr0;
    z = zr*float3( cos(zo)*cos(zi), cos(zo)*sin(zi), ZMUL * sin(zo) );
}

float DE_SPUDS(float3 pos) {
	orbitTrap = vec4(1e5);
    int n = 0;
    float dz = 1.0;
    float r = length(pos);

    while(r < 10.0 && n < maxSteps) {
        if (n < 6) {
            spudsBoxFold(pos,dz);
            spudsSphereFold(pos,dz);
            pos *= Scale;
            dz *= abs(Scale);
        } else {
            spudsBoxFold3(pos,dz);
            r = length(pos);
            spudsPowN2(pos,r,dz);
            pos *= Scale2;
            dz *= abs(Scale2);
        }

        r = length(pos);
        n++;
orbitTrap = min(orbitTrap, abs(vec4(pos,r*r)));
    }

    return r * log(r) / dz;
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
		
		float de = DE_SPUDS(pos);
		
		de = r2 * de / (invRadius * invRadius + r * de);
		return de;
	}
	
	return DE_SPUDS(pos);
}

#preset Default
FOV = 0.129341317
Eye = 16.2990197,-43.6066286,10.1715687
Target = 14.297992,-38.0919227,8.17023812
Up = 0.057134572,-0.03925596,0.004149462
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Gamma = 0.502994014
ToneMapping = 2
Exposure = 0.827586207
Brightness = 1
Contrast = 1.16666667
AvgLumin = 0.5,0.5,0.5
Saturation = 1
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0.270916335
GaussianWeight = 3.515625
AntiAliasScale = 0
DepthToAlpha = false
Detail = -4.39298669
DetailAO = -2.85247883
FudgeFactor = 0.051497006
Dither = 1
NormalBackStep = 9.51456311 NotLocked
AO = 0,0,0,0
SpecularExp = 76.0147602
CamLight = 1,1,1,1.91616767
CamLightMin = 0.005988024
Glow = 1,1,1,0
GlowMax = 0
Fog = 0
Reflection = 0 NotLocked
BaseColor = 1,0.235294118,0.823529412
OrbitStrength = 0.961676648
X = 0.5,0.6,0.6,0.576783556
Y = 1,0.6,0,0.760580413
Z = 0.8,0.78,1,-0.339782346
R = 0.4,0.7,1,0.366384523
BackgroundColor = 0,0,0
GradientBackground = 0
CycleColors = true
Cycles = 2.707692
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
ShowDepth = false
DepthMagnitude = 1
MaxDistance = 87.2817962
MaxRaySteps = 896
Specular = 0.38647343
SpecularMax = 80.0738008
SpotLight = 1,1,1,0.88982036
SpotLightDir = 0.146311972,0.100000001
HardShadow = 0.706586827 NotLocked
ShadowSoft = 3.32524272
QualityShadows = false
DebugSun = false NotLocked
maxSteps = 11
power = 4.48179612
MinRad = -0.405078596
FixedRad = -0.320435306
FoldLimit = 1.03385733
FoldLimit2 = 2.37605805
ZMUL = 1.32352943
Scale = -1.28778718
Scale2 = 2.35187425
doInversion = true
invX = 0.09068924
invY = 0.054413546
invZ = -1.28778718
invRadius = 1.93822816
invAngle = -3.33333332
#endpreset



#preset lagrande
FOV = 0.05256242
Eye = 2.10473862,-6.29115083,-0.288438924
Target = 1.65894,-5.39998,-0.44307
Up = -0.002685034,0.005952695,0.042047517
EquiRectangular = false
AutoFocus = false
FocalPlane = 0.53988
Aperture = 0.00013848
Gamma = 0.5
ToneMapping = 2
Exposure = 1
Brightness = 0.95938375
Contrast = 1.519945
AvgLumin = 0.5,0.5,0.5
Saturation = 1
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0.3
GaussianWeight = 2
AntiAliasScale = 1.5
DepthToAlpha = true
ShowDepth = false
DepthMagnitude = 1
Detail = -5
DetailAO = -3.76849312
FudgeFactor = 0.02945302
MaxDistance = 20
MaxRaySteps = 3296
Dither = 0
NormalBackStep = 1 NotLocked
AO = 0,0,0,0.52340426
Specular = 0.25306123
SpecularExp = 27.857143
SpecularMax = 80.0738008
SpotLight = 1,1,1,1
SpotLightDir = 0.01126762,-0.04507042
CamLight = 1,1,1,2
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 0
Fog = 0.3355177
HardShadow = 1 NotLocked
ShadowSoft = 20
QualityShadows = true
Reflection = 0 NotLocked
DebugSun = false NotLocked
BaseColor = 1,0.235294118,0.823529412
OrbitStrength = 0.37818697
X = 0.282352941,0.603921569,0.8,1
Y = 1,0.6,0,-0.30715286
Z = 0.980392157,0.380392157,1,-0.07584268
R = 0.384313725,1,0.694117647,0.00701264
BackgroundColor = 0.792156863,0.643137255,0.780392157
GradientBackground = 1.95488725
CycleColors = false
Cycles = 0.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
maxSteps = 12
power = 4.48179606
MinRad = 0
FixedRad = 0.0547946
FoldLimit = 1.0273973
FoldLimit2 = 2.3407203
ZMUL = 1.3243244
Scale = 1.2898937
Scale2 = -2.3252688
doInversion = false
invX = -2.3781291
invY = -1.7588932
invZ = -3.2058047
invRadius = 1.78423235
invAngle = -2.0827586
#endpreset
