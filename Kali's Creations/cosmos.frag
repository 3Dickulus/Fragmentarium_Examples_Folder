// Comos by Kali (Pablo Rom�n Andrioli)

// Note: You have to use lots of subframes for dither render
#include "MathUtils.frag"
#include "3D.frag"

uniform int iterations; slider[1,12,50]
uniform float formuparam; slider[0.,8.,1.]

uniform int volsteps; slider[10,50,100]
uniform float stepsize; slider[0.001,0.02,0.1]
uniform int firststep; slider[0,0,100]
uniform float dither; slider[0.0,0.5,1.]

uniform float tile; slider[0.5,0.850,2.]
uniform float speed; slider[0.,0.2,1.]

uniform vec4 coloradjust; color[1.,1.,1.,1.,1.,1.]
uniform float coloroffset; slider[0.,0.,2.]
uniform float colorvariation; slider[0.,0.2,1.]
uniform float brightness; slider[0.,0.0,2.]
uniform float contrast; slider[0.,1.0,2.]
uniform float starbright; slider[0.,1.3,3.]
uniform float darkmatter; slider[0.,0.3,1.]
uniform float darktreshold; slider[0.,0.2,1.0]
uniform float distfading; slider[0.,0.1,1.]
uniform float opacity; slider[0.0,0.0,2.0]
uniform float saturation; slider[0.,0.500,1.]



// float rand(float r){
//	 vec2	co=vec2(cos(r*428.7895),sin(r*722.564));
//	 return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
// }

vec3 color(vec3 from, vec3 dir)
{

	//volumetric rendering
	float s=float(firststep)*stepsize+dither*stepsize*(rand(float(subframe)*.87695)-.5),fade=1., fade2=1., pa=0., sd=0.1;
	vec3 v=vec3(0.);
	for (int r=0; r<volsteps; r++) {
		vec3 p=from+s*dir;
		p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
		float pa,a=pa=0.;
		for (int i=0; i<iterations; i++) { 
			p=abs(p)/dot(p,p)-formuparam; // the magic formula
			a+=abs(length(p)-pa); // absolute sum of average change
			pa=length(p);
		}
		a=pow(abs(a),contrast)/pow(contrast,1.+contrast); // add contrast
		sd+=colorvariation;
		float cv=abs(2.-mod(sd+coloroffset,4.));
		v+=normalize(vec3(cv,cv*cv,cv*cv*cv))*pow(a,starbright)*brightness*fade*.001; // coloring based on distance
		fade*=1.-max(0.,darkmatter-a*darktreshold*.05); // dark matter, don't render near
		fade*=max(0.,1.-a*opacity*.01);
		fade*=max(0.,1.-distfading);
		if (fade<.01) break;
		pa=a;
		s+=stepsize;
	}
	v=mix(vec3(length(v)*.5),v*normalize(coloradjust.xyz),saturation); //color adjust
	return v;	
	
}

#preset default
FOV = 0.26016
Eye = 0.716321,-2.45264,-9.64875
Target = 5.24889,-5.62171,-1.31733
Up = -0.709841,-0.693659,0.122326
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 1
ToneMapping = 1
Exposure = 1
Brightness = 1
Contrast = 1
Saturation = 1
GaussianWeight = 1
AntiAliasScale = 2
iterations = 30
formuparam = 1
volsteps = 35
stepsize = 0.02575
dither = 0
tile = 0.85
speed = 0
coloroffset = 0.74726
colorvariation = 0.60256
starbright = 1.81251
darkmatter = 0.4
darktreshold = 0.68675
distfading = 0.17708
opacity = 0.06481
saturation = 0.57447
firststep = 1
coloradjust = 0.333333,0.666667,1,1
brightness = 1.13978
contrast = 0.7767
#endpreset

#preset 1
FOV = 0.47154
Eye = 1.04706,-3.78067,-9.70033
Target = 2.76747,-10.2837,-17.0998
Up = 0.423092,-0.605607,0.673968
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 0.83335
ToneMapping = 1
Exposure = 0.79593
Brightness = 0.914
Contrast = 1.4
Saturation = 1.1828
GaussianWeight = 2
AntiAliasScale = 2
iterations = 18
formuparam = 0.5647
volsteps = 500
stepsize = 0.001
dither = 0
tile = 0.85
speed = 0
coloroffset = 0.81318
colorvariation = 0.71795
starbright = 1.81251
darkmatter = 0.41111
darktreshold = 0.6747
distfading = 0.03125
opacity = 0.16667
saturation = 0.61702
firststep = 0
coloradjust = 0.666667,0.666667,1,1
brightness = 0.21506
contrast = 1.26214
#endpreset

