#info Simple IFS raytracer (Knighty 2013)
#define providesInit
#include "3D.frag"
#include "MathUtils.frag"

#group SimpleIFS
uniform int Depth; slider[0,5,20]
uniform int maxIter; slider[10,100,1000]
uniform float scl ;slider[.5,0.71,0.99]
uniform float Angle; slider[-180,45,180]
uniform vec3 Rot; slider[(-1,-1,-1),(1,1,1),(1,1,1)]

mat4 Tr1,Tr2;
float iterNum;
float BR=2.;//Computed in init(). Bounding circle radius. The smaller, the better (that is faster) but it have to cover the fractal

void init() {
	BR = scl/(1.-scl);
	iterNum = pow(2., float(Depth));
	//you can construct other transforms but you'll have to compute the right bounding sphere radius
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

float intersectIFS(vec3 ro, vec3 rd, inout vec3 nor, inout float Findex0){
	float Findex=0.;
	float d=INFINITY;
	for(int i=0; i<maxIter;i++){
		vec4 p=vec4(0.,0.,0.,1.);
		mat4 M=mat4(1.);
		float rad=BR;
		float q=Findex;
		float jj=1.;
		float t=intersectSphere(ro, rd, p.xyz, rad);
		for(int j=0; j<Depth && t<d; j++){
			//get the sign of the translation from the binary representation of the index
			float sgn=2.*floor(q*2.)-1.; q=fract(q*2.); jj*=.5;
			if(sgn>0.) M=M*Tr1; 
			else M=M*Tr2;
			p=M*vec4(0.,0.,0.,1.);		
			rad*=scl;
			t=intersectSphere(ro, rd, p.xyz, rad);
		}
		//update current index. it is not necessary to check the next j-1 points.
		//This is the main optimization
		Findex += jj;
		d=min(d,t);
		if(t==d) {nor=ro+t*rd-p.xyz; Findex0=Findex;}
		if(Findex>=1.) break;
	}
	nor=normalize(nor);
	return d;
}

vec3 color(vec3 ro, vec3 rd){
	vec3 c=vec3(0.,0.,0.);
	float fi=0.;
	vec3 n=vec3(0.);
	float t=intersectIFS(ro,rd,n,fi);//intersectSphere(ro,rd,c,r);
	if(t==INFINITY) return vec3(0.5,0.5,0.5);
	vec3 p=ro+t*rd;
	vec3 ld=normalize(vec3(1.,1.,1.));
	vec3 rv=reflect(rd,n);
	float amb=0.1;
	float dif=0.4*max(0.,dot(ld,n));
	float spec=dif>0.? 0.2*50.*pow(max(0.,dot(ld,rv)),100.) : 0.;
	vec3 col=amb*vec3(1.,1.,1.)+dif*(0.6+0.4*sin(vec3(11.,21.,4.5)*fi))+spec*vec3(1.,.5,.5);
	return  col;
}