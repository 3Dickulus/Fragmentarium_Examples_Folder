#donotrun

#buffer RGBA32F
#buffershader "BufferShader.frag"

// This is a utlity program for setting
// up anti-aliased 2D rendering.

#vertex

#if __VERSION__ <= 400
varying vec2 viewCoord;
varying vec2 coord;
varying vec2 aaScale;
#else
layout(location = 0) in vec4 vertex_position;
uniform mat4 projectionMatrix;
out vec2 viewCoord;
out vec2 coord;
out vec2 aaScale;
#endif

#group Camera

// Use this to adjust clipping planes

uniform vec2 Center; slider[(-500,-500),(0,0),(500,500)] NotLockable
uniform float Zoom; slider[1e-3,1,100000] NotLockable

uniform bool EnableTransform; checkbox[true]
uniform float RotateAngle; slider[-360,0,360]
uniform float StretchAngle; slider[-360,0,360]
uniform float StretchAmount; slider[-100,0,100]

uniform vec2 pixelSize;

void main(void)
{
	mat2 transform = mat2(1.0, 0.0, 0.0, 1.0);
	if (EnableTransform)
	{
		float b = radians(RotateAngle);
		float bc = cos(b);
		float bs = sin(b);
		float a = radians(StretchAngle);
		float ac = cos(a);
		float as = sin(a);
		float s = sqrt(pow(2.0, StretchAmount));
		mat2 m1 = mat2(ac, as, -as, ac);
		mat2 m2 = mat2(s, 0.0, 0.0, 1.0 / s);
		mat2 m3 = mat2(ac, -as, as, ac);
		mat2 m4 = mat2(bc, bs, -bs, bc);
		transform = m1 * m2 * m3 * m4;
	}
	float ar = pixelSize.y/pixelSize.x;
#if __VERSION__ <= 400
	gl_Position =  gl_Vertex;
	viewCoord = (gl_Vertex).xy;
	coord = (transform * ((gl_ProjectionMatrix*gl_Vertex).xy*vec2(ar,1.0))/Zoom+  Center);
	aaScale = vec2(gl_ProjectionMatrix[0][0],gl_ProjectionMatrix[1][1])*pixelSize/Zoom;
#else
	gl_Position =  vertex_position;
	viewCoord = (vertex_position).xy;
	coord = (transform * ((projectionMatrix*vertex_position).xy*vec2(ar,1.0))/Zoom+  Center);
	aaScale = vec2(projectionMatrix[0][0],projectionMatrix[1][1])*pixelSize/Zoom;
#endif
}

#endvertex

#if __VERSION__ <= 400
varying vec2 viewCoord;
varying vec2 coord;
varying vec2 aaScale;
#else
layout(location = 0) in vec4 vertex_position;
uniform mat4 projectionMatrix;
in vec2 viewCoord;
in vec2 coord;
in vec2 aaScale;
out vec4 fragColor;
#endif

#group Post
uniform float Gamma; slider[0.0,2.2,5.0]
// 1: Linear, 2: Exponential, 3: Filmic, 4: Reinhart
uniform int ToneMapping; slider[1,1,4]
uniform float Exposure; slider[0.0,1.0,30.0]
uniform float Brightness; slider[0.0,1.0,5.0];
uniform float Contrast; slider[0.0,1.0,5.0];
uniform float Saturation; slider[0.0,1.0,5.0];

uniform float AARange; slider[0.0,2.,15.3]
uniform float AAExp; slider[0.0,1,15.3]
uniform bool GaussianAA; checkbox[true]

vec2 aaCoord;
uniform vec2 pixelSize;

#ifdef providesFiltering
	vec4 color(vec2 z) ;
#else
	vec3 color(vec2 z) ;
#endif

#ifdef providesInit
void init(); // forward declare
#endif

uniform int subframe;

// vec2 rand(vec2 co){
// 	// implementation found at: lumina.sourceforge.net/Tutorials/Noise.html
// 	return
// 	vec2(fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453),
// 		fract(cos(dot(co.xy ,vec2(4.898,7.23))) * 23421.631));
// }

uniform sampler2D backbuffer;


vec2 uniformDisc(vec2 co) {
	if (co == vec2(0.0)) return vec2(0.0);
	vec2 r = rand2(co);
	return sqrt(r.y)*vec2(cos(r.x*6.28),sin(r.x*6.28));
}

void main() {
    aaCoord = viewCoord;
#ifdef providesInit
	init();
#endif
    //  vec2 r = rand(viewCoord*(float(subframe)+1.0))-vec2(0.5);
#ifdef providesFiltering
	#if __VERSION__ <= 400
	vec4 prev = texture2D(backbuffer,(viewCoord+vec2(1.0))/2.0);
	#else
	vec4 prev = texture(backbuffer,(viewCoord+vec2(1.0))/2.0);
	#endif
	vec4 new = color(coord.xy);
	#ifdef linearGamma
		#if __VERSION__ <= 400
	gl_FragColor = prev+ new;
		#else
	fragColor = prev+ new;
		#endif
	#else
		#if __VERSION__ <= 400
	gl_FragColor = prev+vec4( pow(new.xyz,vec3(Gamma)) , new.w);
		#else
	fragColor = prev+vec4( pow(new.xyz,vec3(Gamma)) , new.w);
		#endif
	#endif
#else
	vec2 r = uniformDisc(vec2( 1.0*(float(subframe+1)) ));
	float w =1.0;
      if (GaussianAA) {
	 	// Gaussian
		w= exp(-dot(r,r)/AAExp)-exp(-1.0/AAExp);

	      // Lancos
	      // w = sin(r.x)*sin(r.x/AARange)*sin(r.y)*sin(r.y/AARange)/(r.x*r.x*r.y*r.y*AARange*AARange);
	      // if (w!=w) w = 1.0;
	} // else {  w =pow( 1.0-length(r),1.0);};

	r*=AARange;
	vec2 c = coord.xy+aaScale*r;
	#ifdef linearGamma
	vec3 color =  color(c);
	#else
	vec3 color = pow( color(c),vec3(Gamma));
	#endif

	#if __VERSION__ <= 400
	vec4 prev = texture2D(backbuffer,(viewCoord+vec2(1.0))/2.0);
	#else
	vec4 prev = texture(backbuffer,(viewCoord+vec2(1.0))/2.0);
	#endif

	if (! (color==color)) { color =vec3( 0.0); w = 0.0; } // NAN check
	#if __VERSION__ <= 400
	gl_FragColor = vec4(prev+ vec4(color*w, w));
	#else
	fragColor = vec4(prev+ vec4(color*w, w));
	#endif
#endif
}

