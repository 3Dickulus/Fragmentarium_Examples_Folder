
#include "2D.frag"

#group Plasma
uniform float time;

float displacement(vec3 p)
{
    float cosT = cos(time);
    float sinT = sin(time);

    mat2 mat = mat2(cosT, -sinT, sinT, cosT);
    p.xz *= mat;
    p.xy *= mat;
    vec3 q = 1.75 * p;

    return length(p + vec3(sinT)) *
           log(length(p) + 1.0) +
            sin(q.x + sin(q.z + sin(q.y))) * 0.25 - 1.0;
}

vec3 color(vec2 screenPos)
{
    vec3 color;
    float d = 2.5;
    vec3 pos = normalize(vec3(screenPos, -1.0));
    float sinT = sin(time) * 0.2;

    // compute plasma color
    for (int i = 0; i < 8; ++i) {
        vec3 p = vec3(0.0, 0.0, 5.0) + pos * d;

        float positionFactor = displacement(p);
        d += min(positionFactor, 1.0);

        float clampFactor =  clamp((positionFactor- displacement(p + 0.1)) * 0.5, -0.1, 1.0);
        vec3 l = vec3(0.2 * sinT, 0.35, 0.4) + vec3(5.0, 2.5, 3.25) * clampFactor;
        color = (color + (1.0 - smoothstep(0.0, 2.5, positionFactor)) * 0.7) * l;
    }

    // background color + plasma color
    return vec3(screenPos * (vec2(1.0, 0.5) + sinT), 0.5 + sinT) + color;
}

#preset Default
Center = -0.1373071,0.0648475
Zoom = 2.011357
AntiAliasScale = 1
AntiAlias = 1
#endpreset
