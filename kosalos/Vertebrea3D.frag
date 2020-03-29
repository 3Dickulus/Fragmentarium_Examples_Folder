#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#define float3 vec3
#define float4 vec4

#group Vertebrae

uniform int maxSteps; slider[1,20,20]
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

		  	 orbitTrap = min(orbitTrap, mz2); 
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

FOV = 0.900542496
Eye = 9.14652948,1.03942595,4.01661127
Target = -37.0147959,-20.1512398,-13.1264971
Up = 0.2092838,-0.519795867,0.078982344
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Stereo = 2
EyeSeparation = 4.7167756
ProjectionPlane = 34.8258708
AnaglyphLeft = 1,0,0
AnaglyphRight = 0,1,1
Gamma = 1.02189781
ToneMapping = 1
Exposure = 0.600000001
Brightness = 1.73371648
Contrast = 1.12546125
AvgLumin = 0.5,0.5,0.5
Saturation = 2.31870229
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0
GaussianWeight = 3.30434783
AntiAliasScale = 0
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -2.74239713
DetailAO = -1.74011299
FudgeFactor = 0.695783134
MaxDistance = 116.772824
MaxRaySteps = 395
Dither = 1 Locked
NormalBackStep = 1.27192982 NotLocked
AO = 0,0,0,0.66932271
Specular = 0.403131116
SpecularExp = 69.0109891
SpecularMax = 54.6460178
SpotLight = 1,1,1,0.640271494
SpotLightDir = -0.095948827,0.100000001
CamLight = 1,1,1,1.038461
CamLightMin = 0.528662421
Glow = 1,1,1,0.276859504
GlowMax = 57
Fog = 0
HardShadow = 0.266384779 NotLocked
ShadowSoft = 1.14893617
QualityShadows = false
Reflection = 0.12 NotLocked
DebugSun = false NotLocked
BaseColor = 1,1,1
OrbitStrength = 0.597560977
X = 0.5,0.6,0.6,-0.31598513
Y = 1,0.6,0,-0.438661709
Z = 0.8,0.78,1,1
R = 0.4,0.7,1,0.214152701
BackgroundColor = 0.05882353,0.07843137,0.1019608
GradientBackground = 0
CycleColors = true
Cycles = 8.04773136
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1

maxSteps = 1
cx = 3.96021701
cy = -0.669077747
cz = -1.01083031
cw = -0.310786106
scalelogx = 0.633946843
scalelogy = 2.18813907
scalelogz = -3.3877551
scalesinx = 2.66802445
scalesiny = -3.56415478
scalesinz = -2.11382113
offsetsinx = -0.680412371
offsetsiny = -3.97938144
offsetsinz = -3.53909465
slopesinx = -1.08384456
slopesiny = 0.633946843
slopesinz = 1.9e-08
radialAngle = 8.6470588
angle1 = -0.998043045
angle2 = -7.45596869
doInversion = true
invX = -0.55963302
invY = -1.34862385
invZ = -0.37614678
invRadius = 3.29939024
invAngle = -4.23935091

#endpreset

