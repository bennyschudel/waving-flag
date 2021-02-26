precision highp float;
attribute vec3 position;
attribute vec2 vertexCoordinate;
varying vec2 uv;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D greyNoiseTexture;
uniform float time;
uniform float waveSpeed;
uniform float waveHeight;
const float scale = 3.52;
const int limit = 3;
const float angle = 0.0;
const float s = sin(angle);
const float c = cos(angle);
const mat2 rotation = mat2(c, s, -s, c);

float noised(vec2 x) {
  vec2 f = fract(x);
  vec2 u = f * f * (3.0 - 2.0 * f);
  vec2 p = floor(x);
  float a = texture2D(greyNoiseTexture, (p + vec2(0.5, 0.5)) / 256.0).x;
  float b = texture2D(greyNoiseTexture, (p + vec2(1.5, 0.5)) / 256.0).x;
  float c = texture2D(greyNoiseTexture, (p + vec2(0.5, 1.5)) / 256.0).x;
  float d = texture2D(greyNoiseTexture, (p + vec2(1.5, 1.5)) / 256.0).x;
  float res = (a + (b - a) * u.x + (c - a) * u.y + (a - b - c + d) * u.x * u.y);
  res = res - 0.5;

  return res;
}

float fbm(vec2 pos) {
  float res = 0.0;
  float freq = 1.0;
  float amp = 1.0;
  
  for(int i = 0; i < limit; i++) { 
    float offset = time * float(limit-i);
    res += noised(freq*(pos+offset)) * amp;
    freq *= 1.75;
    amp *= 0.5;
      
    pos *= rotation;
  }

  return res;
}

void main(){ 
  float noiseH = waveHeight * fbm(scale*position.xz);
  vec3 offset = vec3(noiseH, 0.0, 0.0);
  float noiseV = waveHeight * fbm(scale*(position.xz+offset.xz));
  offset.y += noiseV;
  vec4 pos = projectionMatrix * viewMatrix * modelMatrix * vec4(position + offset, 1.0);
  uv = vertexCoordinate;
  gl_Position = pos;
}