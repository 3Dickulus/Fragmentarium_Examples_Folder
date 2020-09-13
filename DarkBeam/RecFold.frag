// https://fractalforums.org/code-snippets-fragments/74/recfold/3490/msg20966#msg20966
// Output generated from file: D:/fractal/Fragmentarium/Output/darkbeam/_recfold.frag
// Created: Sat May 16 17:34:15 2020
// pseudo_knightyan by knighty

#define providesColor
//#define providesInit
#define USE_IQ_CLOUDS
#define KN_VOLUMETRIC
#define USE_EIFFIE_SHADOW
#define MULTI_SAMPLE_AO
uniform float time;
#include "MathUtils.frag"
#include "DE-Kn2cr11.frag"


#group Pseudo_Knightyan
uniform vec3 CSize; slider[(-2,-2,-2),(0,0,0),(2,2,2)]
uniform float Size; slider[-2,0.70968,2]
uniform float DEfactor; slider[0,1,10]
uniform float TwiddleRXY; slider[-2,0.92784,2]
uniform float TwiddleP; slider[-2.0,2.0,5.0]
uniform float TwiddleK; slider[-2,1,5]
uniform float TwiddleJ; slider[0,0.05,0.1]
uniform int Iter; slider[0,9,100]
uniform int ColorIterations; slider[0,9,100]


#group Coloring
uniform vec3 LVI; slider[(-1,-1,-1),(0,0,0),(1,1,1)]
uniform int LightIter; slider[0,1,100]
uniform bool RevertDiv; checkbox[false]
uniform bool AddOrbitStrength; checkbox[false]

vec3 lightold;
vec3 lightnew;

vec3 baseColor(vec3 p, vec3 q){
 	if (RevertDiv) {
		q=abs(lightold/lightnew);
	} else {
		q=abs(lightnew/lightold);
	}
	q *= LVI;
	if (AddOrbitStrength) q+=OrbitStrength;
   return q;
}

#group recfold
uniform float asym; slider[-10,0,10]
uniform float sym; slider[-10,9,20]
uniform float fold; slider[-10,1,10]
uniform bool recfold; checkbox[false]




vec3 recFold(inout vec3 p) {
		float t;
		p.xy=abs(p.xy);
		t=p.x;
		p.x=p.x+p.y-sym;
		p.y=t-p.y-asym;
		t=p.x;
		p.x = p.x+p.y;
		p.y = t-p.y;	
		return p;
		}
float DE(vec3 p)
	{
		lightold=p;	
		lightnew=p;
		if (recfold) {
			recFold(p);
			
			}
	
		float j=DEfactor;
		for(int i=0;i<Iter;i++){
			if (i<LightIter) {lightold=p;} else {lightold=lightold;};
			if (recfold) p.x = fold-abs(p.x+fold);
			p = TwiddleP*clamp(p, -CSize, CSize)-p;
			float k = max(Size/dot(p,p),TwiddleK);
			p *= k;
				if (i<LightIter) {lightnew=p;} else {lightnew=lightnew;};
			j *= k + TwiddleJ;
			float r2 = dot(p, p);
			if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(p.xyz,r2)));
		}
	float rxy=length(p.xy);
	return max(rxy-TwiddleRXY, abs(rxy*p.z) / length(p))/j;
	}



#preset Default
FOV = 0.903508771
Eye = -8.2291069,2.81498337,2.10698032
Target = -8.1021471,1.23501837,1.50553334
Up = 0.005653954,0.31125018,-0.816441834
EquiRectangular = false
FocalPlane = 2.33643586
Aperture = 0
InFocusAWidth = 1
DofCorrect = true
ApertureNbrSides = 7
ApertureRot = 0
ApStarShaped = true
Gamma = 1
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Bloom = false
BloomIntensity = 1.019737
BloomPow = 4.899154
BloomTaps = 36
BloomStrong = 3.255082
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -2.5
FudgeFactor = 0.117445838
MaxRaySteps = 1010
MaxDistance = 45.40163
Dither = 0
DetailAO = -2.03200883
coneApertureAO = 0.1036745
maxIterAO = 11
FudgeAO = 0.3437133
AO_ambient = 1
AO_camlight = 1
AO_pointlight = 1
AoCorrect = 0
SpecularExp = 81.1577751
CamLight = 0.996078432,0.937254906,0.862745106,0.371158393
AmbiantLight = 0.650980413,0.819607854,1,1.18599034
Reflection = 0.211764708,0.196078435,0.188235298
ReflectionsNumber = 1
SpotGlow = true
LightSize = 0
LightFallOff = 0.088135593
LightGlowRad = 0
LightGlowExp = 0
HardShadow = 0.955530217
ShadowSoft = 6.06407322
ShadowBlur = 0.02154195
perf = false
SSS = false
sss1 = 0.65241228
sss2 = 0.789473685
BaseColor = 1,1,1
OrbitStrength = 0.471783295
X = 0.0313725509,0,1,0.454965359
Y = 1,0.90196079,0.815686285,0.988452656
Z = 0.129411772,0.470588237,0.729411781,0.101616628
R = 0.870588243,0.662745118,0.176470593,0.008092485
BackgroundColor = 0.278431386,0.400000006,0.443137258
GradientBackground = 1.08187134
CycleColors = false
Cycles = 1.02918977
EnableFloor = true
FloorNormal = 0,0,-1
FloorColor = 0.466666669,0.78039217,0.988235295
HF_Fallof = 1.73604871
HF_Const = 0
HF_Intensity = 0.003424658
HF_Dir = 0,0,-1
HF_Offset = -3.43963554
HF_Color = 0.996078432,0.662745118,0,3
HF_Scatter = 0
HF_Anisotropy = 0.0274509806,0.0274509806,0.525490224
HF_FogIter = 1
HF_CastShadow = false
EnCloudsDir = true
CloudDir = 0,-0.040268457,-0.015659954
CloudScale = 2.4625
CloudFlatness = 0.450980391
CloudDensity = 0.373714286
CloudRoughness = 0.76923077
CloudContrast = 10
CloudColor = 0.649999976,0.680000007,0.699999988
CloudColor2 = 0.0700000003,0.170000002,0.239999995
SunLightColor = 0.699999988,0.5,0.300000012
Cloudvar1 = 0.825646793
Cloudvar2 = 1
CloudIter = 1
CloudBgMix = 1
WindDir = 0,0,1
WindSpeed = 1
CSize = 0.955947138,0.898678415,1.10572687
Size = 1.03524229
DEfactor = 0.387168145
TwiddleRXY = 1.13538111
TwiddleP = 2.01793721
TwiddleK = 0.989910313
TwiddleJ = 0.1
Iter = 14
ColorIterations = 32
LVI = 0.264317181,0.028634362,0.037444934
LightIter = 7
RevertDiv = false
AddOrbitStrength = false
asym = 8.62527717
sym = 0.410199556
fold = -0.886917952
recfold = false
RefineSteps = 4
NormalBackStep = 1
Specular = 0.908891328
SpotLight = 1,1,1,7.04242424
LightPos = -10.6306306,1.2162162,1.93693694
FloorHeight = -2.33482643
CloudTops = 3.46241459
CloudBase = -3.23462416
#endpreset

