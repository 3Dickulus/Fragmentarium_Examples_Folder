// https://www.shadertoy.com/view/4sX3R2
#info https://fractalforums.org/code-snippets-fragments/74/monster/3064/msg16609

#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#define float3 vec3
#define float4 vec4
#define float4x4 mat4

uniform int maxSteps; slider[3,5,30]
uniform float cx; slider[-10,0,20]
uniform float cy; slider[2,4,7]
uniform float cz; slider[0.45,1,2.8]
uniform float cw; slider[0.1,2,3]

uniform bool doInversion; checkbox[true]
uniform float invX; slider[-5,-0.96,5]
uniform float invY; slider[-5,-0.52,5]
uniform float invZ; slider[-5,-2.304,5]
uniform float invRadius; slider[0.1,4.01,10]
uniform float invAngle; slider[-10,1.34,10]

float4x4 rotationMat(float3 xyz )
{
    float3 si = sin(xyz);
    float3 co = cos(xyz);

    return float4x4( co.y*co.z, co.y*si.z, -si.y, 0.0,
                    si.x*si.y*co.z-co.x*si.z, si.x*si.y*si.z+co.x*co.z, si.x*co.y,  0.0,
                    co.x*si.y*co.z+si.x*si.z, co.x*si.y*si.z-si.x*co.z, co.x*co.y,  0.0,
                    0.0, 0.0,                      0.0,        1.0 );
} 

float DE_MONSTER(float3 pos) {
    float k = 1.0;
    float m = 1e10;
    float r,s = cw;
    float time1 = cx;
		 float4x4 mm = rotationMat( float3(cz,0.1,cy) 
					+ 0.15*sin(0.1*float3(0.40,0.30,0.61)*cx) 
       + 0.15*sin(0.1*float3(0.11,0.53,0.48)*cx));

    mm[0].xyz *= s;
    mm[1].xyz *= s;
    mm[2].xyz *= s;
    mm[3].xyz = float3( 0.15, 0.05, -0.07 )
        + 0.05*sin(float3(0.0,1.0,2.0) + 0.2*float3(0.31,0.24,0.42)*cx);
 
    for( int i=0; i < maxSteps; i++ ) {
        m = min( m, dot(pos,pos) /(k*k) );
        pos = (mm * float4((abs(pos)),1.0)).xyz;

        r = dot(pos,pos);
        if(r > 1.0) break;

        k *= cw;
    }

    float d = (length(pos)-0.5)/k;
    return d * 0.25;
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
		
		float de = DE_MONSTER(pos);
		
		de = r2 * de / (invRadius * invRadius + r * de);
		return de;
	}
	
	return DE_MONSTER(pos);
}

#preset Default
FOV = 0.27309237
Eye = 2.65129914,0.668124595,-0.499011218
Target = 1.68779935,0.408271085,-0.432304279
Up = 0.02396734,-0.112905131,-0.093637458
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
doInversion = true
invX = 0.201939056
invY = 0.160744805
invZ = 0.171504943
invRadius = 0.415297499
invAngle = 10
maxSteps = 23
cz = 2.1299346
cy = 3.64380501
cw = 1.48358779
cx = 9.39759038
#endpreset


