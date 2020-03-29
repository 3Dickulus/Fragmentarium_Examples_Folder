#include "MathUtils.frag"
#include "Progressive2D.frag"
#info Plot Magnetic

#group Magnet





// Number of iterations
uniform int  Iterations; slider[10,200,10000]

uniform float R; slider[0,0,1]
uniform float G; slider[0,0.4,1]
uniform float B; slider[0,0.7,1]

uniform float Mult; slider[0,2,6]
uniform float ColDiv; slider[1,256,384]
uniform int  Formula; slider[0,0,3]

uniform vec2 XY; slider[(-2,-2),(-0.6,1.3),(2,2)]
uniform bool Invert; checkbox[false]
// coordinate to invert to infinity
uniform vec2 InvertC; slider[(-5,-5),(0,0),(5,5)]
// performs the active c = T(s)
vec2 domainMap(vec2 c)
{
    float s = dot(c, c);
    return c / s + InvertC;
}

vec2 c2 = vec2(XY);

float dist = 0.;
float p = 1.;
float q = 1.;
float a;
float b;
float m, n;

void Plot(inout vec2 z)
{

    z.x = (a * p + b * q) / (p * p + q * q);
    z.y = (p * b - a * q) / (p * p + q * q);
    a = z.x * z.x - z.y * z.y;
    z.y = Mult * z.x * z.y;
    z.x = a;
    dist = max(dist, dot(z, z));

}

vec3 color(vec2 c)
{

    if (Invert) c = domainMap(-c);
    vec2 z = c;

    int i = 0;

    if (Formula == 0) {
        for (i = 0; i < Iterations; i++) {

            a = z.x * z.x - z.y * z.y + c2.x + 3.;
            p = (z.x + z.x);
            b = p * z.y;
            p += c2.y + 2.;
            q = z.y;
            q += z.y;

            Plot(z);

            if ((abs(z.x - 1.) + abs(z.y)) < 0.0000001) break;
            if (abs(a) > 10000.) break;

        }
    } else if (Formula == 1) {

        z = vec2(.0);
        for (i = 0; i < Iterations; i++) {

            a = z.x * z.x - z.y * z.y + c.x + c2.x;
            p = b = (z.x + z.x);
            p += c.x - 1.;
            b *= z.y;
            b += c.y + c2.y;
            q = z.y + z.y + c.y;

            Plot(z);
            if ((abs(z.x - 1.) + abs(z.y)) < 0.0000001) break;
            if (abs(a) > 100000.) break;
        }
    } else if (Formula == 2) {
        for (i = 0; i < Iterations; i++) {
            a = z.x * z.x - z.y * z.y + 9.;
            b = 2. * z.x * z.y;
            p = a * z.x - b * z.y + 6.;
            q = a * z.y + b * z.x;
            a = 3. * (z.x * z.x - z.y * z.y) + (6. * z.x) + 7.;
            b = 3. * (z.x * z.y + z.x * z.y) + (6. * z.y);
            m = a * a + b * b;
            z.x = (p * a + q * b) / m + c2.x;
            z.y = (a * q - p * b) / m + c2.y;
            n = z.x * z.x - z.y * z.y;
            z.y   = Mult * z.x * z.y;
            z.x   = n;

            dist = max(dist, dot(z, z));

            if ((abs(z.x - 1.) + abs(z.y)) < 0.0000001) break;
            if (abs(a) > 10000.) break;
        }
    } else if (Formula == 3) {
        float re, im;
        float ren, imn;
        float ret, imt;
        float magr, magi;

        p = z.x + 1.;
        q = z.y;
        re = (p - 1.) * (p - 2.) - q * q;
        im = q * (2. * p - 3.);
        magr = p * p - q * q - 3. * p + 3.;
        magi = 2. * p * q - 3. * q;
        z.x = 0.;
        z.y = 0.;
        z = c;
        for (i = 0; i < Iterations; i++) {
            ren = z.x * z.x - z.y * z.y;
            imn = 2. * z.x * z.y;
            a = ren + 3. * (p - 1.);
            b = imn + 3. * q;
            ret = a * z.x - b * z.y + re;
            imt = a * z.y + b * z.x + im;
            a = 3. * ren + 3. * ((p - 2.) * z.x - q * z.y) + magr;
            b = 3. * imn + 3. * (q * z.x + (p - 2.) * z.y) + magi;
            m = a * a + b * b;
            z.x = (ret * a + imt * b) / m - c2.x;
            z.y = (a * imt - ret * b) / m - c2.y;
            a = z.x * z.x - z.y * z.y;
            z.y = Mult * z.x * z.y;
            z.x = a;

            dist = max(dist, dot(z, z));

            if ((abs(z.x - 1.) + abs(z.y)) < 0.0000001) break;
            if (abs(a) > 1000.) break;
        }
    }

    if (i < Iterations) {
        // The color scheme here is based on one from Inigo Quilez's Shader Toy:
        // http://www.iquilezles.org/www/articles/mset_smooth/mset_smooth.htm
        // float co = i - log(log(length(z))/log(Bailout))/log(2.0); // smooth iteration count
        float co = i - log2(log2(length(z)));  // equivalent optimized smooth interation count
        // float co =  i + 1. - log2(.5*log2(dot(z,z)));
        co = 6.2831 * sqrt(co / ColDiv);
        return 1. - (.5 + .5 * vec3(cos(co + R), cos(co + G), cos(co + B)));
    }  else {
        return vec3(0.0);
    }
}


#preset Default
Gamma = 2.08335
Brightness = 1
Contrast = 1
Saturation = 1
Center = 1.0135237,0.118390411
Zoom = 0.20112196
ToneMapping = 3
Exposure = 0.6522
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 256
R = 0
G = 0.4
B = 0.7
Mult = 2
ColDiv = 16
Formula = 0
XY = 0,0
Invert = false
InvertC = 0,0
#endpreset

#preset Formula1
Gamma = 2.08335
Brightness = 1
Contrast = 1
Saturation = 1
Center = 0.104287058,0.027244821
Zoom = 0.351763565
ToneMapping = 3
Exposure = 0.6522
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 256
R = 0
G = 0.4
B = 0.7
Mult = 2
ColDiv = 16
Formula = 1
XY = 0,0
Invert = false
InvertC = 0,0
#endpreset

#preset Formula2
Gamma = 2.08335
Brightness = 1
Contrast = 1
Saturation = 1
Center = 2.11695743,-0.001897514
Zoom = 0.075609195
ToneMapping = 3
Exposure = 0.6522
AARange = 2
AAExp = 1
GaussianAA = true
Iterations = 256
R = 0
G = 0.4
B = 0.7
Mult = 2
ColDiv = 16
Formula = 2
XY = 0,0
Invert = false
InvertC = 0,0
#endpreset
