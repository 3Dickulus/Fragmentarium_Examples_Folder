//
#info https://fractalforums.org/code-snippets-fragments/74/quaternion-julia-plus-spherical-inversion-plus-iteration-tweak/3050
//
#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#define float3 vec3
#define float4 vec4


#group QuatJulia
uniform int maxSteps; slider[2,9,20]
uniform bool Julia; checkbox[true]
uniform float seedW; slider[-1.5,0,1.5]

uniform float cx; slider[-5,-0.3,5]
uniform float cy; slider[-5,-.1,5]
uniform float cz; slider[-5,0,5]
uniform float cw; slider[-5,-0.2,5]

uniform float radialAngle; slider[0,0.09,5]
uniform bool doInversion; checkbox[true]

uniform float invX; slider[-5,.612,5]
uniform float invY; slider[-5,.381,5]
uniform float invZ; slider[-5,0.786,5]
uniform float invRadius; slider[0.1,.82,10]
uniform float invAngle; slider[-10,-2.04,10]




float DE_QUATJULIA(float3 zin) {

  // float4 c = 0.5 * float4(cx,cy,cz,cw);
		float4 c = float4(cx,cy,cz,cw);
		float4 op = float4(zin,0.0);
		float4 nz;
		float md2 = 1.0;
		float4 z = float4(zin,seedW);
		float mz2 = dot(z,z);
		float4 oldZ = z;
		float den = 2.0 + radialAngle*100.0;

		float r = length(z);
		float dr = 1.0;
   
    for(int i=0;i < maxSteps; ++i) {
				//dr = dr * 2.0 * r;
				md2 *= 4.0 * mz2;
				nz.x = z.x * z.x - dot(z.yzw,z.yzw);
				nz.yzw = 2.0 * z.x * z.yzw;
       if (Julia) z = nz+c;
			else z = nz+op.xyzw;

     
        z += (z - oldZ) / den; // <- added
        oldZ = z;
       
        mz2 = dot(z,z);
			r = sqrt(mz2);
        if(mz2 > 12.0) break;
    }
  //return  0.5*log(r)*r/dr;
    return 0.3 * sqrt(mz2/md2) * log(mz2);
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

        float de = DE_QUATJULIA(pos);

        de = r2 * de / (invRadius * invRadius + r * de);
        return de;
    }
   
    return DE_QUATJULIA(pos);
}

#preset Default
FOV = 0.674698796
Eye = -0.311892691,-1.34817709,1.29965024
Target = -3.53037014,14.7463959,-12.7881729
Up = 0.032289866,-0.083424791,-0.102685175
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
Detail = -2.54733727
DetailAO = -5.73366834
FudgeFactor = 0.628289474
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
X = 0.5,0.600000024,0.600000024,-0.582524272
Y = 1,0.600000024,0,-0.048543688
Z = 0.800000012,0.779999971,1,0.38596
R = 0.400000006,0.699999988,1,0.1914894
BackgroundColor = 0,0,0
GradientBackground = 0
CycleColors = true
Cycles = 2.707692
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
maxSteps = 9
Julia = true
seedW = -0.074074072
cx = -0.327635324
cy = 0.21367522
cz = -0.669515664
cw = -0.2
radialAngle = 0.09
doInversion = true
invX = 0.612
invY = 0.381
invZ = 0.786
invRadius = 0.82
invAngle = -2.04
#endpreset