#preset 2
FOV = 0.03252
Eye = 0.0136492,0.166667,-9.72747
Target = -6.84147,-7.11257,-9.86875
Up = -0.169798,0.0875573,0.981582
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 0.83335
ToneMapping = 1
Exposure = 0.79593
Brightness = 0.914
Contrast = 1.4
Saturation = 1.1828
GaussianWeight = 2
AntiAliasScale = 2
formuparam = 0.75294
volsteps = 10
stepsize = 0.00576
firststep = 0
dither = 0
tile = 0.85
speed = 0
coloradjust = 0.666667,0.666667,1,1
coloroffset = 0.15384
colorvariation = 0.38462
brightness = 0.19354
contrast = 1.04854
starbright = 2.25
darkmatter = 0
darktreshold = 1
distfading = 0.13542
opacity = 0.98148
saturation = 0.65957
iterations = 30
#endpreset

#preset 3
FOV = 0.47154
Eye = 1.39338,-3.67771,-9.48567
Target = 8.4876,-6.01467,-16.1349
Up = 0.278763,-0.756827,0.591188
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 0.83335
ToneMapping = 1
Exposure = 0.79593
Brightness = 0.914
Contrast = 1.4
Saturation = 1.1828
GaussianWeight = 2
AntiAliasScale = 2
formuparam = 0.8
volsteps = 92
stepsize = 0.01338
firststep = 14
dither = 0.11304
tile = 1.11628
speed = 0
coloradjust = 0.666667,0.666667,1,1
coloroffset = 0.81318
colorvariation = 0.37179
brightness = 0.68818
contrast = 0.9903
starbright = 2.09376
darkmatter = 0
darktreshold = 0.71084
distfading = 0.07292
opacity = 0.77778
saturation = 0.75532
iterations = 18
#endpreset

#preset 4
FOV = 0.43902
Eye = -0.015136,-0.00685496,-9.6008
Target = -9.09014,-0.914158,-13.7022
Up = 0.173876,-0.969955,-0.170158
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 0.83335
ToneMapping = 1
Exposure = 0.7653
Brightness = 1.72045
Contrast = 1.63365
Saturation = 0.4301
GaussianWeight = 2
AntiAliasScale = 2
formuparam = 0.58822
stepsize = 0.001
firststep = 0
dither = 0
tile = 1.56977
speed = 0
coloradjust = 1,1,0.498039,1
coloroffset = 0.21978
colorvariation = 0.5
brightness = 2
contrast = 0.73786
starbright = 1.34376
darkmatter = 0
darktreshold = 1
distfading = 0.20833
opacity = 0.57408
saturation = 1
iterations = 42
volsteps = 18
#endpreset

#preset 5
FOV = 0.34146
Eye = -0.53704,0.646949,-8.96224
Target = -9.29076,-4.10194,-9.86806
Up = 0.472999,-0.880029,0.0426772
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 0.69445
ToneMapping = 2
Exposure = 1.37754
Brightness = 1.6129
Contrast = 1.53465
Saturation = 0.96775
GaussianWeight = 2
AntiAliasScale = 2
formuparam = 0.91724
stepsize = 0.04003
firststep = 0
dither = 0.2
tile = 2
speed = 0
coloradjust = 0.666667,0.666667,1,1
coloroffset = 0.13186
colorvariation = 0.5
brightness = 2
contrast = 0.9903
starbright = 2.18751
darkmatter = 0.97778
darktreshold = 0.54217
distfading = 0
opacity = 0
saturation = 0.89362
iterations = 29
volsteps = 27
#endpreset

#preset 6
FOV = 0.34146
Eye = -0.540179,0.657358,-8.96327
Target = -3.68042,10.0054,-7.30431
Up = -0.906026,-0.3317,0.262855
EquiRectangular = false
FocalPlane = 1
Aperture = 0
Gamma = 0.60185
ToneMapping = 2
Exposure = 1.37754
Brightness = 1.98925
Contrast = 1.2376
Saturation = 0.96775
GaussianWeight = 2
AntiAliasScale = 2
stepsize = 0.04003
firststep = 0
dither = 0.09565
tile = 2
speed = 0
coloradjust = 0.666667,0.666667,1,1
coloroffset = 0.13186
colorvariation = 0.17949
brightness = 1.48388
contrast = 2
starbright = 1.125
darkmatter = 0.61111
darktreshold = 0.54217
distfading = 0
opacity = 0
saturation = 0.89362
iterations = 29
volsteps = 27
formuparam = 0.91724
#endpreset
