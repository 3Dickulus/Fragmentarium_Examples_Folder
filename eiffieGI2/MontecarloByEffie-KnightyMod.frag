// DE DOF by eiffie
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// This is an example of calculating DOF based on distance estimates. The idea of
// gathering samples any time you are within the circle of confusion came from IQ.
// The implementation is as simple as I could make it. The surface is treated like
// a cloud density so the DOF can "see around" the edges of objects by stepping thru them.
// There are several problems with this though:
// It is very expensive if you are doing shadow marchs/reflections with each step.
// Distance estimates are quite bad at large distances so banding occurs - to remove
// the banding I added random jitter at each step (you must add jitter each time you come
// close to the surface as it re-aligns the steps of adjacent pixels).
// It could be improved if you took 1 sample within the CoC. (not sure where??)
// Also it would be nice to have a method that finds the nearest point on a ray to a
// distance estimate. (anyone??? just taking the nearest march step sucks!)
// But still a nice trick for Shadertoy!

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

// This is my power function, based on the standard spherical coordinates as defined here:
// http://en.wikipedia.org/wiki/Spherical_coordinate_system
//
// It seems to be similar to the one Quilez uses:
// http://www.iquilezles.org/www/articles/mandelbulb/mandelbulb.htm
//
// Notice the north and south poles are different here.
void powN1(inout vec3 z, float r, inout float dr) {
	// extract polar coordinates
	float theta = acos(z.z/r);
	float phi = atan(z.y,z.x);
	dr =  pow( r, Power-1.0)*Power*dr + 1.0;
	
	// scale and rotate the point
	float zr = pow( r,Power);
	theta = theta*Power;
	phi = phi*Power;
	
	// convert back to cartesian coordinates
	z = zr*vec3(sin(theta)*cos(phi), sin(phi)*sin(theta), cos(theta));
}

// This is a power function taken from the implementation by Enforcer:
// http://www.fractalforums.com/mandelbulb-implementation/realtime-renderingoptimisations/
//
// I cannot follow its derivation from spherical coordinates,
// but it does give a nice mandelbrot like object for Power=2
void powN2(inout vec3 z, float zr0, inout float dr) {
	float zo0 = asin( z.z/zr0 );
	float zi0 = atan( z.y,z.x );
	float zr = pow( zr0, Power-1.0 );
	float zo = zo0 * Power;
	float zi = zi0 * Power;
	dr = zr*dr*Power + 1.0;
	zr *= zr0;
	z  = zr*vec3( cos(zo)*cos(zi), cos(zo)*sin(zi), sin(zo) );
}

mat3 rot;
uniform float time;
void init() {
	 rot = rotationMatrix3(normalize(RotVector), RotAngle);
       float dummy = time*10.0;
}

uniform bool Julia; checkbox[false]
uniform vec3 JuliaC; slider[(-2,-2,-2),(0,0,0),(2,2,2)]

uniform vec2 pixelSize;

vec3 iResolution = vec3(1.0/pixelSize.x, 1.0/pixelSize.y, 1.0);
float iGlobalTime = time;

//const float aperature=5.0,focalDistance=3.5;//play with these to test the DOF

//#define time iGlobalTime
//#define size iResolution

void Rotate(inout vec2 v, float angle){v=cos(angle)*v+sin(angle)*vec2(v.y,-v.x);}

float rCoC = 0.0;
vec3 mcol = 0.0;
float dB = 0.0;
//float DE(in vec3 z0){
//	z0.xz=mod(z0.xz+4., vec2(8.))-4.;
//	vec4 z=vec4(z0,1.0);
//	float d=max(abs(z.y+1.0)-1.0,length(z.xz)-0.13);
//	for(int i=0;i<2;i++){
//		Kaleido(z.xz,3.0);
//		z.z+=1.0;
//		d=min(d,HTorus(z.zyx,1.0,0.1)/z.w+0.5*rCoC);
//		z.z+=1.0;
//		z*=vec4(2.0,-2.0,2.0,2.0);
//	}
//	z.z-=0.8;
//	dB=(length(z.xyz)-1.0)/z.w+0.5*rCoC;
//	return min(d,dB);
//}
// Compute the distance from `pos` to the Mandelbox.
float DE(vec3 pos) {
	vec4 z=vec4(pos,1.0);
	float r;
	float dr=1.0;
	int i=0;
	r=length(z.xyz)/z.w+0.5*rCoC;
	while(r<Bailout && (i<ColorIterations)) {
		if (AlternateVersion) {
			powN2(z.xyz,r,dr);
		} else {
			powN1(z.xyz,r,dr);
		}
		z.xyz+=(Julia ? JuliaC : pos);
		r=length(z.xyz)/z.w+0.5*rCoC;
		z.xyz*=rot;
		if (i<ColorIterations) orbitTrap = min(orbitTrap, abs(vec4(z.x,z.y,z.z,r*r)));
		i++;
	}
	if ( (i>=Iterations)) return 0.0;
	dB=(length(z.xyz)-1.0)/z.w+0.5*rCoC;
	return 0.5*log(r)*r/dr;
	/*
	Use this code for some nice intersections (Power=2)
	float a =  max(0.5*log(r)*r/dr, abs(pos.y));
	float b = 1000;
	if (pos.y>0)  b = 0.5*log(r)*r/dr;
	return min(min(a, b),
		max(0.5*log(r)*r/dr, abs(pos.z)));
	*/
}
uniform sampler2D frontbuffer;
float CE(in vec3 z0){//same but also colors
	float d=DE(z0);
	if(abs(d-dB)<0.001)mcol+=vec3(1.0,mix(0.5,(.5-0.25*sin(z0.x*100.0)),1.-0.1*rCoC),0.0);
	else mcol+=(1.0/subframe)*texture2D(frontbuffer, 1.*z0.xy, 100.*rCoC).xyz;//vec3(0.0,abs(sin(z0.z*40.0)),1.0);
	return d+abs(sin(z0.y*100.0))*0.005;//just giving the surface some procedural texture
}
//float rand(vec2 co){// implementation found at: lumina.sourceforge.net/Tutorials/Noise.html
//	return fract(sin(dot(co*0.123,vec2(12.9898,78.233))) * 43758.5453);
//}
float CircleOfConfusion(float t){//calculates the radius of the circle of confusion at length t
	return max(0.01,abs(dot(from,dir)-t)*0.01*Aperture);
	//return (focalDistance+aperature*abs(t-focalDistance))/(focalDistance*size.y);
}
mat3 lookat(vec3 fw,vec3 up){
	fw=normalize(fw);vec3 rt=normalize(cross(fw,normalize(up)));return mat3(rt,cross(rt,fw),fw);
}
float linstep(float a, float b, float t){
	float v=(t-a)/(b-a);
	return clamp(v,0.,1.);
}

