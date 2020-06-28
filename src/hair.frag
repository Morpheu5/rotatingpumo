uniform vec3 colorA; 
uniform vec3 colorB;
uniform vec2 u_resolution;
uniform sampler2D hair_tex;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vec2 st = vUv * gl_FragCoord.xy/u_resolution;
    gl_FragColor = texture(hair_tex, vUv); //vec4(texture(hair_tex, st), 1.0, 1.0);
}