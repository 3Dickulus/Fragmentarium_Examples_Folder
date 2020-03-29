#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#define float3 vec3
#define float4 vec4

uniform int maxSteps; slider[2,3,20]
uniform float minX; slider[-5,0,5]
uniform float minY; slider[-5,0,5]
uniform float minZ; slider[-5,0,5]
uniform float minW; slider[-5,0,5]
uniform float maxX; slider[-5,2,5]
uniform float maxY; slider[-5,2,5]
uniform float maxZ; slider[-5,2,5]
uniform float maxW; slider[-5,2,5]
uniform float pScale; slider[1,3,20]
uniform float pShape; slider[-10,0,10]

uniform bool doInversion; checkbox[true]
uniform float invX; slider[-5,0,5]
uniform float invY; slider[-5,0,5]
uniform float invZ; slider[-5,0,5]
uniform float invRadius; slider[0.1,4,10]
uniform float invAngle; slider[-10,1,10]

float sdSponge(float3 z) {
    z *= pShape;

    for (int i=0; i < 4; i++) {
        z = abs(z);
        z.xy = (z.x < z.y) ? z.yx : z.xy;
        z.xz = (z.x < z.z) ? z.zx : z.xz;
        z.zy = (z.y < z.z) ? z.yz : z.zy;
        z = z * 3.0 - 2.0;
        z.z += (z.z < -1.0) ? 2.0 : 0.0;
    }

    z = abs(z) - float3(1.0);
    float dis = min(max(z.x, max(z.y, z.z)), 0.0) + length(max(z, 0.0));
    return dis * 0.2 * pow(3.0, -3.0);
}

float DE_SPONGE(float3 pos) {
    float k, r2;
    float scale = 1.0;
		 float3 pmin = float3(minX,minY,minZ);
		 float3 pmax = float3(maxX,maxY,maxZ);

    for (int i=0; i < maxSteps; i++) {
        pos = 2.0 * clamp(pos, pmin, pmax) - pos;
        r2 = dot(pos, pos);
        k = max(minW / r2, 1.0);
        pos *= k;
        scale *= k;
    }

    pos /= scale;

    float scl = maxW * pScale;
    pos *= scl;
    return float(0.1 * sdSponge(pos) / scl);
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
		
		float de = DE_SPONGE(pos);
		
		de = r2 * de / (invRadius * invRadius + r * de);
		return de;
	}
	
	return DE_SPONGE(pos);
}



#preset Default

FOV = 0.674698796
Eye = -13.1355932,-8.47457619,16.5254238
Target = 1.61040797,-2.05131981,2.06312083
Up = 0.012706883,-0.128252185,-0.044005506
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
AntiAliasScale = 0
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
maxSteps = 3
minX = -0.8064072
minY = -0.74000216
minZ = -1.0899884
minW = 1.2787694
maxX = 0.26409245
maxY = -0.76119435
maxZ = 0.2899983
maxW= 0.27301705
pScale = 6
pShape= -6 

doInversion = true
invX =  0.35200006
invY = 0.009999977
invZ =  -0.092
invRadius =  1.0600003
invAngle =  -0.019999992 

#endpreset


