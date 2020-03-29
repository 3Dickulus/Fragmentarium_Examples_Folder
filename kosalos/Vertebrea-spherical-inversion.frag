// https://fractalforums.org/code-snippets-fragments/74/apollonian-plus-spherical-inversion-plus-iteration-tweak/3049
#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#define float3 vec3
#define float4 vec4

uniform int maxSteps; slider[2,20,20]
uniform float cx; slider[-10,5.6,10]
uniform float cy; slider[-10,8.7,10]
uniform float cz; slider[-10,-3.65,10]
uniform float cw; slider[-10,0.09,10]
uniform float scalelogx; slider[-10,1.0324,10]
uniform float scalelogy; slider[-10,9.179,10]
uniform float scalelogz; slider[-10,-0.68,10]
uniform float scalesinx; slider[-10,1.439,10]
uniform float scalesiny; slider[-10,-0.63,10]
uniform float scalesinz; slider[-10,2.1,10]
uniform float offsetsinx; slider[-10,-4.026,10]
uniform float offsetsiny; slider[-10,-4.63,10]
uniform float offsetsinz; slider[-10,-9.26,10]
uniform float slopesinx; slider[-10,0.89,10]
uniform float slopesiny; slider[-10,-0.011,10]
uniform float slopesinz; slider[-10,2.666,10]
uniform float radialAngle; slider[2,10,30]
uniform float angle1; slider[-10,0,10]
uniform float angle2; slider[-10,0,10]

uniform bool doInversion; checkbox[true]
uniform float invX; slider[-5,-0.96,5]
uniform float invY; slider[-5,-0.52,5]
uniform float invZ; slider[-5,-2.304,5]
uniform float invRadius; slider[0.1,4.01,10]
uniform float invAngle; slider[-10,1.34,10]


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

float DE_VERTEBRAE(float3 zIn) {
   float4 c = 0.5 * float4(cx,cy,cz,cw);
   float4 nz;
   float md2 = 1.0;
   float4 z = float4(zIn,0);
   float4 oldZ = z;
   float mz2 = dot(z,z);
   
   for(int i=0;i < maxSteps; ++i) {
      md2 *= 4.0 * mz2;
      nz.x = z.x * z.x - dot(z.yzw, z.yzw);
      nz.yzw = 2.0 * z.x * z.yzw;
      z = nz+c;
      
      z.x = scalelogx * log(z.x + sqrt(z.x * z.x + 1.));
      z.y = scalelogy * log(z.y + sqrt(z.y * z.y + 1.));
      z.z = scalelogz * log(z.z + sqrt(z.z * z.z + 1.));
      z.x = scalesinx * sin(z.x + offsetsinx) + (z.x * slopesinx);
      z.y = scalesiny * sin(z.y + offsetsiny) + (z.y * slopesiny);
      z.z = scalesinz * sin(z.z + offsetsinz) +  (z.z * slopesinz);
      
      z.xyz = rotatePosition(z.xyz,0,angle1);
      z.xyz = rotatePosition(z.xyz,1,angle2);
      
      z += (z - oldZ) / radialAngle;
      oldZ = z;
      
      mz2 = dot(z,z);
      if(mz2 > 12.0) break;
   }
   
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
      
      float de = DE_VERTEBRAE(pos);
      
      de = r2 * de / (invRadius * invRadius + r * de);
      return de;
   }
   
   return DE_VERTEBRAE(pos);
}

#preset Default
FOV = 0.286852591
Eye = -29.4238683,-1.02880653,-4.73251026
Target = 16.8453003,-1.02060441,8.3318677
Up = -0.092707804,0.327658617,0.623001126
EquiRectangular = false
Gamma = 2.08335
ToneMapping = 3
Exposure = 0.6522
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 6
AntiAliasScale = 1.5
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -6.6
FudgeFactor = 0.06
NormalBackStep = 1
CamLight = 1,1,1,1.038461
BaseColor = 1,1,1
OrbitStrength = 0.7931034
X = 0.5,0.6,0.6,0.3191489
Y = 1,0.6,0,0.1276596
Z = 0.8,0.78,1,0.38596
R = 0.4,0.7,1,0.1914894
BackgroundColor = 0.05882353,0.07843137,0.1019608
GradientBackground = 0
CycleColors = true
Cycles = 2.707692
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
AutoFocus = false
FocalPlane = 1
Aperture = 0
AvgLumin = 0.5,0.5,0.5
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0
DetailAO = -2.783133
MaxDistance = 3299.41861
MaxRaySteps = 5000
Dither = 1
AO = 0,0,0,0.699999988
Specular = 1
SpecularExp = 16.364
SpecularMax = 10
SpotLight = 1,1,1,1
SpotLightDir = 0.100000001,0.100000001
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 1
ShadowSoft = 20
QualityShadows = false
Reflection = 0
DebugSun = false
maxSteps = 2
cx = 5.6
cy = 8.7
cz = -3.65
cw = 0.09
scalelogx = 1.0324
scalelogy = 9.179
scalelogz = -0.680
scalesinx = 1.4399
scalesiny = -0.6299968
scalesinz = 2.0999985
offsetsinx = -4.026443
offsetsiny = -4.6699996
offsetsinz = -9.259983
slopesinx = 0.8925451
slopesiny = -0.0112106
slopesinz = 2.666039
radialAngle = 0.09
angle1 = 0
angle2 = 0

doInversion = true
invX = -0.960
invY = -0.520
invZ = -2.304
invRadius = 4.01
invAngle = 1.340

#endpreset

