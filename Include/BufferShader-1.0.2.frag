#donotrun
// This is a simple shader for rendering images
// from an accumulated buffer.

#vertex

varying vec2 coord;

void main(void)
{
	gl_Position =  gl_Vertex;
	coord = (gl_ProjectionMatrix*gl_Vertex).xy;
}

#endvertex

uniform float Gamma;
uniform float Exposure;
uniform float Brightness;
uniform float Contrast;
uniform float Saturation;
uniform int ToneMapping;
uniform bool Bloom;
uniform float BloomIntensity; 
uniform float BloomPow;
uniform int   BloomTaps; 
uniform float BloomStrong;

// RGB <-> HSV conversion, thanks to http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// HSV <-> RGB conversion, thanks to http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

/*
** Based on: http://mouaif.wordpress.com/2009/01/22/photoshop-gamma-correction-shader/
**
** Contrast, saturation, brightness
** Code of this function is from TGM's shader pack
** http://irrlicht.sourceforge.net/phpBB2/viewtopic.php?t=21057
*/
// For all settings: 1.0 = 100% 0.5=50% 1.5 = 150%
vec3 ContrastSaturationBrightness(vec3  color, float brt, float sat, float con)
{
	const vec3 LumCoeff = vec3(0.2125, 0.7154, 0.0721);
	vec3 AvgLumin = vec3(0.5);
	vec3 brtColor = color * brt;
	float intensityf = dot(brtColor, LumCoeff);
	vec3 intensity = vec3(intensityf, intensityf, intensityf);
	vec3 satColor = mix(intensity, brtColor, sat);
	vec3 conColor = mix(AvgLumin, satColor, con);
	// https://fractalforums.org/fragmentarium/17/i-cant-get-the-newest-version-to-work/2629/msg13086#msg13086
	return clamp(conColor,0.0,1.0);
}

float sigmoid(float t) {
	float K = 1.0-1./(1.0+exp(-0.5*Contrast*5.));
	t -= 0.5;
	float  x = 1./(1.0+exp(-t*Contrast*5.))-K;
	return x/((1.0-2.0*K));
}

vec3 sigmoid3(vec3 t) {
	return vec3(sigmoid(t.x),sigmoid(t.y),sigmoid(t.z));
}

varying vec2 coord;
uniform sampler2D frontbuffer;
vec4 bloom(vec2 pos, vec2 quality){//see: https://gist.github.com/BlackBulletIV/4218802
	int samples=2*BloomTaps+1;
	vec4 sum = vec4(0);
	int diff = (samples - 1) / 2;
	vec2 sizeFactor = quality;
	for (int x = -diff; x <= diff; x++)
	{
		float wx=float(x)/float(diff); wx=1.-wx*wx; wx=wx*wx;
		for (int y = -diff; y <= diff; y++)
		{
			float wy=float(y)/float(diff); wy=1.-wy*wy; wy=wy*wy;
			vec2 offset = vec2(x, y) * sizeFactor;
			sum += texture2D(frontbuffer, (pos+offset))*wx*wy;
		}
	}
	return (sum / float(samples * samples)); 
}

// Lottes 2016, "Advanced Techniques and Optimization of HDR Color Pipelines"
vec3 lottes(vec3 x) {
  const vec3 a = vec3(1.6);
  const vec3 d = vec3(0.977);
  const vec3 hdrMax = vec3(8.0);
  const vec3 midIn = vec3(0.18);
  const vec3 midOut = vec3(0.267);

  const vec3 b =
      (-pow(midIn, a) + pow(hdrMax, a) * midOut) /
      ((pow(hdrMax, a * d) - pow(midIn, a * d)) * midOut);
  const vec3 c =
      (pow(hdrMax, a * d) * pow(midIn, a) - pow(hdrMax, a) * pow(midIn, a * d) * midOut) /
      ((pow(hdrMax, a * d) - pow(midIn, a * d)) * midOut);

  return pow(x, a) / (pow(x, a * d) * b + c);
}

