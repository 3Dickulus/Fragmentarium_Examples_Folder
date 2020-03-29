#info Mandelbulb Distance Estimator
#define providesInit
#include "MathUtils.frag"
#include "DE-Raytracer.frag"
#group Mandelbulb


// Number of fractal iterations.
uniform int Iterations;  slider[0,9,100]

// Number of color iterations.
uniform int ColorIterations;  slider[0,9,100]

// Mandelbulb exponent (8 is standard)
uniform float Power; slider[0,8,16]

// Bailout radius
uniform float Bailout; slider[0,5,30]

// Alternate is slightly different, but looks more like a Mandelbrot for Power=2
uniform bool AlternateVersion; checkbox[false]

uniform vec3 RotVector; slider[(0,0,0),(1,1,1),(1,1,1)]

uniform float RotAngle; slider[0.00,0,180]

mat3 rot;
uniform float time;
void init() {
	 rot = rotationMatrix3(normalize(RotVector), RotAngle+time*10.0);
}

#define complexMult(a,b) vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x)
#define complexMag(z) dot(z,z)
#define complexReciprocal(z) (vec2(z.x , -z.y)/ complexMag(z))
#define complexDivision(a,b) complexMult(a, complexReciprocal(b))
#define SIN60 0.86602540378443864676372317075294

void tetra(inout vec3 p) {
	vec2 z=p.xy/(1.-p.z);
     float root2 = sqrt(2.);
     vec2 A = vec2(1.,0.);
     vec2 B = vec2(-0.5, SIN60);
     vec2 C = vec2(-0.5, -SIN60);
     vec2 numA = z-root2*A;
     vec2 numB = z-root2*B;
     vec2 numC = z-root2*C;
     vec2 num = complexMult(z, complexMult(numA, complexMult(numB, numC)));
     vec2 a = vec2(0.5,SIN60);
     vec2 b = vec2(0.5,-SIN60);
     vec2 c = vec2(-1,0);
     vec2 denA = root2*z - a;
     vec2 denB = root2*z - b;
     vec2 denC = root2*z - c;
     vec2 den = complexMult(denA, complexMult(denB, denC));//multiplying by a number also have interesting effect
     z = complexDivision(num, den);
    
	p=vec3(2.*z.x, 2.*z.y, dot(z,z)-1.)/(dot(z,z)+1.);
}

uniform bool Julia; checkbox[false]
uniform vec3 JuliaC; slider[(-2,-2,-2),(0,0,0),(2,2,2)]
 
// Compute the distance from `pos` to the Mandelbox.
float DE(vec3 pos) {
	vec3 z=pos;
	float r;
	float dr=1.0;
	int i=0;
	r=length(z);
	while(r<Bailout && (i<Iterations)) {
		z=z / r ; //z.zyx/r;//swizzling z is equivalent to some "rotation"... gives interesting results.
    	     dr =  r*2.0*dr + 1.0;
		tetra(z);
		z*=r*r;
		z+=(Julia ? JuliaC : pos);
		r=length(z);
		i++;
	}
	return 0.5*log(r)*r/dr;
}

#preset Default
FOV = 0.62536
Eye = 1.65826,-1.22975,0.277736
Target = -5.2432,4.25801,-0.607125
Up = 0.401286,0.369883,-0.83588
EquiRectangular = false
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
Detail = -2.84956
DetailAO = -1.35716
FudgeFactor = 1
MaxRaySteps = 164
BoundingSphere = 2
Dither = 0.51754
NormalBackStep = 1
AO = 0,0,0,0.85185
Specular = 1.6456
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
Iterations = 12
ColorIterations = 8
Power = 8
Bailout = 6.279
AlternateVersion = true
RotVector = 1,1,1
RotAngle = 0
Julia = false
JuliaC = 0,0,0
#endpreset

#preset Octobulb
FOV = 0.62536
Eye = -0.184126,0.843469,1.32991
Target = 1.48674,-5.55709,-4.56665
Up = -0.240056,-0.718624,0.652651
AntiAlias = 1
Detail = -2.47786
DetailAO = -0.21074
FudgeFactor = 1
MaxRaySteps = 164
BoundingSphere = 2
Dither = 0.5
AO = 0,0,0,0.7
Specular = 1
SpecularExp = 27.082
SpotLight = 1,1,1,0.94565
SpotLightDir = 0.5619,0.18096
CamLight = 1,1,1,0.23656
CamLightMin = 0.15151
Glow = 0.415686,1,0.101961,0.18421
Fog = 0.60402
HardShadow = 0.72308
Reflection = 0
BaseColor = 1,1,1
OrbitStrength = 0.62376
X = 0.411765,0.6,0.560784,-0.37008
Y = 0.666667,0.666667,0.498039,0.86886
Z = 0.666667,0.333333,1,-0.25984
R = 0.4,0.7,1,0.36508
BackgroundColor = 0.666667,0.666667,0.498039
GradientBackground = 0.5
CycleColors = true
Cycles = 7.03524
FloorNormal = 0,0,0
FloorHeight = 0
FloorColor = 1,1,1
Iterations = 14
ColorIterations = 6
Power = 8.18304
Bailout = 6.279
AlternateVersion = true
RotVector = 1,0,0
RotAngle = 77.8374
#endpreset
