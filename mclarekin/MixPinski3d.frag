// Output generated from file: D:/MyDocuments/Downloads/mcl 6.frag
// Created: �� 17. ��� 07:52:16 2016
// Output generated from file: D:/fractal/Fragmentarium/Output/mclarekin/mixpinski/test sergej.frag
// Created: Wed Nov 16 20:45:18 2016
#define providesInit
#include "MathUtils.frag"
const float pi=2.*1.570796326794897;
const float pi2=2.*pi;
float sr12=0.70710678118;

//#define PALETTE_COLOR
//#define USE_IQ_CLOUDS
//#define USE_TERRAIN
//#include "DE-kn10.frag"
#include "Fast-Raytracer-with-Palette.frag"
//#include "de-Raytracer.frag"

#group MixPinski
uniform float scaleM; slider[0,2,4]
uniform vec3 scaleC; slider[(-5,-5,-5),(1.,1.,.5),(5,5,5)]
uniform bool PreOffset; checkbox[false]
uniform vec3 offsetM; slider[(-5,-5,-5),(0,0,0),(5,5,5)]
//uniform float w; slider[-5,0,5]
uniform int MI; slider[0,10,250]
uniform int ColorIterations; slider[0,10,250]
//uniform float bailout; slider[0,16,1024]
uniform bool Zw; checkbox[true]
//const float Dd = 1.0; 
//.added in initial DE value.............................................
uniform float offsetD; slider[-20,0,20]

uniform int PreRotStart; slider[0,1,15] 
uniform vec3 PreRotVector; slider[(0,0,0),(1,1,1),(1,1,1)]
uniform float PreRotAngle; slider[0.00,0,180]
uniform int RotStart; slider[0,1,15] 
uniform vec3 RotVector; slider[(0,0,0),(1,1,1),(1,1,1)]
uniform float RotAngle; slider[0.00,0,180]


// allows varying DE calculation, can remove later

#group Transmography

uniform float AccStartv; slider[-10,-.4,10]
uniform float AccCyclev; slider[0.1,.6,4.1]
uniform float AccEndv; slider[-30,-7,30]
float AccStart;
float AccCycle;
float AccEnd;

uniform int AccIter; slider[0,1,20]

uniform float Splits3d; slider[1.00,4,33]
uniform float Split3d_Rad; slider[-3.00,1,10]
//uniform bool Spliter3dBefore;checkbox[false]
uniform int Spliter3d_1; slider[-2,1,20]
uniform int Spliter3d_2; slider[-2,1,20]

uniform int Spliter3d_2_Gap; slider[1,2,20]
uniform int spliterations3d; slider[0,3,20]


uniform float Splits2d; slider[1.00,4,33]
uniform float Split2d_Rad; slider[-3.00,1,10]
uniform int Spliter2d; slider[-2,1,20]
uniform int spliterations2d; slider[0,3,20]

float splits=Splits3d;
float splitrad=Split3d_Rad;

uniform vec3 RotVector1; slider[(-1,-1,-1),(1,1,1),(1,1,1)]
uniform float RotAngle1; slider[-360.00,0,360]
uniform vec3 RotVector2; slider[(-1,-1,-1),(1,1,1),(1,1,1)]
uniform float RotAngle2; slider[-360.00,0,360]

mat3 rot2;
mat3 rotinv2;
mat3 rot1;
mat3 rotinv1;
mat3 fracRotation1;
mat3 fracRotation2;
void init() {
	rot2 = rotationMatrix3(normalize(RotVector2), RotAngle2);
	rotinv2= rotationMatrix3(normalize(RotVector2), -RotAngle2);
	
	rot1 = rotationMatrix3(normalize(RotVector1), RotAngle1);
	rotinv1= rotationMatrix3(normalize(RotVector1), -RotAngle1);
	fracRotation1 = rotationMatrix3(normalize(PreRotVector), PreRotAngle);
	fracRotation2 = rotationMatrix3(normalize(RotVector), RotAngle);
}


