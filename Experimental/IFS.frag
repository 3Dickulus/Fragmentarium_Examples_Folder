// A very simple example of video feedback systems.
// Change to Continuous.
#buffer RGBA32F
#include "2D.frag"
#buffershader "BufferShaderIFS.frag"


#group post
uniform float Gamma; slider[0.0,2.2,5.0]
uniform bool ExponentialExposure; checkbox[false]
uniform float Exposure; slider[0.0,1.3,30.0]
uniform float Brightness; slider[0.0,1.0,5.0];
uniform float Contrast; slider[0.0,1.0,5.0];
uniform float Saturation; slider[0.0,1.0,5.0];

uniform float AARange; slider[0.1,1.,15.3]
uniform float AAExp; slider[0.1,1,15.3]
uniform bool GaussianAA; checkbox[true]

#group IFS
uniform sampler2D backbuffer;
uniform float time;


uniform float inNoise; slider[0,0.06,1.0]

vec3  sample(vec2 p) {
	if (p.x > 1.0 || p.y>1.0) return vec3(0.0);
	if (p.x < 0.0 || p.y< 0.0) return vec3(0.0);
	vec3 v1 = texture2D( backbuffer, p ).xyz*0.8;
	v1+= vec3(inNoise*vec3(p,1.0));
	return v1;
	
}

uniform float BIAS; slider[0,0.85,1.0]
uniform float BIAS2; slider[0,0.7,1.0]

uniform vec4 M1; slider[(-10,-10,-10,-10),(2,0,0,2),(10,10,10,10)]
mat2 mM1 = mat2(M1.x,M1.y,M1.z,M1.w);
uniform vec2 O1; slider[(-1,-1),(0,0),(1,1)]
uniform vec4 M2; slider[(-10,-10,-10,-10),(2,0,0,2),(10,10,10,10)]
mat2 mM2 = mat2(M2.x,M2.y,M2.z,M2.w);
uniform vec2 O2; slider[(-1,-1),(0.5,1),(1,1)]
uniform vec4 M3; slider[(-10,-10,-10,-10),(2,0,0,2),(10,10,10,10)]
mat2 mM3 =mat2(M3.x,M3.y,M3.z,M3.w);
uniform vec2 O3; slider[(-1,-1),(1,0),(1,1)]
uniform vec2 v2; slider[(-5,-5),(0,0),(5,5)]

vec3 color(vec2 z) {
	vec2 pos = (viewCoord*1.0+vec2(1.0))/2.0;
	vec3 v = sample(pos);
	vec3 v2 =sample( pos*mM1-O1+v2/2.0)+
	sample(pos*mM2-O2+v2/2.0)+
	sample(pos*mM3-O3+v2/2.0);
	v = v*BIAS+v2*BIAS2;
	return v*BIAS;
}

#preset Default
Center = 0,0
Zoom = 1
AntiAliasScale = 1
EnableTransform = true
RotateAngle = 0
StretchAngle = 0
StretchAmount = 0
AntiAlias = 1
Gamma = 2.2
ExponentialExposure = false
Exposure = 1.3
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 1
AAExp = 1
GaussianAA = true
inNoise = 0.06
BIAS = 0.85
BIAS2 = 0.7
M1 = 2,0,0,2
O1 = 0,0
M2 = 2,0,0,2
O2 = 0.5,1
M3 = 2,0,0,2
O3 = 1,0
v2 = 0,0
#endpreset

#preset Lichtenberg
Center = -0.040625,0.161111111
Zoom = 1
AntiAliasScale = 1
EnableTransform = true
RotateAngle = 0
StretchAngle = 0
StretchAmount = 0
AntiAlias = 1
Gamma = 2.2
ExponentialExposure = false
Exposure = 1.3
Brightness = 1
Contrast = 1
Saturation = 1
AARange = 1
AAExp = 1
GaussianAA = true
inNoise = 0.06
BIAS = 0.85
BIAS2 = 0.7
M1 = 2,0,0,2
O1 = 0.8727273,0.20909092
M2 = 3.612375,-1.9927206,2.8480438,0.245678
O2 = -0.55090908,0.50545456
M3 = 2,1.046406,-1.3921746,1.9381256
O3 = 1,-0.00727272
v2 = 0.5072464,-0.289855
#endpreset
