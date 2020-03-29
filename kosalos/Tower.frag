#info This fragment is based on code created by Kali in 2015-05-17
#info (I removed the Waves)
#info https://www.shadertoy.com/view/MtBGDG
#info License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#define float3 vec3
#define float4 vec4

#group Tower

uniform int MaxSteps; slider[5,20,60]
uniform float CX; slider[0.0,1,10]
uniform float CY; slider[0.1,1,30]
uniform float Twist; slider[0,1,5]

uniform bool doInversion; checkbox[true]
uniform float invX; slider[-4,0,4]
uniform float invY; slider[-4,0,4]
uniform float invZ; slider[-4,0,4]
uniform float invRadius; slider[0.2,3,4]
uniform float invAngle; slider[-2,0,3]

float smin(float a, float b, float k ) {
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float4 rotateXZ(float4 pos, float angle) {
    float ss = sin(angle);
    float cc = cos(angle);
    float qt = pos.x;
    pos.x = pos.x * cc - pos.z * ss;
    pos.z =    qt * ss + pos.z * cc;
    return pos;
}

float DE_KALI_TOWER(float3 pos) {
    float aa = smoothstep(0.,1.,clamp(cos(CY - pos.y * 0.4)*1.5,0.,1.)) * PI;
    float4 p = float4(pos,1);
    
    p.y -= CY * 0.25;
    p.y = abs(3.-fract((p.y - CY) / 2.0));
    
    for (int i=0; i < MaxSteps; ++i) {
        p.xyz = abs(p.xyz) - float3(.0,CX,.0);
        p = p * 2./clamp(dot(p.xyz,p.xyz),.3,1.) - float4(0.5,1.5,0.5,0.);
        
        p = rotateXZ(p,aa * Twist);

		orbitTrap = min(orbitTrap,abs(p));
    }

    float fr = max(abs(p.z/p.w)-.01,length(p.zx)/p.w-.002);
    float bl = max(abs(p.x/p.w)-.01,length(p.zy)/p.w-.0005);
    return smin(bl,fr,.02);
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
      
      float de = DE_KALI_TOWER(pos);
      
      de = r2 * de / (invRadius * invRadius + r * de);
      return de;
   }
   
   return DE_KALI_TOWER(pos);
}

#preset Default

FOV = 0.14589666
Eye = -10.1065645,-16.8396167,-14.864611
Target = 3.55472552,11.0318219,12.6736951
Up = -0.171182667,0.05783252,0.026388716
EquiRectangular = false
AutoFocus = false
FocalPlane = 4.4293015
Aperture = 0
Stereo = 0
EyeSeparation = 0.51020408
ProjectionPlane = 165.441177
AnaglyphLeft = 1,0,0
AnaglyphRight = 0,1,1
Gamma = 2.192
ToneMapping = 1
Exposure = 1.17018072
Brightness = 1.5332198
Contrast = 2.66062605
AvgLumin = 0.5,0.5,0.5
Saturation = 2.85229205
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0
GaussianWeight = 0
AntiAliasScale = 0
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 0
Detail = -4.90880502
DetailAO = -7
FudgeFactor = 0.18760758
MaxDistance = 1158.75915
MaxRaySteps = 425
Dither = 1 Locked
NormalBackStep = 0 NotLocked
AO = 0,0,0,0.21416804
Specular = 0.34902598
SpecularExp = 36.071429
SpecularMax = 30.16158
SpotLight = 1,1,1,0.50457039
SpotLightDir = 0.71777006,-0.28571428
CamLight = 1,1,1,0.35100548
CamLightMin = 0
Glow = 1,1,1,0.19864177
GlowMax = 510
Fog = 0
HardShadow = 0.75778547 NotLocked
ShadowSoft = 3.5826088
QualityShadows = false
Reflection = 0 NotLocked
DebugSun = false NotLocked
BaseColor = 1,1,1
OrbitStrength = 0.05975395
X = 0.5,0.6,0.6,0.2585366
Y = 5,0,0,0.45040652
Z = 0.8,0.78,1,0.398374
R = 0.0941176471,0.411764706,1,-0.31270358
BackgroundColor = 0.05882353,0.07843137,0.1019608
GradientBackground = 0
CycleColors = false
Cycles = 0.1
EnableFloor = false NotLocked
FloorNormal = 1,0,0
FloorHeight = 1.3917526
FloorColor = 1,1,1
MaxSteps = 5
CX = 7.2314675
CY = 11.8609682
Twist = 2.9166667
doInversion = true
invX = -1.80923072
invY = 0.0984616
invZ = -1.2307692
invRadius = 2.06249997
invAngle = -1.5730706
#endpreset

