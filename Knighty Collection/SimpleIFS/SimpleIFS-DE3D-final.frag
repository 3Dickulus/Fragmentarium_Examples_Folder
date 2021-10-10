#info Simple IFS Distance Estimator (Knighty 2013)
#define providesInit
#include "Fast-Raytracer.frag"
#include "MathUtils.frag"
#group SimpleIFS

uniform int Depth; slider[0,5,20]
//Higher values remove artifacts but slows things down.
uniform int MaxIter; slider[0,100,1000]
uniform float BR2BO; slider[0,4,256]
uniform float scl ;slider[1.1,1.414,3]
uniform float Angle; slider[-180,45,180]
uniform vec3 Rot; slider[(-1,-1,-1),(1,1,1),(1,1,1)]
uniform int Type; slider[0,0,2]
uniform float otR;slider[0,0.5,1]

mat3 fracRotation;
float iterNum;
float Findex=0.;//mapping of IFS point to [0,1[
float minFindex=0.;//
float BR=2.;//Computed in init(). Bounding circle radius. The smaller, the better (that is faster) but it have to cover the fractal
float BO=16.;//Computed in init(). Bailout value. it should be = (BR*s)^2 where s>1. bigger s give more accurate results but is slower.
float od=0.;


void init() {
	BR = scl/(scl-1.);
	BO=BR2BO*BR*BR;
	iterNum = pow(2., float(Depth));
	fracRotation = rotationMatrix3(normalize(Rot), Angle);
}

//Estimate the distance to the fractal by using a simple method (learned from Msltoe)
//it gives the exact result when A is pure real or pure imaginary
float dragonSampleEst(vec3 p){
	float dd=1.;
	float q=0.,j=1.;
	for(int i=0; i<Depth; i++){
		if(dot(p,p)>BO) break;
		
		float l0=dot(p+vec3(1.,0.,0.), p+vec3(1.,0.,0.));
		float l1=dot(p-vec3(1.,0.,0.), p-vec3(1.,0.,0.));
		q*=2.;j*=0.5;
		if(min(l0,l1)==l0) {p.x+=1.; q+=1.;} 
		else p.x-=1.;//select nearest branche
		p=fracRotation*p*scl;
		dd*=scl;
	}
	minFindex=q*j;
	float d=(length(p)-BR)/dd;
	return d;
}

//Computes distance to the point in the IFS which index is the current index.
//lastDist is a given DE. If at some level the computed distance is bigger than lastDist
//that means the current index point is not the nearest so we bail out and discard all
//children of the current index point.
//We also use a static Bail out value to speed things up a little while accepting less accurate DE.
float dragonSample(vec3 p, float lastDist){
	float q=Findex;//Get the index of the current point
	float dd=1.;//running scale
	float j=iterNum;
	for(int i=0; i<Depth; i++){
		float temp=BR+lastDist*dd;//this id to avoid computing length (sqrt)
		float l2=dot(p,p);
		if(l2>0.0001+temp*temp || l2>BO) break;
		
		//get the sign of the translation from the binary representation of the index
		float sgn=2.*floor(q*2.)-1.; q=fract(q*2.); j*=.5;

		p.x+=sgn;    //translation
		p=fracRotation*p*scl;//similarity
		
		dd*=scl;
	}
	//update current index. it is not necessary to check the next j-1 points.
	//This is the main optimization
	Findex = ( Findex + j*1./iterNum );
	float d=(length(p)-BR)/dd;//distance to current point
	if(d<lastDist) minFindex=Findex;
	return min(d,lastDist);
}

float dragonSampleOT(vec3 p, float lastDist, inout float otd){
	float q=Findex;//Get the index of the current point
	float dd=1.;//running scale
	otd=min(otd,(length(p)-otR));
	float j=1.;//iterNum;
	for(int i=0; i<Depth; i++){
		float temp=BR+lastDist*dd;//this id to avoid computing length (sqrt)
		float l2=dot(p,p);
		if(l2>0.0001+temp*temp || l2>BO) break;
		
		//get the sign of the translation from the binary representation of the index
		float sgn=2.*floor(q*2.)-1.; q=fract(q*2.); j*=.5;

		p.x+=sgn;
		p=fracRotation*p*scl;//similarity
		dd*=scl;

		otd=min(otd,(length(p)-otR)/dd);
	}
	Findex = ( Findex + j);//*1./iterNum );
	float d=(length(p)-BR)/dd;//distance to current point
	if(d<lastDist) minFindex=Findex;
	return min(d,lastDist);
}

float dragonSampleKali(vec3 p, float lastDist){
	float q=Findex;//Get the index of the current point
	float d=(length(p)-BR);
	float dd=1.;//running scale
	float j=iterNum;
	for(int i=0; i<Depth; i++){
		float l2=dot(p,p);
		if(d>lastDist || l2>BO) break;
		
		//get the sign of the translation from the binary representation of the index
		float sgn=2.*floor(q*2.)-1.; q=fract(q*2.); j*=.5;

		float lp=(sgn*p.x+0.)/dd;//cutting plane

		p.x+=sgn;    //translation
		p=fracRotation*p*scl;//similarity

		dd*=scl;
		
		d=max(d,max(lp,(length(p)-BR)/dd));
	}
	//update current index. it is not necessary to check the next j-1 points.
	//This is the main optimization
	Findex = ( Findex + j*1./iterNum );
	//float d=(length(p)-BR)/dd;//distance to current point
	return min(d,lastDist);
}

float DE(vec3 z){
	//set indexes to 0
	Findex=0.;
	minFindex=0.;
	float otd=100.;
	//Get an estimate
	float d=10.;
	//refine the DE
	for(int i=0; i<MaxIter; i++){//experiment: try setting max iterations to 0
	// In principle max number of iteration should be ITER_NUM but we actually
	//do much less iterations. Maybe less than O(ITER_NUM^2). Depends also on scl.
		if(Type==0) d=dragonSample(z,d);
		else if(Type==1) d=dragonSampleOT(z,d,otd);
		else d=dragonSampleKali(z,d);
		if(Findex==1.) break;
	}
	if(Type==1) d=0.75*otd;
	return d;//length(z)-1.;
}