vec3 trace(vec3 from, vec3 dir, inout vec3 hit, inout vec3 hitNormal)
{
	vec3 ro=from;//vec3(cos(time),0.25+sin(time*0.3)*0.3,sin(time))*3.4;//camera setup
	vec3 L=normalize(ro+vec3(0.5,2.5,-0.5));
	vec3 rd=dir;//lookat(-ro*vec3(1.0,2.0,1.0)-vec3(1.0,0.0,0.0),vec3(0.0,1.0,0.0))*normalize(vec3((2.0*gl_FragCoord.xy-pixelSize.xy)/pixelSize.y,1.0));
	vec4 col=vec4(0.0);//color accumulator texture2D(backbuffer,(viewCoord+vec2(1.0))*0.5)
	float t=0.0;//distance traveled
	for(int i=1;i<Iterations;i++){//march loop
		if(col.w>0.9 || t>20.0)continue;//bail if we hit a surface or go out of bounds
		float d=DE(ro);
		rCoC=CircleOfConfusion(t);//calc the radius of CoC
		if(d<2.*rCoC){//if we are inside add its contribution
			mcol=vec3(0.0);//clear the color trap, collecting color samples with normal deltas
			vec2 v=vec2(rCoC*2.,0.0);//use normal deltas based on CoC radius
			vec3 N=normalize(vec3(-CE(ro-v.xyy)+CE(ro+v.xyy),-CE(ro-v.yxy)+CE(ro+v.yxy),-CE(ro-v.yyx)+CE(ro+v.yyx)));
			vec3 scol=mcol*0.1666*max(0.1,0.25+dot(N,L)*0.75);//do some fast light calcs (you can forget about shadow casting, too expensive)
			scol+=pow(max(0.0,dot(reflect(rd,N),L)),8.0)*vec3(1.0,0.9,0.8);//todo: adjust this for bokeh highlights????
			float alpha=(1.0-col.w)* linstep(-2.*rCoC,2.*rCoC,-d);//calculate the mix like cloud density
			col += vec4(scol*alpha,alpha);//blend in the new color
		}
		d=abs(d)*mix(1.-2.*rand(gl_FragCoord.xy*vec2(i)),1.,.8);//add in noise to reduce banding and create fuzz
		ro+=d*rd;//march
		t+=d;
	}//mix in background color
	vec3 scol=mix(vec3(0.0,0.2,0.1),vec3(0.4,0.5,0.6),smoothstep(0.0,0.1,rd.y));
	col.rgb+=scol*(1.0-clamp(col.w,0.0,1.0));//mix(vec3(0.0,0.2,0.1),col.rgb,clamp(col.a,0.0,1.0));
	//gl_FragColor = vec4(clamp(col.rgb,0.0,1.0),1.0);
     return  vec3(clamp(col.rgb,0.0,1.0));
}


#preset default
FOV = 0.4
Eye = 6.35793,1.85276,2.58769
Target = 1.58456,0.547569,0.369918
EquiRectangular = false
FocalPlane = 5
Aperture = 0.10233
Gamma = 2
ToneMapping = 4
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
Detail = -2.3
DetailAO = -0.5
FudgeFactor = 1
MaxRaySteps = 56
Dither = 0.5
NormalBackStep = 1
AO = 0,0,0,0.7
Specular = 0.22667
SpecularExp = 26.829
SpecularMax = 12.821
SpotLight = 1,1,1,0.4
SpotLightDir = 0.1,0.1
CamLight = 1,1,1,1.05
CamLightMin = 0
Glow = 1,1,1,0
GlowMax = 20
Fog = 0
HardShadow = 0
ShadowSoft = 2.4
Reflection = 0
DebugSun = false
BaseColor = 1,1,1
OrbitStrength = 0
X = 0.5,0.6,0.6,0.7
Y = 1,0.6,0,0.4
Z = 0.8,0.78,1,0.5
R = 0.4,0.7,1,0.12
BackgroundColor = 0.6,0.6,0.45
GradientBackground = 0.3
CycleColors = false
Cycles = 1.1
EnableFloor = false
FloorNormal = 0,0,1
FloorHeight = 0
FloorColor = 1,1,1
Up = 0.0720415,0.997093,0.02481
#endpreset
