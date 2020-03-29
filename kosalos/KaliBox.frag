#define providesInit

#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#define float3 vec3
#define float4 vec4

#group KaliBox

uniform int MaxSteps; slider[3,3,30]
uniform float Scale; slider[-5,0,5]
uniform float MinRad; slider[0,1,3]
uniform float TransX; slider[-15,0,15]
uniform float TransY; slider[-15,0,15]
uniform float TransZ; slider[-1,2,5]
uniform float Angle; slider[-3,0,3]
uniform bool doJulia; checkbox[true]
uniform float juliaX; slider[-5,0,5]
uniform float juliaY; slider[-5,0,5]
uniform float juliaZ; slider[-5,0,5]
uniform bool doInversion; checkbox[true]
uniform float invX; slider[-5,0,5]
uniform float invY; slider[-5,0,5]
uniform float invZ; slider[-5,0,5]
uniform float invRadius; slider[0.1,4,10]
uniform float invAngle; slider[-10,1,10]

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

//-------------------------------------------
float3 n1;
float4 p0;
float absScalem1;
float AbsScaleRaisedTo1mIters;
float4 mins;

void init() {
   n1 = float3(TransX,TransY,TransZ);
   p0 = float4(juliaX,juliaY,juliaZ,1);
   absScalem1 = abs(Scale - 1.0);
   AbsScaleRaisedTo1mIters = pow(abs(Scale), float(1 - MaxSteps));
   mins = float4(Scale,Scale,Scale,abs(Scale)) / MinRad;
}

//-------------------------------------------

float DE_KALIBOX(float3 pos) {
    float4 p = float4(pos,1);

    for (int i = 0; i < MaxSteps;++i) {
        p.xyz = rotatePosition(p.xyz,0,Angle);
        p.xyz = rotatePosition(p.xyz,1,Angle);

        p.xyz = abs(p.xyz) + n1;
        float r2 = dot(p.xyz, p.xyz);
        p *= clamp(max(MinRad/r2, MinRad), 0.0, 1.0); 
        p = p * mins;

 			    if(doJulia) p += p0;

       orbitTrap = min(orbitTrap, abs(p));
    }

    return ((length(p.xyz) - absScalem1) / p.w - AbsScaleRaisedTo1mIters);
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
		
		float de = DE_KALIBOX(pos);
		
		de = r2 * de / (invRadius * invRadius + r * de);
		return de;
	}
	
	return DE_KALIBOX(pos);
}


#preset Default

FOV = 0.674698796
Eye = -15.6566863,-11.531101,20.4662364
Target = -9.81951984,-4.98665569,0.693560825
Up = 0.011565532,-0.129802693,-0.03954835
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Stereo = 0
EyeSeparation = 0.51020408
ProjectionPlane = 165.441177
AnaglyphLeft = 1,0,0
AnaglyphRight = 0,1,1
Gamma = 1.91384181
ToneMapping = 2
Exposure = 0.712230217
Brightness = 1.29765396
Contrast = 1.1965812
AvgLumin = 0.5,0.5,0.5
Saturation = 1
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0.270916335
GaussianWeight = 3.515625
AntiAliasScale = 0
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -3.78720444
DetailAO = -2.57308248
FudgeFactor = 0.131024096
MaxDistance = 340.729002
MaxRaySteps = 452
Dither = 1 Locked
NormalBackStep = 0 NotLocked
AO = 0,0,0,0.192753623
Specular = 0.393419171
SpecularExp = 49.4556766
SpecularMax = 66.7187501
SpotLight = 1,1,1,0.107936508
SpotLightDir = -0.424657533,0.100000001
CamLight = 1,1,1,0.476190476
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 0
Fog = 0
HardShadow = 0.119515886 NotLocked
ShadowSoft = 3.52583587
QualityShadows = false
Reflection = 0 NotLocked
DebugSun = false NotLocked
BaseColor = 1,1,1
OrbitStrength = 0.40797546
X = 1,1,0,2e-09
Y = 1,0.6,0,-0.363896847
Z = 0.333333333,1,1,-0.607449856
R = 0.4,0.7,1,0.727403158
BackgroundColor = 0,0,0
GradientBackground = 0
CycleColors = false
Cycles = 1.3680731
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1

MaxSteps = 14
Scale = -2.46887967
MinRad = 1.07594937
TransX = -5.83213773
TransY = -1.05451936
TransZ = -0.999999996
Angle = 0.162002983

doJulia = true
juliaX = -1.10263523
juliaY = 1.24133149
juliaZ = 2.64216367

doInversion = true
invX = -3.44474761
invY = -1.15279673
invZ = -1.03001364
invRadius = 2.35661765
invAngle = -4.03817914

#endpreset


