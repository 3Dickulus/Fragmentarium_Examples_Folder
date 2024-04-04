/*///////////////////////////////////////////////////////////////////////////////
 Distance estimation for (very) simple IFS. by knighty (nov. 2013).
 
 Computing DE for IFS requires normally a priority list or at least a stack. (references later)
It happens that there is a correspondance between a 2 generators IFS and the binary representation
of a number in [0,1[. That is there is a bijection between the IFS and the [0,1[ segment. So
we can call a 2 generators IFS a CURVE.

 This fact is used to discard whole subtrees in the evaluation of the DE. (sorry I'm not good at explaning things)

? This method could be used to compute distance to any curve provided we have a way to compute
a bounding volume to any segment of that curve (for example a curve segment is contained in the circle
which radius is the length of that curve and centred at any point inside the curve segment).
This is the case of Bezier curves (there are IFS definition for them BTW). Brownian motion ...etc.

 This method could be applied in principle to other IFS. I haven't worked out those cases though. In principle
One uses the base N representation of the index for a N generator IFS. The nice thing about 2 generators IFS
is that one doesn't have to implement the arithmetic operations required. The case of LRIFS can in principle be
handled but the index representation is much more involved and complicated.

 Per se, this idea is not really new. it is already used for stackless BVH traversal. After all an IFS is some kind of BVH.

///////////////////////////////////////////////////////////////////////////////*/
#define providesInit
#include "2D.frag"
uniform float time;
#group SimpleIFS
//Depth of the IFS
uniform int depth; slider[0,9,22]
//Higher values remove artifacts but slows things down.
uniform int MaxIter; slider[0,100,1000]
//Bounding radius to bailout. must be >1. higher values -> more accurate but slower
uniform float BR2BO; slider[1,4,128]
//Scale of the transform
uniform float scl; slider[1.1,1.4141,3.]
//Rotation angle of the transform
uniform float ang; slider[0,45,360]
//Object trap radius. It's a circle but you can modify the code to get other chapes. It's then possible to choose the shape wrt depth and/or index
uniform float otR; slider[0,1.,3]
uniform int Type; slider[0,0,2]

vec2 A = vec2( 1.);//Computed in init(). Stores the similarity of the transformation
float Findex=0.;//mapping of IFS point to [0,1[
float minFindex=0.;//this is the index of the nearest point. Used for coloring.
float BR=2.;//Computed init(). Bounding circle radius. The smaller, the better (that is faster) but it have to cover the fractal
float BO=16.;//Computed in init(). Bailout value. it should be = (BR*s)^2 where s>1. bigger s give more accurate results but is slower.
float iterNum;
float od=1000.;

void init(void){
	//construct similarity using angle ang and scale scl
	A = scl*vec2(cos(radians(ang)), sin(radians(ang)));
	//compute bounding circle's radius. it's that simple :)
	BR=scl/(scl-1.);
	//Compute bail out value
	BO=BR*BR*BR2BO;
	iterNum=pow(2., float(depth));
}

//Complex multiplication
vec2 Cmult(vec2 a, vec2 b){ return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x);}

