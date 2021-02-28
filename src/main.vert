precision highp float;
attribute vec3 position;
attribute vec2 vertexCoordinate;

varying vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D perlinNoiseTexture;

uniform float time;
uniform float waveSpeed;
uniform float waveHeight;

uniform float scale;
const int limit = 3;

const float angle = 0.0;

const float s = sin(angle);
const float c = cos(angle);
const mat2 rotation = mat2(c, s, -s, c);

float getPerlinNoise(vec2 p){
  return 2.0 * texture2D(perlinNoiseTexture, p).x - 1.0;
}

float fbm(vec2 pos){
  float res = 0.0;
  float freq = 1.0;
  float amp = 1.0;
  float ampSum = 0.0;
  
  for(int i = 0; i < limit; i++){ 
    float offset = time * float(limit-i);
    res += getPerlinNoise(freq*(pos+offset)) * amp;
    ampSum += amp;

    freq *= 2.0;
    amp *= 0.5;
    
    pos *= rotation;
  }
  return res/ampSum;
}

void main(){ 
  float noiseH = waveHeight * fbm(scale * position.xz);
  vec3 offset = vec3(noiseH, 0.0, 0.0);
  float noiseV = waveHeight * fbm(scale * (position.xz + offset.xz));
  offset.y += noiseV;

  vec4 pos = projectionMatrix * viewMatrix * modelMatrix * vec4(position + offset, 1.0);
  uv = vertexCoordinate;
  gl_Position = pos;
}
