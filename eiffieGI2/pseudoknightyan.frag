//Pseudo Knightyan by eiffie
//Original shader: https://www.shadertoy.com/view/lls3Wf

#include "MathUtils.frag"
#include "Progressive2D.frag"
uniform float time;
vec3 iResolution = vec3(1.0/pixelSize.x, 1.0/pixelSize.y, 1.0);

vec3 mcol=vec3(-1.0);
mat2 rmx;
int rotater=-1;
float DE(vec3 p){//knighty's pseudo kleinian
	const vec3 CSize = vec3(0.63248,0.78632,0.875);
	float DEfactor=1.;
	for(int i=0;i<5;i++){
		if(i==rotater)p.xy=p.xy*rmx;
		p=2.*clamp(p, -CSize, CSize)-p;
		float k=max(0.70968/dot(p,p),1.);
		p*=k;DEfactor*=k;
	}
	if(mcol.r>=0.0)mcol+=abs(p);
	float rxy=length(p.xy);
	return max(rxy-0.92784, abs(rxy*p.z) / length(p))/DEfactor;
}
vec3 Normal(in vec3 p, in float px){
	vec2 v=vec2(px*0.1,0.0);
	vec3 n=normalize(vec3(DE(p+v.xyy)-DE(p-v.xyy),DE(p+v.yxy)-DE(p-v.yxy),DE(p+v.yyx)-DE(p-v.yyx)));
	return (n==n)?n:vec3(0.0);
}
float randSeed;
void randomize(vec2 c){randSeed=fract(sin(dot(c,vec2(113.421,17.329)))*3134.1234);}
float rand(){return fract(sin(randSeed++)*3143.45345);}
vec3 path(float tyme){return vec3(cos(tyme),sin(tyme),-0.65+abs(sin(tyme*0.7))*0.25)*(2.0+sin(tyme*1.7)*0.5)+vec3(0.0,0.0,1.0);}
vec4 scene(vec3 ro, vec3 rd, float pathSlider, float tyme, float pxl) {
	randomize(coord.xy+tyme);
	vec3 LP=path(tyme+1.0),p;
	LP.z+=pathSlider;
	ro.z-=pathSlider;
	float d=DE(ro)*0.8,t=d*rand(),nt=d,od=1.0,ft=0.0;//t=totalDist,nt=nextDistForRealDECheck,od=lastDist,ft=fogStepDist
	vec4 col=vec4(0.0,0.0,0.0,1.0);
	vec4 am,tm=vec4(-1.0);//stacks for hit alphas and dists
	for(int i=0;i<99;i++){
		//t+=d=DE(ro+rd*t);if(t>20.0 || d<0.001)break;
		if(nt>t+ft){//prepare for fog step
			p=ro+rd*(t+ft);
			p+=(LP-p)*(-p.z)/(LP.z-p.z);//sample the point on the plane z=0
		}else{//regular march
			p=ro+rd*t;
		}
		d=DE(p);
		if(nt>t+ft){//step thru the fog and light it up
			float dL=0.05*length(ro+rd*(t+ft)-LP);//how far we step is based on distance to light
			col.rgb+=col.a*vec3(1.0,1.0,0.7)*exp(-dL*40.0)*smoothstep(0.0,0.01,d);
			if(t+ft+dL>nt){
				ft=0.0;
				t=nt;
				if(t>20.0)break;
			}else ft+=dL;
		}else{//save edge samples and march
			if(d<od && tm.w<0.0){
				float alpha=clamp(d/(pxl*t),0.0,1.0);
				if(alpha<0.95){
					am=vec4(alpha,am.xyz);tm=vec4(t,tm.xyz);
					col.a*=alpha;
				}
			}
			od=d;
			nt=t+d*(0.6+0.2*rand());
		}
	}
	vec3 tcol=vec3(0.0);
	for(int i=0;i<4;i++){//now surface lighting from the saved stack of hits
		if(tm.x<0.0)continue;
		mcol=vec3(0.0);
		p=ro+rd*tm.x;
		vec3 N=Normal(p,pxl*tm.x),L=LP-p,scol;
		mcol=sin(mcol)*0.3+vec3(0.8,0.6,0.4);
		float ls=exp(-dot(L,L)*0.2);
		p+=L*(-p.z)/L.z;
		L=normalize(L);
		scol=ls*mcol*max(0.0,dot(N,L));
		float v=max(0.0,dot(N,-rd));
		scol+=exp(-t)*mcol*v;
		d=smoothstep(0.0,0.005,DE(p));
		scol+=ls*vec3(2.0,2.0,1.7)*max(0.0,dot(N,L))*d;
		if(rd.z<0.0 && d>0.0)scol+=ls*vec3(4.0,3.0,1.4)*pow(max(0.0,dot(reflect(rd,N),L)),5.0)*(1.0-0.25*v)*d;
		tcol=mix(scol,tcol,am.x);
		am=am.yzwx;tm=tm.yzwx;
	}
	col.rgb=clamp(col.rgb+tcol,0.0,1.0);
	return vec4(col.rgb,t);
}
mat3 lookat(vec3 fw){
	fw=normalize(fw);vec3 rt=normalize(cross(fw,vec3(0.0,0.0,1.0)));return mat3(rt,cross(rt,fw),fw);
}

void SetCamera(inout vec3 ro, inout vec3 rd, inout float pathSlider,float tyme, vec2 uv){
	ro=path(tyme);
	vec3 ta=path(tyme+0.2);ta.z+=0.1;
	rd=lookat(ta-ro)*normalize(vec3(uv,1.0));
	tyme=mod(tyme,18.85);
	rmx=mat2(cos(tyme),sin(tyme),-sin(tyme),cos(tyme));
	rotater=5-int(tyme/3.1416);
	pathSlider=1.0;
	if(rotater==0)pathSlider=cos((tyme-15.707)*2.0);
}


vec3 color(vec2 J)
{
	vec2 uv=(J.xy-iResolution.xy)/iResolution.y;
	vec3 ro,rd;
	float pathSlider;
	SetCamera(ro,rd,pathSlider,time*0.125,uv);
	vec4 scn=scene(ro,rd,pathSlider,time*0.125,3.0/iResolution.y);
	return scn;
}

#preset default
Gamma = 2.08335
Brightness = 1
Contrast = 1
Saturation = 1
Center = 485.794,592.973
Zoom = 0.00228831
ToneMapping = 1
Exposure = 1
AARange = 2
AAExp = 1
GaussianAA = true
#endpreset
