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

//V2 added some of knighty's improvements (it really speeds up the march to add the CoC to DE!)

const float aperature=0.025,focalDistance=1.5,shadowCone=0.5;//play with these to test the DOF

#define time iGlobalTime
#define size iResolution


#define TAO 6.283
void Rotate(inout vec2 v, float angle) {v*=mat2(cos(angle),sin(angle),-sin(angle),cos(angle));}
void Kaleido(inout vec2 v,float power){Rotate(v,floor(.5+atan(v.x,-v.y)*power/TAO)*TAO/power);}
float HTorus(in vec3 z, float radius1, float radius2){return max(-z.y-0.055,length(vec2(length(z.xy)-radius1,z.z))-radius2-z.x*0.035);}

vec3 mcol;
float dB;
float DE(in vec3 z0){
	vec4 z=vec4(z0,1.0);
	float d=max(abs(z.y+1.0)-1.0,length(z.xz)-0.13);
	for(int i=0;i<4;i++){
		Kaleido(z.xz,3.0);
		z.z+=1.0;
		d=min(d,HTorus(z.zyx,1.0,0.1)/z.w);
		z.z+=1.0;
		z*=vec4(2.0,-2.0,2.0,2.0);
	}
	z.z-=0.8;
	dB=(length(z.xyz)-1.0)/z.w;
	return min(d,min(dB,z0.y+1.0));
}
float CE(in vec3 z0){//same but also colors
	float d=DE(z0);
	if(abs(d-z0.y-1.0)<0.001)mcol+=vec3(0.0,0.3,0.15);
	else if(abs(d-dB)<0.001)mcol+=vec3(1.0,1.0-abs(sin(z0.x*100.0)),0.0);
	else mcol+=vec3(0.0,abs(sin(z0.z*40.0)),1.0);
	return d+abs(sin(z0.y*100.0))*0.005;//just giving the surface some procedural texture
}
float rand(vec2 co){// implementation found at: lumina.sourceforge.net/Tutorials/Noise.html
	return fract(sin(dot(co*0.123,vec2(12.9898,78.233))) * 43758.5453);
}
float pixelSize;
float CircleOfConfusion(float t){//calculates the radius of the circle of confusion at length t
	return aperature*abs(t-focalDistance)+pixelSize*(1.0+t);
}
float linstep(float a, float b, float t){float v=(t-a)/(b-a);return clamp(v,0.,1.);}//from knighty

float FuzzyShadow(vec3 ro, vec3 rd, float coneGrad, float rCoC){
	float t=0.0,d=1.0,s=1.0;
	ro+=rd*0.01;
	for(int i=0;i<8;i++){
		if(s<0.1)continue;
		float r=rCoC+t*coneGrad;//radius of cone
		d=DE(ro+rd*t)+r*0.5;
		s*=linstep(-r,r,d);
		t+=abs(d)*(0.8+0.2*rand(gl_FragCoord.xy*vec2(i)));
	}
	return clamp(s*0.75+0.25,0.0,1.0);
}

mat3 lookat(vec3 fw,vec3 up){
	fw=normalize(fw);vec3 rt=normalize(cross(fw,normalize(up)));return mat3(rt,cross(rt,fw),fw);
}

void main() {
	pixelSize=1.0/size.y;
	vec3 ro=vec3(cos(time),sin(time*0.3)*0.3,sin(time))*2.4;//camera setup
	vec3 L=normalize(ro+vec3(0.5,2.5,-0.5));
	vec3 rd=lookat(-ro*vec3(1.0,2.0,1.0)-vec3(1.0,0.0,0.0),vec3(0.0,1.0,0.0))*normalize(vec3((2.0*gl_FragCoord.xy-size.xy)/size.y,1.0));
	vec4 col=vec4(0.0);//color accumulator
	float t=0.0;//distance traveled
	for(int i=1;i<42;i++){//march loop
		if(col.w>0.9 || t>10.0)continue;//bail if we hit a surface or go out of bounds
		float rCoC=CircleOfConfusion(t);//calc the radius of CoC
		float d=DE(ro)+0.25*rCoC;
		if(d<rCoC){//if we are inside add its contribution
			vec3 p=ro-rd*abs(d-rCoC);//back up to border of CoC
			mcol=vec3(0.0);//clear the color trap, collecting color samples with normal deltas
			vec2 v=vec2(rCoC*0.5,0.0);//use normal deltas based on CoC radius
			vec3 N=normalize(vec3(-CE(p-v.xyy)+CE(p+v.xyy),-CE(p-v.yxy)+CE(p+v.yxy),-CE(p-v.yyx)+CE(p+v.yyx)));
			//if(dot(N,rd)<=0.0){//it doesn't seem to matter if we take samples around the corners!
				vec3 scol=mcol*0.1666*max(0.1,0.25+dot(N,L)*0.75);
				scol+=pow(max(0.0,dot(reflect(rd,N),L)),8.0)*vec3(1.0,0.9,0.8);//todo: adjust this for bokeh highlights????
				scol*=FuzzyShadow(p,L,shadowCone,rCoC);//I wouldn't have believed this would compile but only 8 shadows steps!!!
				float alpha=(1.0-col.w)*linstep(-rCoC,rCoC,-d);//calculate the mix like cloud density
				col+=vec4(scol*alpha,alpha);//blend in the new color
			//}
		}
		d=abs(d)*(0.8+0.2*rand(gl_FragCoord.xy*vec2(i)));//add in noise to reduce banding and create fuzz
		ro+=d*rd;//march
		t+=d;
	}//mix in background color
	vec3 scol=mix(vec3(0.0,0.275,0.15)*max(0.1,0.25+dot(vec3(0.0,1.0,0.0),L)*0.75),vec3(0.4,0.5,0.6),smoothstep(0.0,0.1,rd.y));
	col.rgb+=scol*(1.0-clamp(col.w,0.0,1.0));
	gl_FragColor = vec4(clamp(col.rgb,0.0,1.0),1.0);
}

