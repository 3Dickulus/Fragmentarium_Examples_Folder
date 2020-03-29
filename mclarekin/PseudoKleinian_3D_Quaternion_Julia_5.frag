#info Knighty's Pseudo Kleinian (Scale 1 JuliaBox + Something)
#info Modified by mclarekin for DE test
#info http://www.fractalforums.com/fragmentarium/fragmentarium-an-ide-for-exploring-3d-fractals-and-other-systems-on-the-gpu/msg81393/#msg81393
#include "MathUtils.frag"
#include "DE-Raytracer.frag"

#group 3D Quaternion Julia

uniform vec4 Quat_Scales; slider[(0,0,0,0),(1,2,2,2),(5,5,5,5)]
uniform vec4 jC; slider[(-2,-2,-2,-2),(0,0,0,0),(2,2,2,2)]
uniform vec3 origPtScale; slider[(-2,-2,-2),(0,0,0),(2,2,2)]
uniform float wSeed; slider[0,0,4]

#group PseudoKleinian

#define USE_INF_NORM

uniform int MI; slider[0,10,20]

// Bailout
//uniform float Bailout; slider[0,20,1000]

uniform float Size; slider[0,0.5,4]
uniform vec3 CSize; slider[(0,0,0),(0.7,0.7,0.7),(4,4,4)]
uniform vec3 C; slider[(-4,-4,-4),(0,0,0),(4,4,4)]
uniform float TThickness; slider[0,0.01,2]
uniform float DEoffset; slider[0,0,0.01]
uniform float PK_holes; slider[0,1.0,1.2]
uniform vec3 Offset; slider[(-1,-1,-1),(0,0,0),(1,1,1)]
float DE(vec3 pos) {
	vec3 p = pos;
	vec3 origPt=vec3(p*origPtScale);
	vec4 z=vec4(p,wSeed);
;
	float r = length(z);
	float Dp = 1.0;
	z = vec4 (z.x * z.x - z.y * z.y - z.z * z.z - z.w * z.w, z.x * z.y, z.x * z.z, z.x * z.w);

	z *=  Quat_Scales;
	Dp = Dp * 2.0 * r; // + quatDE tweak

	z += jC;

	p = z.xyz + origPt; 

   	vec3 ap=p+1.;
	for(int i=0;i<MI && ap!=p;i++)
	{
		ap=p;
		p=2.*clamp(p, -CSize, CSize)-p;

		float r2=dot(p,p);
		orbitTrap = min(orbitTrap, abs(vec4(p,r2)));
		float k = max( Size / r2, 1.0);


		p *= k;
		Dp *= k + 0.05;

		p +=  C;
	}



float rxy = sqrt(p.x * p.x + p.y * p.y);
return
max(rxy - PK_holes, abs(rxy * p.z) / r) / abs(Dp);
	//Call basic shape and scale its DE
	//return abs(0.5*Thingy(p,TThickness)/DEfactor-DEoffset);

	//Alternative shape
	//return abs(0.5*RoundBox(p, vec3(1.,1.,1.), 1.0)/DEfactor-DEoffset);
	//Just a plane
	//return abs(0.5*abs((p.z-Offset.z)*DE1(p))/DEfactor-DEoffset);


}


#preset Default
FOV = 0.62536
Eye = 2.474865,-1.58739,0.154995
Target = -5.680257,1.760158,1.05863
Up = 0.1316731,0.5439209,-0.8266509
EquiRectangular = false
AutoFocus = false
FocalPlane = 1
Aperture = 0
Gamma = 2.08335
ToneMapping = 3
Exposure = 0.6522
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -2.84956
DetailAO = -1.35716
FudgeFactor = 1
MaxDistance = 1000
MaxRaySteps = 500
Dither = 0.51754
NormalBackStep = 1
AO = 0,0,0,0.85185
Specular = 1
SpecularExp = 16.364
SpecularMax = 10
SpotLight = 1,1,1,1
SpotLightDir = 0.63626,0.5
CamLight = 1,1,1,1.53846
CamLightMin = 0.12121
Glow = 1,1,1,0.43836
GlowMax = 52
Fog = 0
HardShadow = 0.35385
ShadowSoft = 12.5806
QualityShadows = false
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 0.14286
X = 1,1,1,1
Y = 0.345098,0.666667,0,0.02912
Z = 1,0.666667,0,1
R = 0.0784314,1,0.941176,-0.0194
BackgroundColor = 0.607843,0.866667,0.560784
GradientBackground = 0.3261
CycleColors = false
Cycles = 4.04901
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
Quat_Scales = 1,2,2,2
jC = 0,0,0,0
origPtScale = 0,0,0
wSeed = 0
MI = 10
Size = 0.5
CSize = 0.7,0.7,0.7
C = 0,0,0
TThickness = 0.01
DEoffset = 0
PK_holes = 1
Offset = 0,0,0
#endpreset