float Accordion (inout float zx) {
		float cycle=abs(AccCycle);
		if (cycle<.06) {cycle=.06;}
		float i=0.0;						//why did he use a float here?  :p
		float cyclemod= mod(abs(AccEnd-AccStart),AccCycle);
		if ((cycle)>abs(AccEnd-AccStart)) {cycle=abs(AccEnd-AccStart);}
			
	if (AccEnd-AccStart<0.0) {
			cycle=-cycle;
			cyclemod=-cyclemod;
			
			if (zx>AccStart) {
				// do nothing
			}  else if (zx<(AccStart+cycle) && zx>(AccEnd-cyclemod)){
				zx=zx-AccStart;
				while (zx<(cycle) && i<3000.0) {
					zx-=cycle;i+=1.0;
				}
					if (zx<(cycle/2.)) {
						zx=cycle-zx+AccStart;
					} else {zx+=AccStart;}
				//done
			}
			 else if (zx>AccStart+cycle && zx<AccStart) {
				zx=zx-AccStart;
				if (zx<cycle/2.) {
					zx=cycle-zx+AccStart;
				} else {
					zx=zx+AccStart;
				}
			} 
			 else if (zx<(AccEnd- cyclemod)  && zx>AccEnd) {
				zx=AccEnd-zx;
				if (zx<cyclemod/2.0) {
					zx=cyclemod-zx+AccStart;
				} else {
					zx=zx+AccStart;
				}
			}  
			 else if (zx<AccEnd) {
				zx=zx-AccEnd+AccStart;
			}
		} else {
			cycle=abs(cycle);
			cyclemod=abs(cyclemod);
			
			if (zx<AccStart) {
				// do nothing
			}  else if (zx>(AccStart+cycle) && zx<(AccEnd-cyclemod)){
				zx=zx-AccStart;
				while (zx>(cycle) && i<3000.0) {
					zx-=cycle;i+=1.0;
				}
					if (zx>(cycle/2.)) {
						zx=cycle-zx+AccStart;
					} else {zx+=AccStart;}
				//done
			}
			 else if (zx<AccStart+cycle && zx>AccStart) {
				zx=zx-AccStart;
				if (zx>cycle/2.) {
					zx=cycle-zx+AccStart;
				} else {
					zx=zx+AccStart;
				}
			} 
			 else if (zx>(AccEnd- cyclemod)  && zx<AccEnd) {
				zx=AccEnd-zx;
				if (zx>cyclemod/2.0) {
					zx=cyclemod-zx+AccStart;
				} else {
					zx=zx+AccStart;
				}
			}  
			 else if (zx>AccEnd) {
				zx=zx-AccEnd+AccStart;
			}
		}
	
	return zx;
}
uniform float AccStartSplit; slider[-20,-1,20]
uniform float AccCycleSplit; slider[0.1,.6,10.]
uniform float AccEndSplit; slider[-50,-7,50]
uniform int AccIterSplit; slider[-2,0,20]
uniform int AccIterSplit2; slider[-2,0,20]


uniform int OrbitMode;slider[0,0,10]
uniform vec2 OrbitScale; slider[(-10,-10),(1,1),(10.,10)]


vec3 split(inout vec3 z,inout vec4 ot,in int n) {   //int split version!!!!!

	float ryz; 
	float ratrack=pi2-pi2/splits;
	float rotadjust=-pi/splits;  
	float pintrack=pi/splits;
	float pi2splits=pi2/splits;
	float  i=0.0;
	float omega=atan(z.z,z.y);
	if (omega<0.0) {omega+=pi2;}

	while (omega>pi2splits && i<floor(splits+1.0)) {
			i+=1.0;
			rotadjust+=ratrack;
			pintrack+=pi2splits;
			omega-=pi2splits;
			}
	
		 	z.y-=cos(pintrack)*splitrad;
			z.z-=sin(pintrack)*splitrad;
			 ot.xy=vec2(min(ot.x,z.y),min(ot.y,z.z));
			
		
		 	ryz=sqrt(z.y*z.y+z.z*z.z);
			if (AccIterSplit==n || AccIterSplit2==n) {
					AccStart=AccStartSplit;
					AccCycle=AccCycleSplit;
					AccEnd=AccEndSplit;
					Accordion(ryz);
				}
	 		omega=atan(z.z,z.y)+rotadjust;
			z.y=cos(omega)*ryz;
			z.z=sin(omega)*ryz;
			
			if (OrbitMode==1) {
				orbitTrap.x=sign(z.x)*min(abs(orbitTrap.x),(z.x)*OrbitScale.x+(z.y)*OrbitScale.y);
			} else if (OrbitMode==2) {

				orbitTrap.x=min(orbitTrap.x,OrbitScale.x*abs(z.x)+OrbitScale.y*abs(z.y));
			} else if (OrbitMode==4) {

				orbitTrap.x=sign(z.x)*min(abs(orbitTrap.x),z.x*OrbitScale.x+OrbitScale.y*abs(z.y));
			} else if (OrbitMode==3) {
				orbitTrap.x=sign(z.x)*min(abs(orbitTrap.x),abs(z.x)*OrbitScale.x+OrbitScale.y*abs(z.y));
			} else if (OrbitMode==5) {
				orbitTrap.x=min(orbitTrap.x,sign(z.x)*OrbitScale.y*abs(z.y)+OrbitScale.x*z.x);
	
			} else if (OrbitMode==6) {
				orbitTrap.x=min(orbitTrap.x,OrbitScale.y*abs(z.y)+OrbitScale.x*z.x);
			} else if (OrbitMode==7) {
				orbitTrap.x=min(orbitTrap.x,abs(z.y)+abs(z.x));
			} else {
				orbitTrap.x=min(orbitTrap.x,z.x);
			}
			ot.zw=vec2(min(ot.z,z.y),min(ot.w,z.z));
	
	return z;
}

