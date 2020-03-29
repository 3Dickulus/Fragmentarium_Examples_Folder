#donotrun
#info This fragment was written by kosalos on 10/13/19
#info License: use freely

#group StarBurst
uniform vec3 sbPosition; slider[(-20,-20,-20),(0,0,0),(20,20,20)]
uniform float sbThick; slider[0.0,1.0,30.0]
uniform float sbSpeed; slider[0.01,0.2,1.0]
uniform float sbSize; slider[0.1,1,20]

// ============================================

#define A0 0.0
#define A1 1.0
#define A7 0.707

uniform vec3 burstDirection[] = {
	{ A1,A0,A0 },	{ A7,A7,A0 },	{ A0,A1,A0 },	{ -A7,A7,A0 },
	{ -A1,A0,A0 },	{ -A7,-A7,A0 },	{ A0,-A1,A0 },	{ A7,-A7,A0 },
	{ A0,A0,A1 },	{ A0,A7,A7 },	{ A0,A7,-A7 },
	{ A0,A0,-A1 },	{ A0,-A7,-A7 },	{ A0,-A7,A7 },
	{ A7,A0,A7 },	{ A7,A0,-A7 },	{ -A7,A0,-A7 },	{ -A7,A0,A7 }
};

// ============================================

float StarBurstDE(vec3 pos) {
	pos += sbPosition;
	
	float result = 1000.0;
	float anim,radius,bSize,distance;
	vec3 position;
	
	for(int b=0;b<5;++b) {
		anim = fract(time * sbSpeed + float(b) / 5.0);
		radius = sbThick * (1.0 - anim) * 0.05;
		bSize = sbSize * anim;
		
		for(int i=0;i<18;++i) {
			position = pos + burstDirection[i] * bSize;
			distance = length(position) - radius;
			
			if(distance < result) 
				result = distance;
		}
	}
	 
	orbitTrap = min(orbitTrap, vec4(pos,result));
	return result;
}
