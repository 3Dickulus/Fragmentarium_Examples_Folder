#info Simple IFS orbit trap raytracer (Knighty 2013)
#define providesInit
#include "3D.frag"
#include "MathUtils.frag"

#group SimpleIFS
//Recursion Depth
uniform int Depth; slider[0,5,20]
//Maximum iterations
uniform int maxIter; slider[10,100,1000]
//Scale of the transforms
uniform float scl ;slider[.5,0.71,0.99]
//Transformation angle and axis
uniform float Angle; slider[-180,45,180]
uniform vec3 Rot; slider[(-1,-1,-1),(1,1,1),(1,1,1)]
//Orbit trap sphere radius
uniform float otR;slider[0,0.5,1]

mat4 Tr1,Tr2;//The two affine transformations
float iterNum;//This is the real max number of iterations. We don't need as much ;)
float BR=2.;//Computed in init(). Bounding sphere radius. The smaller, the better (that is faster) but it have to cover the fractal

void init() {
	BR = scl/(1.-scl);
	iterNum = pow(2., float(Depth));
	//you can construct other transforms but you'll have to compute the right bounding sphere radius. A pythagore tree anyone?
	Tr1= rotationMatrix(normalize(Rot), Angle)*scale4(scl)*translate(vec3(1.,0.,0.));
	Tr2= rotationMatrix(normalize(Rot), Angle)*scale4(scl)*translate(vec3(-1.,0.,0.));
}

#define INFINITY 10000.
float intersectSphere(vec3 ro, vec3 rd, vec3 c, float r){
	float A=dot(rd,rd), B=dot(rd,ro-c), C=dot(ro-c,ro-c)-r*r;
	float D=B*B-A*C;
	if(D<=0.) return INFINITY;
	D=sqrt(D);
	float tn=(-B-D), tf=(-B+D);
	if(tf<=0.) return INFINITY;
	//if(tn<=0.) return tf/A;
	return tn/A;
}

float intersectIFSot(vec3 ro, vec3 rd, inout vec3 nor, inout float Findex0){
	float Findex=0.;
	float d=INFINITY;

	float otd=INFINITY;//object trap object intersection.
	vec3 otN=vec3(0.);//normal to the intersected orbit trap
	float otl=0.;//level of the orbit trap

	for(int i=0; i<maxIter;i++){
		vec4 p=vec4(0.,0.,0.,1.);
		mat4 M=mat4(1.);
		float rad=BR;
		float otRad=otR;//orbit trap radius
		float q=Findex;
		float jj=1.;
		float level=0.;//current level
		float t=intersectSphere(ro, rd, p.xyz, rad);

		float ot=intersectSphere(ro, rd, p.xyz, otRad);//current orbit trap instance intersection
		otd=min(otd, ot);
		if(ot==otd) {otN=ro+ot*rd-p.xyz; otl=level;}

		for(int j=0; j<Depth  && t<otd; j++){ //&& t<d
			//get the sign of the translation from the binary representation of the index
			float sgn=2.*floor(q*2.)-1.; q=fract(q*2.); jj*=.5; level+=1.;
			if(sgn>0.) M=M*Tr1; 
			else M=M*Tr2;
			p=M*vec4(0.,0.,0.,1.);		
			rad*=scl;
			otRad*=scl;
			t=intersectSphere(ro, rd, p.xyz, rad);

			ot=intersectSphere(ro, rd, p.xyz, otRad);//the orbit trap. Could be any other shape. You can even set the shape wrt to Findex and/or level ;). The object have to be contained inside the bounding sphere though.
			otd=min(otd, ot);
			if(ot==otd) {otN=ro+ot*rd-p.xyz; otl=level;}
		}
		//update current index. it is not necessary to check the next j-1 points.
		//This is the main optimization
		Findex += jj;
		d=min(d,t);
		if(t==d) {nor=ro+t*rd-p.xyz; Findex0=Findex;}
		if(Findex>=1.) break;
	}
	nor=normalize(otN);
	Findex0=otl;
	return otd;
}

vec3 color(vec3 ro, vec3 rd){
	vec3 c=vec3(0.,0.,0.);
	float fi=0.;
	vec3 n=vec3(0.);
	float t=intersectIFSot(ro,rd,n,fi);//intersectSphere(ro,rd,c,r);
	if(t==INFINITY) return vec3(0.5,0.5,0.5);
	vec3 p=ro+t*rd;
	vec3 ld=normalize(vec3(1.,1.,1.));
	vec3 rv=reflect(rd,n);
	float amb=0.1;
	float dif=0.4*max(0.,dot(ld,n));
	float spec=dif>0.? 0.2*50.*pow(max(0.,dot(ld,rv)),100.) : 0.;
	vec3 col=amb*vec3(1.,1.,1.)+dif*(0.6+0.4*sin(0.4*vec3(2.,1.,4.5)*fi))+spec*vec3(1.,.5,.5);
	return  col;
}


#preset Default
FOV = 0.4
Eye = 2.94178,0.801467,1.91957
Target = -5.3485,-2.24436,-2.77023
Up = -0.537357,0.666045,0.517331
EquiRectangular = false
FocalPlane = 2.9348
Aperture = 0.
Gamma = 1
ToneMapping = 2
Exposure = 1.5366
Brightness = 1.1039
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 1
Depth = 10
maxIter = 145
scl = 0.71
otR = 0.5
Angle = 45
Rot = 1,1,1
#endpreset
