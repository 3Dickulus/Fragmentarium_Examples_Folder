#donotrun
#info waterEffect0 algorithm based on bitek in 2013-04-13
#info https://www.shadertoy.com/view/4slGRM
#info License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

#group Water
uniform vec3  WaterPosition; slider[(-5,-5,-5),(0,0,0),(5,5,5)]
uniform float WaterTiltY; slider[0.0,1.0,6.14]
uniform float WaterTiltZ; slider[0.0,1.0,6.14]
uniform float WaveHeight; slider[0.01,0.5,1]
uniform float WaveFreq; slider[0.01,0.5,1]
uniform float WaveSpeed; slider[0.01,0.5,1]

vec3 wRotate(vec3 pos, int axis, float angle);

vec3 waterNormal;
float waterNormalSquared;

void waterInit() {
	waterNormal = vec3(1.0,0.0,0.0);
	waterNormal = wRotate(waterNormal,0,WaterTiltY);
	waterNormal = wRotate(waterNormal,1,WaterTiltZ);
	waterNormal = normalize(waterNormal);
	
	waterNormalSquared = dot(waterNormal,waterNormal);
}

// ============================================

float waterEffect0(vec3 pos) {
	float delta_theta = PI * 0.15;
	float height = 0.0;
	float ss,cc,theta = 0.0;
	float tm = WaveSpeed * (time + timeOffset) * 2.0;
	vec2 p;
	
	pos.y += positionOffset;
	float wq = WaveFreq + freqOffset;

	for (int i = 0; i < 8; ++i)	{
		p = pos.xz;
		theta = delta_theta * float(i);
		ss = sin(theta);
		cc = cos(theta);
		p.x += cc * tm * WaveFreq + tm * 0.3;
		p.y -= ss * tm * WaveFreq - tm * 0.3;
		height += cos( (p.x * cc - p.y * ss) * WaveFreq * 20.0) * wq;
	}
	
	return cos(height) * WaveHeight / 10.0;
}

// ============================================

float WaterDE(vec3 pos) {
	float sn = -dot(waterNormal, (pos - WaterPosition));
	float t2,sb = sn / waterNormalSquared;
	vec3 waterSurface = pos + sb * waterNormal;
	
	float height = waterEffect0(waterSurface);
	
	float mz2 = dot(height,height);
	orbitTrap = min(orbitTrap, vec4(normalize(waterSurface),mz2));

	waterSurface += height;
	return length(pos - waterSurface);
}

// ============================================

vec3 wRotate(vec3 pos, int axis, float angle) {
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