float DE(vec3 p) {
	float Dd = 1.0; 
	vec3 z=vec3(p);
	float r2=0.;  //  r2 is a better term as we are using radius squared for bailout (dot(z,z) )
	int m=0;
	/*		if (Spliter3dBefore) {
				//z.xyz*=rot2;
				//z.xyz*=rot1;
				while (m<spliterations3d) {
					splitrad=Split3d_Rad;
					//sc*=splitrad;
					splits=Splits3d;
					
						split(z.xyz,orbitTrap,-1);
						z.xy=z.yx;
						split(z.xyz,orbitTrap,-1);
						z.xy=z.yx;
					
					m++;
				}
				m=0;
				z.xz=vec2(z.x*sr12-z.z*sr12,z.x*sr12+z.z*sr12);
					z.yz=-z.zy;
				//z.xyz*=rot2;
				
				//z.xyz*=rot1;
				//z.xyz*=rotinv1;
				//z.xyz*=rotinv2;
			}
*/
	int i=0;
		int split3d2skip=Spliter3d_2;
	for(; i<MI; i++) {
		if (i==Spliter3d_1 || i==split3d2skip) {
				// || i==Spliter3d_2 split3d2skip
				while (m<spliterations3d) {
					splitrad=Split3d_Rad;
					splits=Splits3d;
					
						split(z.xyz,orbitTrap,m);
						z.xy=z.yx;
						split(z.xyz,orbitTrap,m);
						z.xy=z.yx;
				
					m++;}
					m=0;
					//z.xyz*=rot2;
					z.xz=vec2(z.x*sr12-z.z*sr12,z.x*sr12+z.z*sr12);
					z.yz=-z.zy;
					//z.xyz*=rot1;
					if (i==split3d2skip) {split3d2skip+=Spliter3d_2_Gap;}
			}
		if(PreOffset) z-=offsetM;
		if(i>=PreRotStart) z.xyz*=fracRotation1;
	
		if(z.x+z.y<0.0) z.xy = -z.yx;
    		if(z.x+z.z<0.0) z.xz = -z.zx;
    		if(z.y+z.z<0.0) z.zy = -z.yz;
   		//if(z.x+z.w<0.0) z.xw = -z.wx;
    		//if(z.y+z.w<0.0) z.yw = -z.wy;
    		//if(z.z+z.w<0.0) z.zw = -z.wz;

		z+=offsetM;
	
		z.x= scaleM *z.x-scaleC.x*( scaleM -1.);
    		z.y= scaleM *z.y-scaleC.y*( scaleM -1.);
   		///z.w= scaleM *z.w-scaleC.w*( scaleM -1.);
    		z.z-=0.5*scaleC.z*( scaleM -1.)/ scaleM ;
    		z.z=-abs(-z.z);
		z.z+=0.5*scaleC.z*( scaleM -1.)/ scaleM ;
		z.z= scaleM *z.z;
		//z.w-=sin(z.w)+cos(z.w);
		Dd *= scaleM; // for DE calc	

		//if(Zw) r2=z.x*z.x+z.y*z.y+z.z*z.z ; //+ z.w * z.w bailout criteia, and I added in the z.w part to see if it  necessary
		//else  
		r2=z.x*z.x+z.y*z.y+z.z*z.z; 	
		//if(i>=RotStart) z.xyz*=fracRotation2;	
		if (i<ColorIterations && Spliter3d_1==-1) orbitTrap = min(orbitTrap, abs(vec4(orbitTrap.x,z.x,z.y,z.z)));
}

float r = sqrt(r2);

//return (r - offsetD) / abs(Dd); // offsetD has a default of 0.0 which is the std case. The offsetD results are similar or maybe the same as adjusting Detail Level( Quality)
//float Iter = i; // this DE works also in openCL so it might be something to with "i" in Fragmentarium
//return sqrt(r)*pow(scaleM,-Iter);
return r/abs(Dd);

} 


