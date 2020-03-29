// Write fragment code here...
// https://www.shadertoy.com/view/XdGXRV
#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#define float3 vec3
#define float4 vec4

#group Gold
uniform int maxSteps; slider[2,20,20]
uniform float cx; slider[-5,5.6,5]
uniform float cy; slider[-5,8.7,5]
uniform float cz; slider[-5,-3.65,5]
uniform float cw; slider[-5,0.09,5]
uniform float dx; slider[-5,8.7,5]
uniform float dy; slider[-5,-3.65,5]
uniform float dz; slider[-5,0.09,5]

uniform bool doInversion; checkbox[true]
uniform float invX; slider[-5,-0.96,5]
uniform float invY; slider[-5,-0.52,5]
uniform float invZ; slider[-5,-2.304,5]
uniform float invRadius; slider[0.1,4.01,10]
uniform float invAngle; slider[-10,1.34,10]

float DE_GOLD(float3 p) {
    p.xz = mod(p.xz + 1.0, 2.0) - 1.0;
    float4 q = float4(p, 1);
    float3 offset1 = float3(cx, cy, cz);
    float4 offset2 = float4(cw, dx, dy, dz);

    for(int n = 0; n < maxSteps; ++n) {
        q.xyz = abs(q.xyz) - offset1;
        q = 2.0*q/clamp(dot(q.xyz, q.xyz), 0.4, 1.0) - offset2;
    }

    return length(q.xyz)/q.w;
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
		
		float de = DE_GOLD(pos);
		
		de = r2 * de / (invRadius * invRadius + r * de);
		return de;
	}
	
	return DE_GOLD(pos);
}



#preset Default
FOV = 0.27309237
Eye = 14.9840619,3.88415515,-1.65545094
Target = -4.89266047,-1.72238921,-2.29804589
Up = 0.034225214,-0.110661458,-0.093148416
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Gamma = 1.19680851
ToneMapping = 2
Exposure = 0.827586207
Brightness = 1
Contrast = 1.16666667
AvgLumin = 0.5,0.5,0.5
Saturation = 1
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0.270916335
GaussianWeight = 3.515625
AntiAliasScale = 1.5329513
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -3.85462554
DetailAO = -5.73366834
FudgeFactor = 0.162790698
MaxDistance = 251.79856
MaxRaySteps = 441
Dither = 1
NormalBackStep = 1
AO = 0,0,0,0
Specular = 0.38647343
SpecularExp = 16.364
SpecularMax = 10
SpotLight = 1,1,1,0.492753624
SpotLightDir = 0.100000001,0.100000001
CamLight = 1,1,1,0.463768117
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 0
Fog = 0
HardShadow = 0.224852071
ShadowSoft = 20
QualityShadows = false
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 0
X = 0.5,0.6,0.6,-0.582524272
Y = 1,0.6,0,-0.048543688
Z = 0.8,0.78,1,0.38596
R = 0.4,0.7,1,0.1914894
BackgroundColor = 0,0,0
GradientBackground = 0
CycleColors = true
Cycles = 2.707692
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
maxSteps = 15
cx = -0.13238457
cy = 0.519100297
cz = 1.04258736
cw = 1
dx = 0
dy = 0.6
dz = 0
doInversion = true
invX = 0.103734443
invY = 0.121999979
invZ = -0.251999935
invRadius = 0.229999925
invAngle = -6.08465608
#endpreset


