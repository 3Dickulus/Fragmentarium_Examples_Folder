#define providesInit

#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#define float3 vec3
#define float4 vec4

#group Floral

uniform int MaxSteps; slider[2,3,20]
uniform float kX; slider[0,1,5]
uniform float kY; slider[0,1,5]
uniform float CSizeX; slider[-1,0,1]
uniform float CSizeY; slider[-1,0,1]
uniform float CSizeZ; slider[-1,0,1]
uniform float CX; slider[0,0,10]
uniform float CY; slider[0,0,10]
uniform float CZ; slider[0,0,10]
uniform float OffsetX; slider[-20,0,20]
uniform float OffsetY; slider[-20,0,20]
uniform float OffsetZ; slider[-20,0,20]

uniform bool doInversion; checkbox[true]
uniform float invX; slider[-5,0,5]
uniform float invY; slider[-5,0,5]
uniform float invZ; slider[-5,0,5]
uniform float invRadius; slider[0.1,4,10]
uniform float invAngle; slider[-10,1,10]

//-------------------------------------------

float3 n1,n2,n3;

void init() {
		n1 = float3(CSizeX,CSizeY,CSizeZ);
  n2 = float3(CX,CY,CZ);
  n3 = float3(OffsetX,OffsetY,OffsetZ);
}

//-------------------------------------------
// Floral Hybrid: https://www.shadertoy.com/view/MsS3zc

float3 tsqr(float3 p) {
    if(p.x==0. && p.y==0.) return float3(-p.z*p.z,0.,0.);
    float a = 1.-p.z*p.z/dot(p.xy,p.xy);
    return float3((p.x*p.x-p.y*p.y)*a ,2.*p.x*p.y*a,2.*p.z*length(p.xy));
}

float3 talt(float3 z) { return float3(z.xy,-z.z); }

float DE_FLORAL(float3 pos) {
    float scale = 1.0;
    
    for (int i=0; i < MaxSteps; i++) {
        
        //BoxFold
        pos = clamp(pos,-n1, n1) * 2.0 - pos;
        pos.xyz = n2 - abs(abs(pos.zyx + n1)-n2) - n1;
        
        //Trap
        float r2 = dot(pos,pos);
        if(r2 > 100.0) break;

        //SphereFold and scaling
        float k = max(kX/r2,.1) * kY;
        
        pos   *= k;
        scale *= k;
        
        //Triplex squaring and translation
        pos = tsqr(pos) - n3;
        scale *= 2.*(length(pos)); 
        
        orbitTrap = min(orbitTrap, float4(abs(pos),r2));
    }

    return .85*length(pos)/scale;
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
		
		float de = DE_FLORAL(pos);
		
		de = r2 * de / (invRadius * invRadius + r * de);
		return de;
	}
	
	return DE_FLORAL(pos);
}


#preset Default

FOV = 0.368896926
Eye = -2.7716941,-3.25375945,4.76489384
Target = 0.855257013,-0.474043505,-16.3769931
Up = 0.01477114,-0.140291924,-0.015911422
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Stereo = 0
EyeSeparation = 0.51020408
ProjectionPlane = 165.441177
AnaglyphLeft = 1,0,0
AnaglyphRight = 0,1,1
Gamma = 1.82481752
ToneMapping = 1
Exposure = 0.521495327
Brightness = 2.1072797
Contrast = 2.5092251
AvgLumin = 0.5,0.5,0.5
Saturation = 1
LumCoeff = 0.212500006,0.715399981,0.0720999986
Hue = 0.427101201
GaussianWeight = 0
AntiAliasScale = 0
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 0
Detail = -3.54382826
DetailAO = -6.99999999
FudgeFactor = 0.585317461
MaxDistance = 191.082801
MaxRaySteps = 1035
Dither = 1 Locked
NormalBackStep = 0 NotLocked
AO = 0,0,0,0.045816734
Specular = 0.166340508
SpecularExp = 56.2637364
SpecularMax = 57.522124
SpotLight = 1,1,1,0.257918552
SpotLightDir = -0.663113005,0.513859276
CamLight = 1,1,1,0.656108597
CamLightMin = 0.613588111
Glow = 1,1,1,0
GlowMax = 0
Fog = 0
HardShadow = 0.68498943 NotLocked
ShadowSoft = 0
QualityShadows = true
Reflection = 0 NotLocked
DebugSun = false NotLocked
BaseColor = 1,1,1
OrbitStrength = 0.083333333
X = 1,1,0,0.795539035
Y = 1,0.6,0,-0.044609664
Z = 1,0.188235294,0.690196078,-0.379182156
R = 0.4,0.7,1,0.50837989
BackgroundColor = 0,0,0
GradientBackground = 0
CycleColors = true
Cycles = 2.32068962
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1

MaxSteps = 7
kX = 2.87719299
kY = 0.684210528
CSizeX = -0.237547891
CSizeY = 0.674329504
CSizeZ = 0.007662836
CX = 0.539568346
CY = 1.61870504
CZ = 0.19784173
OffsetX = -3.52475245
OffsetY = 4.87128716
OffsetZ = 4.39603962

doInversion = true
invX = -2.96330275
invY = -5
invZ = -3.09174311
invRadius = 5.21097561
invAngle = -0.831642989

#endpreset