#preset New
FOV = 0.4
Eye = -0.0136377,-4.687893,-0.3368507
Target = 0.0066737,2.294075,0.1648421
Up = 0.0390643,-0.0717291,0.9966587
DepthToAlpha = true
depthMag = 1
ShowDepth = false
AntiAlias = 1
Detail = -3
DetailAO = -0.5
FudgeFactor = 0.9
MaxRaySteps = 111
BoundingSphere = 2
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 4
SpecularExp = 16
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2
Reflection = 0
EnableFloor = false
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
BackgroundColor = 0,0,0.05
GradientBackground = 0.3
pBaseColor = 0,0,0
BaseStrength = 0
cSpeed = 10
pOffset = 0
pIntensity = 1
color0 = 0.95,0.83,0.42
Sharp0to1 = false
Dist0to1 = 1
color1 = 1,0,0.07
Sharp1to2 = false
Dist1to2 = 1
color2 = 0.7,0.7,0.42
Sharp2to3 = false
Dist2to3 = 1
color3 = 1,0.37,0
Sharp3to0 = false
Dist3to0 = 1
orbitStrengthXYZR = 1,1,1,1
scaleM = 2
scaleC = 1,1,0.5
PreOffset = false
offsetM = 0,0,0
MI = 10
ColorIterations = 10
Zw = true
offsetD = 0
PreRotStart = 1
PreRotVector = 1,1,1
PreRotAngle = 0
RotStart = 1
RotVector = 1,1,1
RotAngle = 0
AccStartv = -0.4
AccCyclev = 0.6
AccEndv = -7
AccIter = 1
Splits3d = 5
Split3d_Rad = 0.1
Spliter3d_1 = 0
Spliter3d_2 = 3
Spliter3d_2_Gap = 2
spliterations3d = 1
Splits2d = 4
Split2d_Rad = 1
Spliter2d = 1
spliterations2d = 3
RotVector1 = 1,1,1
RotAngle1 = 0
RotVector2 = 1,1,1
RotAngle2 = 0
AccStartSplit = -1
AccCycleSplit = 0.6
AccEndSplit = -7
AccIterSplit = 0
AccIterSplit2 = 0
OrbitMode = 0
OrbitScale = 1,1
#endpreset

#preset Default
FOV = 0.4
Eye = 0.0242774,0,-3.70005
Target = 0.0628129,0,6.29988
Up = 0,1,0
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 2
ToneMapping = 4
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 1
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 1
Detail = -3.3
DetailAO = -0.5
FudgeFactor = 0.5
MaxDistance = 1000
MaxRaySteps = 56
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 0.4
SpecularExp = 16
SpecularMax = 10
SpotLight = 1,1,1,0.4
SpotLightDir = -0.75,-0.45
CamLight = 1,1,1,1
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 1
ShadowSoft = 20
QualityShadows = false
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 0.57895
X = 0.5,0.6,0.6,0.2549
Y = 1,0.6,0,0.43138
Z = 0.8,0.78,1,0.5
R = 0.4,0.7,1,0.12
BackgroundColor = 0.427451,0.529412,0.6
GradientBackground = 0.3
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
scaleM = 2
scaleC = 1,1,0.5,0.5
offsetM = 0,0,0,0
w = 0
MI = 10
ColorIterations = 10
Zw = true
offsetD = 0
PreRotStart = 1
PreRotVector = 1,1,1
PreRotAngle = 0
RotStart = 1
RotVector = 1,1,1
RotAngle = 0
#endpreset



#preset Rot
FOV = 0.55738
Eye = 1.32977,1.19009,-0.842421
Target = -0.773309,-0.566494,0.265185
Up = -0.275796,-0.254295,-0.926964
EquiRectangular = false
FocalPlane = 1.07
Aperture = 0
Gamma = 1.50171
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Detail = -3.12501
DetailAO = -0.57729
FudgeFactor = 0.28049
Dither = 0.86726
NormalBackStep = 1 NotLocked
AO = 0,0,0,0.90722
Specular = 0.54455
SpecularExp = 2
SpecularMax = 10
SpotLight = 1,0.807843,0.670588,1
SpotLightDir = -0.875,-0.875
CamLight = 0.588235,0.72549,0.827451,0.58824
CamLightMin = 0.69512
Glow = 0.721569,0.866667,1,0.1573
GlowMax = 168
Fog = 0.47
HardShadow = 0.60494 NotLocked
ShadowSoft = 0.5128
Reflection = 0 NotLocked
DebugSun = false NotLocked
BaseColor = 0.921569,0.921569,0.921569
OrbitStrength = 0.53947
X = 0.427451,0.0941176,1,1
Y = 0.345098,0.666667,0,1
Z = 1,0.666667,0,1
R = 0.0784314,1,0.941176,0.58416
BackgroundColor = 0.372549,0.482353,0.505882
GradientBackground = 0
CycleColors = false
Cycles = 1.9431
EnableFloor = false NotLocked
FloorNormal = 1,0,0
FloorHeight = 0.3012
FloorColor = 1,1,1
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 0
MaxDistance = 1000
MaxRaySteps = 739
QualityShadows = true
scaleM = 2
scaleC = 1,1,0.9813,0.4206
offsetM = 0,0,0,0
w = 0.2877
MI = 14
ColorIterations = 10
offsetD = 0
RotVector = 1,0,0
RotAngle = 180
PreRotVector = 0,0.56962,1
PreRotAngle = 149.143
Zw = true
PreRotStart = 6
RotStart = 2
#endpreset



