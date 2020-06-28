uniform vec3 colorA; 
uniform vec3 colorB;
uniform vec2 u_resolution;
uniform sampler2D hair_tex;

uniform float u_time;

varying vec3 vNormal;
varying vec2 vUv;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

vec2 map(vec2 value, vec2 inMin, vec2 inMax, vec2 outMin, vec2 outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

vec3 map(vec3 value, vec3 inMin, vec3 inMax, vec3 outMin, vec3 outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

vec4 map(vec4 value, vec4 inMin, vec4 inMax, vec4 outMin, vec4 outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution - vec2(1.0);
    float s = cos(u_time);

    float l = 1.0 - step(1.0*uv.x +0.0*uv.y, -0.0);
    float r =       step(1.0*uv.x +0.0*uv.y, +0.0);
    
    float w1a =       step(0.5*uv.x -1.0*uv.y, -0.55);
    float w1b = 1.0 - step(0.6*uv.x -1.0*uv.y, -0.50);
    float w1 = max(max(w1a, w1b), l);

    float w2a =       step(0.5*uv.x -1.0*uv.y, -0.07);
    float w2b = 1.0 - step(0.4*uv.x -1.1*uv.y, -0.05);
    float w2 = max(max(w2a, w2b), r);

    float w3a =       step(0.45*uv.x -1.5*uv.y, -0.07);
    float w3b = 1.0 - step(0.4*uv.x -1.6*uv.y, -0.05);
    float w3 = max(max(w3a, w3b), r);

    float g = map(min(min(w1, w2), w3), 0.0, 1.0, 0.6, 0.4);
    gl_FragColor = vec4(g, g, g, 1.0);
}