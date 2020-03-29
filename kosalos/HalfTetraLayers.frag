#info This fragment is based on code created by knighty in May 1, 2010
#info Part of a series of IFS equations
#info http://www.fractalforums.com/sierpinski-gasket/kaleidoscopic-(escape-time-ifs)
#info License unknown

#define float3 vec3
#define float4 vec4

#group Half Tetra

uniform int htMaxSteps; slider[2,20,40]
uniform float htScale; slider[30,70,120]
uniform float htCY; slider[0.1,1,3]
uniform float htAngle1; slider[-4,0,4]
uniform float htAngle2; slider[-4,0,4]

uniform bool htdoInversion; checkbox[true]
uniform float htinvX; slider[-4,0,4]
uniform float htinvY; slider[-4,0,4]
uniform float htinvZ; slider[-4,0,4]
uniform float htinvRadius; slider[0.2,3,4]
uniform float htinvAngle; slider[-2,0,3]

float3 htRotatePosition(float3 pos, int axis, float angle) {
	float ss = sin(angle);
	float cc = cos(angle);
	float qt;
	
	if(axis == 0) {
		qt = pos.x;
		pos.x = pos.x * cc - pos.y * ss;
		pos.y =    qt * ss + pos.y * cc;
	}
	
	if(axis == 1) {
		qt = pos.x;
		pos.x = pos.x * cc - pos.z * ss;
		pos.z =    qt * ss + pos.z * cc;
	}
	
	if(axis == 2) {
		qt = pos.y;
		pos.y = pos.y * cc - pos.z * ss;
		pos.z =    qt * ss + pos.z * cc;
	}
	
	return pos;
}

// =============================================

float3 htn1;
float3 htn2;
float htscale;
float3 htinvCenter;
float htinvRadius2;
float htAngle1Dyn;
float htAngle2Dyn;

void halfTetraInit() {
	htscale = htScale / 100.0;
	htn1 = normalize(float3(-1.0, htCY - 1.0, 1.0/htCY - 1.0));
	htn2 = htn1 * (htscale - 1.0);
	htinvCenter = float3(htinvX,htinvY,htinvZ);
	htinvRadius2 = htinvRadius * htinvRadius;

	htAngle1Dyn = htAngle1 + sin(time * 0.1) * 0.2;
	htAngle2Dyn = htAngle1 + sin(time * 0.15) * 0.2;
}

// =============================================

float DE_HALF_TETRAInner(float3 pos) {
	float3 sp = pos;
	int i;
	
	for(i=0;i < htMaxSteps; ++i) {
		pos = htRotatePosition(pos,0,htAngle1Dyn);
		
		if(pos.x - pos.y < 0.0) pos.xy = pos.yx;
		if(pos.x - pos.z < 0.0) pos.xz = pos.zx;
		if(pos.y - pos.z < 0.0) pos.zy = pos.yz;
		
		pos = htRotatePosition(pos,2,htAngle2Dyn);
		pos = pos * htscale - htn2;
		
		if(length(pos) > 4.0) break;
		orbitTrap = min(orbitTrap, float4(pos,dot(pos,pos)));
	}
	
	return length(pos) * pow(htscale, -float(i));
}

// =============================================

float DE_HALF_TETRA(float3 pos) {
	if(htdoInversion) {
		pos = pos - htinvCenter;
		float r = length(pos);
		float r2 = r*r;
		pos = (htinvRadius * htinvRadius / r2 ) * pos + htinvCenter;
		
		float an = atan(pos.y,pos.x) + htinvAngle;
		float ra = sqrt(pos.y * pos.y + pos.x * pos.x);
		pos.x = cos(an)*ra;
		pos.y = sin(an)*ra;
		
		float de = DE_HALF_TETRAInner(pos);
		
		de = r2 * de / (htinvRadius2 + r * de);
		return de;
	}
	
	return DE_HALF_TETRAInner(pos);
}