#preset greenT
FOV = 0.55738
Eye = 1.61234,1.44349,-1.50713
Target = -0.364895,-0.201961,-0.0516616
Up = 0.740157,-0.438374,0.509899
EquiRectangular = false
FocalPlane = 1.07
Aperture = 0
Gamma = 1.50171
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 1.4
Detail = -3.4
DetailAO = -0.57729
FudgeFactor = 0.28049
Dither = 0.86726
NormalBackStep = 1 NotLocked
AO = 0,0,0,0.90722
Specular = 0.54455
SpecularExp = 2
SpecularMax = 10
SpotLight = 1,0.807843,0.670588,1
SpotLightDir = 0.6,0.45
CamLight = 0.588235,0.72549,0.827451,0.58824
CamLightMin = 0.69512
Glow = 0.721569,0.866667,1,0.1573
GlowMax = 168
Fog = 0.47
HardShadow = 0.60494 NotLocked
ShadowSoft = 0.5128
Reflection = 0 NotLocked
DebugSun = false NotLocked
BaseColor = 0.921569,0.921569,0.921569
OrbitStrength = 0.60526
X = 0.427451,0.0941176,1,1
Y = 0.345098,0.666667,0,1
Z = 1,0.666667,0,0.17648
R = 0.0784314,1,0.941176,0.26732
BackgroundColor = 0.372549,0.482353,0.505882
GradientBackground = 0
CycleColors = false
Cycles = 0.1
EnableFloor = false NotLocked
FloorNormal = 1,0,0
FloorHeight = 0.3012
FloorColor = 1,1,1
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 0
MaxDistance = 1000
MaxRaySteps = 739
QualityShadows = true
scaleM = 2
scaleC = 1,1,0.7944,0.4206
offsetM = 0,0,0,0
w = 0.4765
MI = 14
ColorIterations = 9
bailout = 1024
offsetD = 0
RotVector = 0,1,0.23158
RotAngle = 87.9066
PreRotVector = 1,0,0
PreRotAngle = 0
Zw = false
PreRotStart = 4
RotStart = 3
#endpreset




#preset Green2
FOV = 0.55738
Eye = 1.3424,1.20498,-1.23742
Target = -0.430539,-0.36154,0.534039
Up = -0.414608,0.846605,0.333707
EquiRectangular = false
FocalPlane = 1.07
Aperture = 0
Gamma = 1.50171
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 1.4
Detail = -3.4
DetailAO = -0.57729
FudgeFactor = 0.28049
Dither = 0.86726
NormalBackStep = 1 NotLocked
AO = 0,0,0,0.90722
Specular = 0.54455
SpecularExp = 2
SpecularMax = 10
SpotLight = 1,0.807843,0.670588,1
SpotLightDir = 0.6,0.45
CamLight = 0.588235,0.72549,0.827451,0.58824
CamLightMin = 0.69512
Glow = 0.721569,0.866667,1,0.1573
GlowMax = 168
Fog = 0.47
HardShadow = 0.60494 NotLocked
ShadowSoft = 0.5128
Reflection = 0 NotLocked
DebugSun = false NotLocked
BaseColor = 0.921569,0.921569,0.921569
OrbitStrength = 0.60526
X = 0.427451,0.0941176,1,1
Y = 0.345098,0.666667,0,1
Z = 1,0.666667,0,0.17648
R = 0.0784314,1,0.941176,0.26732
BackgroundColor = 0.372549,0.482353,0.505882
GradientBackground = 0
CycleColors = false
Cycles = 0.1
EnableFloor = false NotLocked
FloorNormal = 1,0,0
FloorHeight = 0.3012
FloorColor = 1,1,1
DepthToAlpha = false
ShowDepth = false
DepthMagnitude = 0
MaxDistance = 1000
MaxRaySteps = 739
QualityShadows = true
scaleM = 2
scaleC = 1,1,0.7944,0.4206
offsetM = 0,0,0,0
w = -0.9231
MI = 14
ColorIterations = 9
offsetD = 0
RotVector = 0.41053,1,0.23158
RotAngle = 87.9066
PreRotVector = 0.83544,0,1
PreRotAngle = 180
Zw = true
PreRotStart = 1
RotStart = 3
#endpreset