// Uchimura 2017, "HDR theory and practice"
// Math: https://www.desmos.com/calculator/gslcdxvipg
// Source: https://www.slideshare.net/nikuque/hdr-theory-and-practicce-jp
vec3 uchimura(vec3 x, float P, float a, float m, float l, float c, float b) {
  float l0 = ((P - m) * l) / a;
  float L0 = m - m / a;
  float L1 = m + (1.0 - m) / a;
  float S0 = m + l0;
  float S1 = m + a * l0;
  float C2 = (a * P) / (P - S1);
  float CP = -C2 / P;

  vec3 w0 = vec3(1.0 - smoothstep(0.0, m, x));
  vec3 w2 = vec3(step(m + l0, x));
  vec3 w1 = vec3(1.0 - w0 - w2);

  vec3 T = vec3(m * pow(x / m, vec3(c)) + b);
  vec3 S = vec3(P - (P - S1) * exp(CP * (x - S0)));
  vec3 L = vec3(m + a * (x - m));

  return T * w0 + L * w1 + S * w2;
}

vec3 uchimura(vec3 x) {
  const float P = 1.0;  // max display brightness
  const float a = 1.0;  // contrast
  const float m = 0.22; // linear section start
  const float l = 0.4;  // linear section length
  const float c = 1.33; // black
  const float b = 0.0;  // pedestal

  return uchimura(x, P, a, m, l, c, b);
}
// https://github.com/dmnsgn/glsl-tone-map
vec3 uncharted2Tonemap(vec3 x) {
  float A = 0.15;
  float B = 0.50;
  float C = 0.10;
  float D = 0.20;
  float E = 0.02;
  float F = 0.30;
  float W = 11.2;
  return ((x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F)) - E / F;
}

vec3 uncharted2(vec3 color) {
  const float W = 11.2;
  float exposureBias = 2.0;
  vec3 curr = uncharted2Tonemap(exposureBias * color);
  vec3 whiteScale = 1.0 / uncharted2Tonemap(vec3(W));
  return curr * whiteScale;
}

#define rgb2LUM vec3(0.2125, 0.7154, 0.0721)

void main() {
	vec2 pos = (coord+vec2(1.0))/2.0;
	vec2 pixelsiz=vec2(dFdx(pos.x),dFdy(pos.y))*BloomStrong;
	vec4 tex = texture2D(frontbuffer, pos);
	vec3 c = tex.xyz/tex.a;
	if(Bloom){
		vec4 b=bloom(pos,pixelsiz);
		b=b/b.w;
		c+=BloomIntensity*pow(b.xyz,vec3(BloomPow));
	}
	if (ToneMapping==1) {
		// Linear
		c = c*Exposure;
		c = ContrastSaturationBrightness(c, Brightness, Saturation, Contrast);
	} else if (ToneMapping==2) {
		// ExponentialExposure
		c = vec3(1.0)-exp(-c*Exposure);
		c = ContrastSaturationBrightness(c, Brightness, Saturation, Contrast);
	} else if (ToneMapping==3) {
		// Filmic: http://filmicgames.com/archives/75
		c*=Exposure;
		vec3 x = max(vec3(0.),c-vec3(0.004));
		c = (x*(6.2*x+.5))/(x*(6.2*x+1.7)+0.06);
		c = pow(c, vec3(2.2)); // It already takes the Gamma into acount
		c = ContrastSaturationBrightness(c, Brightness, Saturation, Contrast);
	} else if (ToneMapping==4) {
		// Reinhart
		c*=Exposure;
		c = c/(1.+c);
		c = ContrastSaturationBrightness(c, Brightness, Saturation, Contrast);
	}  else if (ToneMapping==5) {
		c = sigmoid3(c*Exposure+vec3(Brightness-1.0));
	}  else if (ToneMapping==6) {
		c*=Exposure;
		c = lottes(c);
		c = ContrastSaturationBrightness(c, Brightness, Saturation, Contrast);
	}  else if (ToneMapping==7) {
		c*=Exposure;
		c = uchimura(c);
		c = ContrastSaturationBrightness(c, Brightness, Saturation, Contrast);
	}  else if (ToneMapping==8) {
		c*=Exposure;
		c = uncharted2(c);
		c = ContrastSaturationBrightness(c, Brightness, Saturation, Contrast);
	}  else if (ToneMapping==9) { // 3dickulus luminance map
		c*=Exposure;
		c *= dot(c,rgb2LUM);
		c = ContrastSaturationBrightness(c, Brightness, Saturation, Contrast);
	}

	c = pow(c, vec3(1.0/Gamma));
	gl_FragColor = vec4(c,1.0);
}
