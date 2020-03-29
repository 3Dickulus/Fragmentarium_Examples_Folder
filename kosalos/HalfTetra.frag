// apollonian2: https://www.shadertoy.com/view/llKXzh
#define providesInit

#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#define float3 vec3
#define float4 vec4

#group Half Tetra

uniform int MaxSteps; slider[5,20,60]
uniform float Scale; slider[60,110,175]
uniform float CY; slider[1,5,10]
uniform float Angle1; slider[-5,0,5]
uniform float Angle2; slider[-5,0,5]

uniform bool doInversion; checkbox[true]
uniform float invX; slider[-4,0,4]
uniform float invY; slider[-4,0,4]
uniform float invZ; slider[-4,0,4]
uniform float invRadius; slider[0.2,3,4]
uniform float invAngle; slider[-2,0,2]

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

float scale;
float3 n1;
float3 n2;

void init() {
   scale = Scale / 100.0;
   n1 = normalize(float3(-1.0, CY - 1.0, 1.0/CY - 1.0));
   n2 = n1 * (scale - 1.0);
}

float DE_HALF_TETRA(float3 pos) {
    int i;
//   float3 n1 = normalize(float3(-1.0, CY - 1.0, 1.0/CY - 1.0));
  // float3 scale1 = n1 * (Scale - 1.0);

    for(i=0;i < MaxSteps; ++i) {
        pos = rotatePosition(pos,0,Angle1);
        
        if(pos.x - pos.y < 0.0) pos.xy = pos.yx;
        if(pos.x - pos.z < 0.0) pos.xz = pos.zx;
        if(pos.y - pos.z < 0.0) pos.zy = pos.yz;
        
        pos = rotatePosition(pos,2,Angle2);
     pos = pos * scale - n2;
        //pos = pos * Scale - scale1;
        if(length(pos) > 4.0) break;

        orbitTrap = min(orbitTrap, float4(abs(pos),dot(pos,pos)));
    }

    return length(pos) * pow(scale, -float(i));
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
      
      float de = DE_HALF_TETRA(pos);
      
      de = r2 * de / (invRadius * invRadius + r * de);
      return de;
   }
   
   return DE_HALF_TETRA(pos);
}

#preset Default
FOV = 0.114369502
Eye = -0.744786323,-8.15414844,0.44192848
Target = 3.50213315,18.7847593,-1.46132357
Up = -0.221001475,0.019884235,-0.211698654
EquiRectangular = false
AutoFocus = false
FocalPlane = 2.37315875
Aperture = 0
Stereo = 0
EyeSeparation = 0.51020408
ProjectionPlane = 165.441177
AnaglyphLeft = 1,0,0
AnaglyphRight = 0,1,1
Gamma = 0.620384049
ToneMapping = 1
Exposure = 1.17018072
Brightness = 2.26574501
Contrast = 1.80482711
AvgLumin = 0.5,0.5,0.5
Saturation = 3.25421133
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0
GaussianWeight = 0
AntiAliasScale = 0
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -4.12063953
DetailAO = -5.52575757
FudgeFactor = 0.372827805
MaxDistance = 108.333332
MaxRaySteps = 315
Dither = 1 Locked
NormalBackStep = 3.60683761 NotLocked
AO = 0,0,0,0.480190175
Specular = 0.078125
SpecularExp = 6.50684936
SpecularMax = 3.61445779
SpotLight = 1,1,1,0.257443083
SpotLightDir = -0.063545149,-0.842809364
CamLight = 1,1,1,0.318739055
CamLightMin = 0.098333334
Glow = 1,1,1,0.097879282
GlowMax = 62
Fog = 0
HardShadow = 0.225913621 NotLocked
ShadowSoft = 1.50250418
QualityShadows = false
Reflection = 0 NotLocked
DebugSun = false NotLocked
BaseColor = 1,1,1
OrbitStrength = 0.367149759
X = 0.5,0.6,0.6,0.442278862
Y = 5,0,0,0.094452774
Z = 0.8,0.78,1,-0.040479759
R = 0.0941176471,0.411764706,1,1
BackgroundColor = 0.05882353,0.07843137,0.1019608
GradientBackground = 0
CycleColors = true
Cycles = 14.3058823
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
MaxSteps = 36
CY = 2.3884993
Angle1 = 2.51846382
Angle2 = 0.893648453
doInversion = true
invX = -1.7094017
invY = 1.02564103
invZ = 0.045584053
invRadius = 2.15757576
invAngle = -0.577912252
Scale = 125

#endpreset