#preset kn10-rand1
FOV = 0.4
Eye = -9.19969,0.75459,-3.64031
Target = 0.0500801,1.11094,0.143194
Up = -0.0392323,0.999228,0.00180101
Gamma = 2
ToneMapping = 5
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 1
Detail = -3
FudgeFactor = 0.92683
Dither = 0.93805
NormalBackStep = 1
BaseColor = 1,1,1
BackgroundColor = 0.427451,0.529412,0.6
GradientBackground = 0.3
FocalPlane = 1
Aperture = 0
InFocusAWidth = 0
DofCorrect = true
ApertureNbrSides = 7
ApertureRot = 0
ApStarShaped = false
BokehCircle = 2.5
BloomIntensity = 0
BloomPow = 1
BloomTaps = 1
BloomStrong = 1
RefineSteps = 4
MaxRaySteps = 1548
MaxDistance = 1000
DetailAO = -1.44333
coneApertureAO = 1
maxIterAO = 20
FudgeAO = 1
AO_ambient = 0.7
AO_camlight = 0
AO_pointlight = 0.36364
AoPower = 0
Specular = 0
SpecularExp = 16
AmbiantLight = 0.572549,0.670588,0.741176,0.8
CamLight = 1,1,1,0
Reflection = 0,0,0
ReflectionsNumber = 0
SpotLight = 1,1,1,1.4
LightPos = -7.826,3.0434,-2.6086
LightSize = 0.1
LightFallOff = 0
LightGlowRad = 0
LightGlowExp = 1
HardShadow = 1
ShadowSoft = 0
ShadowBlur = 0
perf = false
SSS = false
sss1 = 0.1
sss2 = 0.5
BaseStrength = 0.51948
paletteColoring = true
cSpeed = 23.2675
pOffset = 0
color0 = 0.109804,0.164706,0.94902
Sharp0to1 = true
Dist0to1 = 1
color1 = 1,0,0.07
Sharp1to2 = true
Dist1to2 = 1
color2 = 0.7,0.7,0.42
Sharp2to3 = true
Dist2to3 = 1
color3 = 1,0.37,0
Sharp3to0 = true
Dist3to0 = 1
orbitStrengthXYZR = 1,1,1,1
Horizontal = false
Vertical = false
GradientSkyOffset = 0.67
ifTexture = false
tex = D:/programs install/fraclal generators/Fragmentarium.V1.0.0/Examples/Pinski/../
TexSpeed = 1
intensity = 2.5
orbitTexX = 0,0,0
orbitTexY = 1,0,0
TextureOffset = 0,0
MapType = 1
HF_Fallof = 0.1
HF_Const = 0
HF_Intensity = 0
HF_Dir = 0,0,1
HF_Offset = 0
HF_Color = 1,1,1,1
HF_Scatter = 0
HF_Anisotropy = 0,0,0
HF_FogIter = 1
HF_CastShadow = false
EnableFloor = false
TerrainMode = 1
FloorColor = 1,1,1
RTerVec = 0,0,1
RTerAng = 0
MovTer = 0,0,0
TerSlope = 0.5
TerMixer = 0.5
Mix2d = 0.5
Iter2D = 5
Freq2D = 0.25
Amp2D = 0.25
FM2D = 5
AM2D = 0.35
Offset2D = 0
Iter3D = 5
Freq3D = 0.25
Amp3D = 0.25
FM3D = 5
AM3D = 0.35
Offset3D = 0
TerDistorsion = 1,1,1
WSlope = -0.1
FloorIter1 = 3
FreqMul1 = 2
AmpMul1 = 0.3
Wind1 = 1,1
Offset1 = 0.4
FloorIter2 = 3
FreqMul2 = 2
AmpMul2 = 0.3
Wind2 = 1,1
Offset2 = 0.4
WaveVec = 0,0,1
WaveAng = 0
RWatVec = 0,0,1
RWatAng = 0
MovWat = 0,0,0
off = 1,1
tex1 = D:/programs install/fraclal generators/Fragmentarium.V1.0.0/Examples/Pinski/../
EnableFloorPic = false
FPicBright = 1
FPicBright2 = 0
htexturespeed = 1
htextoff = 0,0
hintensity = 0
hscale = 1
Ffudge = 1
FDither = 0
Foff = 0,0
ElableClouds = false
EnCloudsDir = false
Clouds_Dir = 0,0,1
CloudScale = 1
CloudFlatness = 0
CloudTops = 1
CloudBase = -1
CloudDensity = 1
CloudRoughness = 1
CloudContrast = 1
CloudColor = 0.65,0.68,0.7
CloudColor2 = 0.07,0.17,0.24
SunLightColor = 0.7,0.5,0.3
Cloudvar1 = 0.99
Cloudvar2 = 0.99
CloudIter = 5
CloudBgMix = 1
scaleM = 1.7818
scaleC = 1,1,1,1
offsetM = -0.5085,-1.2376,0,0
w = 0.6154
MI = 17
ColorIterations = 11
Zw = true
offsetD = 20
PreRotStart = 0
PreRotVector = 0,1,0
PreRotAngle = 0
RotStart = 7
RotVector = 0.81053,0,1
RotAngle = 180
#endpreset