//Estimate the distance to the fractal by using a simple mathod
//it gives the exact result when A is pure real or pure imaginary
float dragonSampleEst(vec2 p){
	float dd=1.;
	float q=0.,j=1.;
	for(int i=0; i<depth; i++){
		if(dot(p,p)>BO) break;
		//p=Cmult(A,p);
		float l0=dot(p+vec2(1.,0.), p+vec2(1.,0.));
		float l1=dot(p-vec2(1.,0.), p-vec2(1.,0.));
		q*=2.;j*=0.5;
		if(min(l0,l1)==l0) {p.x+=1.; q+=1.;} 
		else p.x-=1.;//select nearest branche
		p=Cmult(A,p);
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
float dragonSample(vec2 p, float lastDist){
	float q=Findex;//Get the index of the current point
	float dd=1.;//running scale
	float j=1.;
	for(int i=0; i<depth; i++){
		float temp=BR+lastDist*dd;//this id to avoid computing length (sqrt)
		float l2=dot(p,p);
		if(l2>0.0001+temp*temp || l2>BO) break;
		//get the sign of the translation from the binary representation of the index
		float sgn=2.*floor(q*2.)-1.; q=fract(q*2.); j*=.5;
		p.x+=sgn;    //translation
		p=Cmult(A,p);//similarity
		
		dd*=scl;
	}
	//update current index. it is not necessary to check the next j-1 points.
	//This is the main optimization
	Findex += j;
	float d=(length(p)-BR)/dd;//distance to current point
	if(d<lastDist) minFindex=Findex;
	return min(d,lastDist);
}

float dragonSample1(vec2 p, float lastDist){
	float q=Findex;//Get the index of the current point
	float dd=1.;//running scale
	float d=(length(p)-BR);
	float j=1.;
	for(int i=0; i<depth; i++){
		//float temp=BR+lastDist*dd;//this id to avoid computing length (sqrt)
		float l2=dot(p,p);
		if(d>0.0001+lastDist || l2>BO) break;
		//get the sign of the translation from the binary representation of the index
		float sgn=2.*floor(q*2.)-1.; q=fract(q*2.); j*=.5;
		
		p=Cmult(A,p);//similarity
		p.x+=sgn;    //translation
		dd*=scl;
		d=(length(p)-BR)/dd;
	}
	//update current index. it is not necessary to check the next j-1 points.
	//This is the main optimization
	Findex += j;
	//float d=(length(p)-BR)/dd;//distance to current point
	if(d<lastDist) minFindex=Findex;
	return min(d,lastDist);
}

float dragonSampleOT(vec2 p, float lastDist){
	float q=Findex;//Get the index of the current point
	float dd=1.;//running scale
	float d=(length(p)-BR);
	od=min(od,(length(p)-otR));//length(p)-0.33;
	float j=1.;
	for(int i=0; i<depth; i++){
		//float temp=BR+lastDist*dd;//this id to avoid computing length (sqrt)
		float l2=dot(p,p);
		if(d>0.0001+lastDist || l2>BO) break;
		
		//get the sign of the translation from the binary representation of the index
		float sgn=2.*floor(q*2.)-1.; q=fract(q*2.); j*=.5;
		
		p.x+=sgn;    //translation
		p=Cmult(A,p);//similarity
		
		dd*=scl;
		d=(length(p)-BR)/dd;
		od=min(od,(length(p)-otR)/dd);
	}
	Findex += j;
	//float d=(length(p)-BR)/dd;//distance to current point
	if(d<lastDist) minFindex=Findex;
	return min(d,lastDist);
}

float dragonSampleKali(vec2 p, float lastDist){
	float q=Findex;//Get the index of the current point
	float d=(length(p)-BR);
	float dd=1.;//running scale
	float j=1.;
	for(int i=0; i<depth; i++){
		float l2=dot(p,p);
		if(d>lastDist || l2>BO) break;
		
		//get the sign of the translation from the binary representation of the index
		float sgn=2.*floor(q*2.)-1.; q=fract(q*2.); j*=.5;
		
		float lp=(sgn*p.x-0.)/dd;
		p.x+=sgn;    //translation
		p=Cmult(A,p);//similarity
		dd*=scl;
		d=max(d,max(lp,(length(p)-BR)/dd));
	}
	//update current index. it is not necessary to check the next j-1 points.
	//This is the main optimization
	Findex += j;
	//float d=(length(p)-BR)/dd;//distance to current point
	if(d<lastDist) minFindex=Findex;
	return min(d,lastDist);
}

vec3 color(vec2 uv)
{	
	//Get an estimate
	float d=10.;//max value for the DE
	//refine the DE
	for(int i=0; i<MaxIter; i++){//experiment: try setting max iterations to 0
	// In principle max number of iteration should be iterNum but we actually
	//do much less iterations. Maybe less than O(ITER_NUM^2). Depends also on scl.
		if(Type==0) d=dragonSample(uv,d);
		else if(Type==1) d=dragonSampleOT(uv,d);
		else  d=dragonSampleKali(uv,d);
		if(Findex==1.) break;
	}
	if(Type==1) d=od;
	//d is the estimated distance from uv to the fractal
	return vec3(pow(abs(d),0.33));//*(0.5+0.5*sin(vec4(10.,6.5,3.25,1.)*minFindex));
}