#preset kn10-sinZw
FOV = 0.4
Eye = -4.07804,5.57355,-5.47605
Target = -2.38846,-3.81907,-2.48872
Up = -0.496448,-0.342934,-0.797455
Gamma = 1.54205
ToneMapping = 2
Exposure = 1.39176
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 1
Detail = -3.2
FudgeFactor = 0.4878
Dither = 0.92035
NormalBackStep = 1
BaseColor = 1,1,1
BackgroundColor = 0.427451,0.529412,0.6
GradientBackground = 0.3
FocalPlane = 1
Aperture = 0
InFocusAWidth = 0
DofCorrect = true
ApertureNbrSides = 7
ApertureRot = 0
ApStarShaped = false
BokehCircle = 2.5
BloomIntensity = 0
BloomPow = 1
BloomTaps = 1
BloomStrong = 1
RefineSteps = 4
MaxRaySteps = 1310
MaxDistance = 1000
DetailAO = -1.29899
coneApertureAO = 0.47541
maxIterAO = 20
FudgeAO = 1
AO_ambient = 0.7
AO_camlight = 0
AO_pointlight = 0.33766
AoPower = 0
Specular = 1
SpecularExp = 3
AmbiantLight = 0.737255,0.862745,0.952941,0.8
CamLight = 1,1,1,0
Reflection = 0.380392,0.247059,0.564706
ReflectionsNumber = 0
SpotLight = 1,0.776471,0.701961,2.7869
LightPos = -5.2174,3.0434,-4.1304
LightSize = 0.04
LightFallOff = 0
LightGlowRad = 0.45455
LightGlowExp = 1
HardShadow = 1
ShadowSoft = 20
ShadowBlur = 0
perf = false
SSS = false
sss1 = 0.1
sss2 = 0.5
BaseStrength = 0.15584
paletteColoring = true
cSpeed = 11.386
pOffset = 0
color0 = 0.521569,0.85098,0.94902
Sharp0to1 = true
Dist0to1 = 1
color1 = 1,0.439216,0.25098
Sharp1to2 = true
Dist1to2 = 1
color2 = 0.7,0.7,0.42
Sharp2to3 = true
Dist2to3 = 1
color3 = 1,0.37,0
Sharp3to0 = true
Dist3to0 = 1
orbitStrengthXYZR = 1,1,1,1
Horizontal = false
Vertical = false
GradientSkyOffset = 0.67
ifTexture = false
tex = D:/programs install/fraclal generators/Fragmentarium.V1.0.0/Examples/Pinski/../
TexSpeed = 1
intensity = 2.5
orbitTexX = 0,0,0
orbitTexY = 1,0,0
TextureOffset = 0,0
MapType = 1
HF_Fallof = 0.1
HF_Const = 0
HF_Intensity = 0
HF_Dir = 0,0,1
HF_Offset = 0
HF_Color = 1,1,1,1
HF_Scatter = 0
HF_Anisotropy = 0,0,0
HF_FogIter = 1
HF_CastShadow = false
EnableFloor = false
TerrainMode = 1
FloorColor = 1,1,1
RTerVec = 0,0,1
RTerAng = 0
MovTer = 0,0,0
TerSlope = 0.5
TerMixer = 0.5
Mix2d = 0.5
Iter2D = 5
Freq2D = 0.25
Amp2D = 0.25
FM2D = 5
AM2D = 0.35
Offset2D = 0
Iter3D = 5
Freq3D = 0.25
Amp3D = 0.25
FM3D = 5
AM3D = 0.35
Offset3D = 0
TerDistorsion = 1,1,1
WSlope = -0.1
FloorIter1 = 3
FreqMul1 = 2
AmpMul1 = 0.3
Wind1 = 1,1
Offset1 = 0.4
FloorIter2 = 3
FreqMul2 = 2
AmpMul2 = 0.3
Wind2 = 1,1
Offset2 = 0.4
WaveVec = 0,0,1
WaveAng = 0
RWatVec = 0,0,1
RWatAng = 0
MovWat = 0,0,0
off = 1,1
tex1 = D:/programs install/fraclal generators/Fragmentarium.V1.0.0/Examples/Pinski/../
EnableFloorPic = false
FPicBright = 1
FPicBright2 = 0
htexturespeed = 1
htextoff = 0,0
hintensity = 0
hscale = 1
Ffudge = 1
FDither = 0
Foff = 0,0
ElableClouds = false
EnCloudsDir = false
Clouds_Dir = 0,0,1
CloudScale = 1
CloudFlatness = 0
CloudTops = 1
CloudBase = -1
CloudDensity = 1
CloudRoughness = 1
CloudContrast = 1
CloudColor = 0.65,0.68,0.7
CloudColor2 = 0.07,0.17,0.24
SunLightColor = 0.7,0.5,0.3
Cloudvar1 = 0.99
Cloudvar2 = 0.99
CloudIter = 5
CloudBgMix = 1
scaleM = 2
scaleC = 2.9439,1,5,0.514
offsetM = -2.8218,-3.1188,-0.4455,-0.9406
w = 0.2308
MI = 26
ColorIterations = 10
Zw = true
offsetD = 0
PreRotStart = 0
PreRotVector = 0.20253,0,1
PreRotAngle = 54
RotStart = 0
RotVector = 1,0,0
RotAngle = 180
PreOffset = true
#endpreset




#preset kn10-sinZw-2
FOV = 0.4
Eye = -2.60373,7.19597,-0.992127
Target = -3.6195,-2.75167,-0.879217
Up = -0.865775,0.0828043,-0.493535
Gamma = 1.54205
ToneMapping = 2
Exposure = 1.39176
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 1
Detail = -3.2
FudgeFactor = 0.4878
Dither = 0.92035
NormalBackStep = 1
BaseColor = 1,1,1
BackgroundColor = 0.427451,0.529412,0.6
GradientBackground = 0.3
FocalPlane = 1
Aperture = 0
InFocusAWidth = 0
DofCorrect = true
ApertureNbrSides = 7
ApertureRot = 0
ApStarShaped = false
BokehCircle = 2.5
BloomIntensity = 0
BloomPow = 1
BloomTaps = 1
BloomStrong = 1
RefineSteps = 4
MaxRaySteps = 1310
MaxDistance = 1000
DetailAO = -1.29899
coneApertureAO = 0.47541
maxIterAO = 20
FudgeAO = 1
AO_ambient = 0.7
AO_camlight = 0
AO_pointlight = 0.33766
AoPower = 0
Specular = 1
SpecularExp = 3
AmbiantLight = 0.737255,0.862745,0.952941,0.8
CamLight = 1,1,1,0
Reflection = 0.380392,0.247059,0.564706
ReflectionsNumber = 0
SpotLight = 1,0.776471,0.701961,2.7869
LightPos = -10,10,-0.8696
LightSize = 0.04
LightFallOff = 0
LightGlowRad = 0.45455
LightGlowExp = 1
HardShadow = 1
ShadowSoft = 20
ShadowBlur = 0
perf = false
SSS = false
sss1 = 0.1
sss2 = 0.5
BaseStrength = 0.15584
paletteColoring = true
cSpeed = 11.386
pOffset = 0
color0 = 0.521569,0.85098,0.94902
Sharp0to1 = true
Dist0to1 = 1
color1 = 1,0.439216,0.25098
Sharp1to2 = true
Dist1to2 = 1
color2 = 0.7,0.7,0.42
Sharp2to3 = true
Dist2to3 = 1
color3 = 1,0.37,0
Sharp3to0 = true
Dist3to0 = 1
orbitStrengthXYZR = 1,1,1,1
Horizontal = false
Vertical = false
GradientSkyOffset = 0.67
ifTexture = false
tex = D:/programs install/fraclal generators/Fragmentarium.V1.0.0/Examples/Pinski/../
TexSpeed = 1
intensity = 2.5
orbitTexX = 0,0,0
orbitTexY = 1,0,0
TextureOffset = 0,0
MapType = 1
HF_Fallof = 0.66368
HF_Const = 0
HF_Intensity = 0
HF_Dir = 0,0,1
HF_Offset = 0
HF_Color = 1,1,1,1
HF_Scatter = 0
HF_Anisotropy = 0,0,0
HF_FogIter = 1
HF_CastShadow = false
EnableFloor = false
TerrainMode = 1
FloorColor = 1,1,1
RTerVec = 0,0,1
RTerAng = 0
MovTer = 0,0,0
TerSlope = 0.5
TerMixer = 0.5
Mix2d = 0.5
Iter2D = 5
Freq2D = 0.25
Amp2D = 0.25
FM2D = 5
AM2D = 0.35
Offset2D = 0
Iter3D = 5
Freq3D = 0.25
Amp3D = 0.25
FM3D = 5
AM3D = 0.35
Offset3D = 0
TerDistorsion = 1,1,1
WSlope = -0.1
FloorIter1 = 3
FreqMul1 = 2
AmpMul1 = 0.3
Wind1 = 1,1
Offset1 = 0.4
FloorIter2 = 3
FreqMul2 = 2
AmpMul2 = 0.3
Wind2 = 1,1
Offset2 = 0.4
WaveVec = 0,0,1
WaveAng = 0
RWatVec = 0,0,1
RWatAng = 0
MovWat = 0,0,0
off = 1,1
tex1 = D:/programs install/fraclal generators/Fragmentarium.V1.0.0/Examples/Pinski/../
EnableFloorPic = false
FPicBright = 1
FPicBright2 = 0
htexturespeed = 1
htextoff = 0,0
hintensity = 0
hscale = 1
Ffudge = 1
FDither = 0
Foff = 0,0
ElableClouds = false
EnCloudsDir = false
Clouds_Dir = 0,0,1
CloudScale = 1
CloudFlatness = 0
CloudTops = 1
CloudBase = -1
CloudDensity = 1
CloudRoughness = 1
CloudContrast = 1
CloudColor = 0.65,0.68,0.7
CloudColor2 = 0.07,0.17,0.24
SunLightColor = 0.7,0.5,0.3
Cloudvar1 = 0.99
Cloudvar2 = 0.99
CloudIter = 5
CloudBgMix = 1
scaleM = 2
scaleC = 2.9439,1,5,0.514
offsetM = -2.8218,-3.1188,-0.4455,-0.9406
w = 0.2308
MI = 26
ColorIterations = 10
Zw = false
offsetD = 0
PreRotStart = 0
PreRotVector = 0,0,1
PreRotAngle = 87.4278
RotStart = 2
RotVector = 1,0,0
RotAngle = 180
PreOffset = true
#endpreset

